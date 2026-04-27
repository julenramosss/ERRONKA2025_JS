# pakAG API Documentation

**Base URL:** `/api`  
**Content-Type:** `application/json`  
**Authentication:** JWT Bearer token via `Authorization: Bearer <access_token>` header (unless stated otherwise).

**Roles:** `admin` | `distributor`

**Package statuses:** `pending` | `assigned` | `in_transit` | `delivered` | `failed`

**Route statuses:** `planned` | `in_progress` | `completed`

**Error envelope:** All error responses follow `{ "error": "<message>" }`.

---

## Table of Contents

- [Auth](#auth)
  - [POST /api/auth/login](#post-apiauthlogin)
  - [POST /api/auth/logout](#post-apiauthlogout)
  - [POST /api/auth/refresh](#post-apiauthrefresh)
  - [GET /api/auth/me](#get-apiauthme)
  - [PATCH /api/auth/changePwd](#patch-apiauthchangepwd)
  - [POST /api/auth/forgotPassword](#post-apiauthforgotpassword)
- [Users](#users)
  - [POST /api/users/create](#post-apiuserscreate)
  - [GET /api/users/list](#get-apiuserslist)
  - [GET /api/users/getById](#get-apiusersgetbyid)
  - [PATCH /api/users/update](#patch-apiusersupdate)
  - [DELETE /api/users/remove](#delete-apiusersremove)
- [Packages](#packages)
  - [POST /api/packages/create](#post-apipackagescreate)
  - [GET /api/packages/list](#get-apipackageslist)
  - [GET /api/packages/getById](#get-apipackagesgetbyid)
  - [PATCH /api/packages/update](#patch-apipackagesupdate)
  - [DELETE /api/packages/delete](#delete-apipackagesdelete)
  - [PATCH /api/packages/updateStatus](#patch-apipackagesupdatestatus)
  - [GET /api/packages/getMyPackages](#get-apipackagesgetmypackages)
  - [GET /api/packages/getDailySummary](#get-apipackagesgetdailysummary)
- [Logs](#logs)
  - [GET /api/logs/listAll](#get-apilogslistall)
  - [GET /api/logs/listByPackage](#get-apilogslistbypackage)
- [Routes](#routes)
  - [POST /api/routes/create](#post-apiroutescreate)
  - [GET /api/routes/getMyDaily](#get-apiroutesgetmydaily)
  - [GET /api/routes/getByUserAndDate](#get-apiroutesgetbyuseranddate)
  - [PATCH /api/routes/updateStatus/:id](#patch-apiroutesupdatestatusid)
- [Stops](#stops)
  - [PATCH /api/stops/updateArrival](#patch-apistopsupdatearrival)
  - [PATCH /api/stops/reorder](#patch-apistopsreorder)
- [Tracking](#tracking)
  - [GET /api/tracking/:trackingToken](#get-apitrackingtracingtoken)

---

## Auth

---

### POST /api/auth/login

**Description:** Authenticates a user with email and password. Returns a short-lived JWT access token and a long-lived refresh token. The refresh token is written as an `HttpOnly` cookie; the access token is returned in the response body.

**Authentication:** None required.

**Cookies:**

- **Set:** `refresh_token` — UUID refresh token. `HttpOnly; SameSite=Strict; Path=/`. Lifetime determined by `JWT_REFRESH_EXPIRES_DAYS` env variable.

**Request Parameters:**

| Location    | Name       | Type   | Required | Description               |
| ----------- | ---------- | ------ | -------- | ------------------------- |
| Body (JSON) | `email`    | string | ✅       | Valid email address       |
| Body (JSON) | `password` | string | ✅       | User's plaintext password |

**Request Body Example:**

```json
{
  "email": "admin@pakag.com",
  "password": "mypassword"
}
```

**Response:**

| Status | Description      | Body                     |
| ------ | ---------------- | ------------------------ |
| 200    | Login successful | `{ user, access_token }` |

**Response Body Example (200):**

```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@pakag.com",
    "role": "admin",
    "is_active": true
  },
  "access_token": "<jwt>"
}
```

**Errors:**

| Status | Message                                                 | When does it happen                         |
| ------ | ------------------------------------------------------- | ------------------------------------------- |
| 400    | `"email is required and must be a valid email address"` | Missing or invalid email                    |
| 400    | `"password is required"`                                | Missing password                            |
| 401    | `"Invalid credentials"`                                 | Wrong email or password                     |
| 403    | `"User account is disabled"`                            | Correct credentials but `is_active = false` |
| 500    | `"Internal server error"`                               | Unhandled exception                         |

**Side Effects:** Inserts a refresh token record in the DB. Uses a dummy bcrypt hash comparison when the user is not found to prevent timing attacks.

---

### POST /api/auth/logout

**Description:** Revokes the current refresh token for the authenticated user and clears the `refresh_token` cookie.

**Authentication:** Required — `admin` or `distributor`. Bearer token in `Authorization` header.

**Cookies:**

- **Read:** `refresh_token` — the refresh token to revoke.
- **Deleted:** `refresh_token` — cleared with `Max-Age=0; HttpOnly; SameSite=Strict`.

**Request Parameters:** N/A

**Request Body Example:** N/A

**Response:**

| Status | Description       | Body                             |
| ------ | ----------------- | -------------------------------- |
| 200    | Logout successful | `{ "message": "Saioa itxi da" }` |

**Response Body Example (200):**

```json
{
  "message": "Saioa itxi da"
}
```

**Errors:**

| Status | Message                             | When does it happen               |
| ------ | ----------------------------------- | --------------------------------- |
| 401    | `"Authorization header is missing"` | No `Authorization` header         |
| 401    | `"Invalid or expired token"`        | Malformed or expired access token |
| 500    | `"Internal server error"`           | Unhandled exception               |

**Side Effects:** Marks the refresh token as revoked in the DB.

---

### POST /api/auth/refresh

**Description:** Issues a new access token and rotates the refresh token (token rotation). The old refresh token is revoked and a new one is issued.

**Authentication:** None (token-based via cookie). The `refresh_token` cookie is read directly.

**Cookies:**

- **Read:** `refresh_token` — the current valid refresh token (UUID).
- **Set:** `refresh_token` — new rotated refresh token. `HttpOnly; SameSite=Strict; Path=/`.

**Request Parameters:** N/A (token is read from cookie)

**Request Body Example:** N/A

**Response:**

| Status | Description     | Body               |
| ------ | --------------- | ------------------ |
| 200    | Token refreshed | `{ access_token }` |

**Response Body Example (200):**

```json
{
  "access_token": "<new_jwt>"
}
```

**Errors:**

| Status | Message                            | When does it happen              |
| ------ | ---------------------------------- | -------------------------------- |
| 400    | `"refresh_token is required"`      | Cookie missing or empty          |
| 401    | `"Refresh token not found"`        | Token not in DB                  |
| 401    | `"Refresh token has been revoked"` | Token was already revoked        |
| 401    | `"Refresh token has expired"`      | Token TTL exceeded               |
| 403    | `"User account is disabled"`       | User linked to token is inactive |
| 500    | `"Internal server error"`          | Unhandled exception              |

**Side Effects:** Revokes old refresh token in DB, inserts new refresh token in DB.

---

### GET /api/auth/me

**Description:** Returns the profile of the currently authenticated user.

**Authentication:** Required — `admin` or `distributor`. Bearer token in `Authorization` header.

**Cookies:** N/A

**Request Parameters:** N/A

**Request Body Example:** N/A

**Response:**

| Status | Description  | Body                                               |
| ------ | ------------ | -------------------------------------------------- |
| 200    | User profile | `{ id, name, email, role, is_active, created_at }` |

**Response Body Example (200):**

```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@pakag.com",
  "role": "admin",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**

| Status | Message                             | When does it happen                  |
| ------ | ----------------------------------- | ------------------------------------ |
| 401    | `"Authorization header is missing"` | No `Authorization` header            |
| 401    | `"Invalid or expired token"`        | Malformed or expired access token    |
| 404    | `"User not found"`                  | User in token no longer exists in DB |
| 500    | `"Internal server error"`           | Unhandled exception                  |

**Side Effects:** None.

---

### PATCH /api/auth/changePwd

**Description:** Dual-mode endpoint. When called with only `reset_pwd_token`, validates the token and returns whether it is valid (useful for showing a 404 page on the frontend if the token is invalid or expired). When called with both `reset_pwd_token` and `new_password`, sets the new password, activates the account if inactive, and revokes all existing reset tokens for the user.

**Authentication:** None required. Authenticated via the `reset_pwd_token` field.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name              | Type   | Required | Description                                                               |
| ----------- | ----------------- | ------ | -------- | ------------------------------------------------------------------------- |
| Body (JSON) | `reset_pwd_token` | string | ✅       | One-time token from the reset/activation email                            |
| Body (JSON) | `new_password`    | string | ❌       | New password, minimum 6 characters. If omitted, only validates the token. |

**Request Body Example (token check only):**

```json
{
  "reset_pwd_token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Request Body Example (change password):**

```json
{
  "new_password": "newSecurePassword123",
  "reset_pwd_token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response:**

| Status | Description      | Body                                             |
| ------ | ---------------- | ------------------------------------------------ |
| 200    | Token check      | `{ "valid": true \| false }`                     |
| 200    | Password changed | `{ "message": "Password changed successfully" }` |

**Response Body Example (200 — token check):**

```json
{
  "valid": true
}
```

**Response Body Example (200 — password changed):**

```json
{
  "message": "Password changed successfully"
}
```

**Errors:**

| Status | Message                                        | When does it happen                   |
| ------ | ---------------------------------------------- | ------------------------------------- |
| 400    | `"reset_pwd_token is required"`                | Missing token                         |
| 400    | `"new_password must be at least 6 characters"` | Too-short password                    |
| 401    | `"Invalid or expired email token"`             | Token not found in DB or already used |
| 500    | `"Internal server error"`                      | Unhandled exception                   |

**Side Effects (token check):** None.  
**Side Effects (password change):** Hashes and saves the new password. Sets `is_active = true`. Revokes all reset tokens for the user.

---

### POST /api/auth/forgotPassword

**Description:** Sends a password-reset email to the user if the email exists. Always returns the same success message regardless of whether the email was found, to prevent user enumeration.

**Authentication:** None required.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name    | Type   | Required | Description                             |
| ----------- | ------- | ------ | -------- | --------------------------------------- |
| Body (JSON) | `email` | string | ✅       | Email address to send the reset link to |

**Request Body Example:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

| Status | Description       | Body                                                                |
| ------ | ----------------- | ------------------------------------------------------------------- |
| 200    | Request processed | `{ "message": "If that email exists, a reset link has been sent" }` |

**Response Body Example (200):**

```json
{
  "message": "If that email exists, a reset link has been sent"
}
```

**Errors:**

| Status | Message                                         | When does it happen      |
| ------ | ----------------------------------------------- | ------------------------ |
| 400    | `"email is required and must be a valid email"` | Invalid or missing email |
| 500    | `"Internal server error"`                       | Unhandled exception      |

**Side Effects:** If the email exists: revokes all existing reset tokens for that user, inserts a new reset token, and sends a password-reset email via the email service. Token expiry is controlled by `RESET_EXPIRES_MINUTES` env variable.

---

## Users

---

### POST /api/users/create

**Description:** Creates a new user account. The new user is created with a default hashed password and `is_active = false`. An activation email is sent to the user so they can set their own password via `PATCH /api/auth/changePwd`.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name    | Type   | Required | Description                          |
| ----------- | ------- | ------ | -------- | ------------------------------------ |
| Body (JSON) | `name`  | string | ✅       | Full name of the user                |
| Body (JSON) | `email` | string | ✅       | Valid email address (must be unique) |
| Body (JSON) | `role`  | string | ✅       | `"admin"` or `"distributor"`         |

**Request Body Example:**

```json
{
  "name": "John Doe",
  "email": "john@pakag.com",
  "role": "distributor"
}
```

**Response:**

| Status | Description  | Body                                   |
| ------ | ------------ | -------------------------------------- |
| 201    | User created | `{ id, name, email, role, is_active }` |

**Response Body Example (201):**

```json
{
  "id": 5,
  "name": "John Doe",
  "email": "john@pakag.com",
  "role": "distributor",
  "is_active": false
}
```

**Errors:**

| Status | Message                                                     | When does it happen      |
| ------ | ----------------------------------------------------------- | ------------------------ |
| 400    | `"name is required and must be a non-empty string"`         | Missing or empty name    |
| 400    | `"email is required and must be a valid email address"`     | Missing or invalid email |
| 400    | `"role is required and must be one of: admin, distributor"` | Invalid or missing role  |
| 401    | `"Authorization header is missing"`                         | No token                 |
| 403    | `"You do not have permission to access this resource"`      | Caller is not `admin`    |
| 409    | `"A user with this email already exists"`                   | Duplicate email          |
| 500    | `"Internal server error"`                                   | Unhandled exception      |

**Side Effects:** Inserts user row with bcrypt-hashed default password. Sends an activation email with a one-time token link.

---

### GET /api/users/list

**Description:** Returns a paginated list of users, optionally filtered by role and/or active status.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name        | Type   | Required | Description                             |
| ----------- | ----------- | ------ | -------- | --------------------------------------- |
| Query param | `role`      | string | ❌       | Filter by `"admin"` or `"distributor"`  |
| Query param | `is_active` | string | ❌       | Filter by `"true"` or `"false"`         |
| Query param | `page`      | number | ❌       | Page number (default: `1`)              |
| Query param | `limit`     | number | ❌       | Results per page, 1–100 (default: `20`) |

**Request Body Example:** N/A

**Response:**

| Status | Description         | Body                            |
| ------ | ------------------- | ------------------------------- |
| 200    | Paginated user list | `{ users, total, page, limit }` |

**Response Body Example (200):**

```json
{
  "users": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@pakag.com",
      "role": "admin",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

**Errors:**

| Status | Message                                                | When does it happen    |
| ------ | ------------------------------------------------------ | ---------------------- |
| 400    | `"role must be one of: admin, distributor"`            | Invalid role value     |
| 400    | `"is_active must be 'true' or 'false'"`                | Invalid boolean string |
| 401    | `"Authorization header is missing"`                    | No token               |
| 403    | `"You do not have permission to access this resource"` | Caller is not `admin`  |
| 500    | `"Internal server error"`                              | Unhandled exception    |

**Side Effects:** None.

---

### GET /api/users/getById

**Description:** Returns the full profile of a single user by their ID.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name | Type   | Required | Description                |
| ----------- | ---- | ------ | -------- | -------------------------- |
| Query param | `id` | number | ✅       | User ID (positive integer) |

**Request Body Example:** N/A

**Response:**

| Status | Description | Body                                                           |
| ------ | ----------- | -------------------------------------------------------------- |
| 200    | User detail | `{ id, name, email, role, is_active, created_at, updated_at }` |

**Response Body Example (200):**

```json
{
  "id": 3,
  "name": "Jane Smith",
  "email": "jane@pakag.com",
  "role": "distributor",
  "is_active": true,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-03-01T08:30:00.000Z"
}
```

**Errors:**

| Status | Message                                                | When does it happen           |
| ------ | ------------------------------------------------------ | ----------------------------- |
| 400    | `"id is required"`                                     | Missing `id` query param      |
| 400    | `"id must be a positive integer"`                      | Non-integer or negative value |
| 401    | `"Authorization header is missing"`                    | No token                      |
| 403    | `"You do not have permission to access this resource"` | Caller is not `admin`         |
| 404    | `"User not found"`                                     | No user with that ID          |
| 500    | `"Internal server error"`                              | Unhandled exception           |

**Side Effects:** None.

---

### PATCH /api/users/update

**Description:** Partially updates one or more fields of an existing user. At least one field must be provided.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name        | Type    | Required | Description                    |
| ----------- | ----------- | ------- | -------- | ------------------------------ |
| Body (JSON) | `id`        | number  | ✅       | ID of the user to update       |
| Body (JSON) | `name`      | string  | ❌       | New full name                  |
| Body (JSON) | `email`     | string  | ❌       | New email (must be unique)     |
| Body (JSON) | `role`      | string  | ❌       | `"admin"` or `"distributor"`   |
| Body (JSON) | `is_active` | boolean | ❌       | Activate or deactivate account |

**Request Body Example:**

```json
{
  "id": 3,
  "name": "Jane Doe",
  "is_active": false
}
```

**Response:**

| Status | Description  | Body                                   |
| ------ | ------------ | -------------------------------------- |
| 200    | Updated user | `{ id, name, email, role, is_active }` |

**Response Body Example (200):**

```json
{
  "id": 3,
  "name": "Jane Doe",
  "email": "jane@pakag.com",
  "role": "distributor",
  "is_active": false
}
```

**Errors:**

| Status | Message                                                | When does it happen   |
| ------ | ------------------------------------------------------ | --------------------- |
| 400    | `"id must be a positive integer"`                      | Missing or invalid ID |
| 400    | `"name must be a non-empty string"`                    | Invalid name          |
| 400    | `"email must be a valid email address"`                | Invalid email         |
| 400    | `"is_active must be a boolean"`                        | Non-boolean value     |
| 400    | `"role must be one of: admin, distributor"`            | Invalid role          |
| 400    | `"at least one field must be provided to update"`      | Empty update body     |
| 401    | `"Authorization header is missing"`                    | No token              |
| 403    | `"You do not have permission to access this resource"` | Caller is not `admin` |
| 404    | `"User not found"`                                     | No user with that ID  |
| 409    | `"This email is already in use by another user"`       | Duplicate email       |
| 500    | `"Internal server error"`                              | Unhandled exception   |

**Side Effects:** None.

---

### DELETE /api/users/remove

**Description:** Permanently deletes a user by ID.

**Authentication:** Required - `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name | Type   | Required | Description       |
| ----------- | ---- | ------ | -------- | ----------------- |
| Query param | `id` | number | yes      | User ID to delete |

**Request Body Example:** N/A

**Response:**

| Status | Description  | Body       |
| ------ | ------------ | ---------- |
| 204    | User deleted | No content |

**Errors:**

| Status | Message                                                   | When does it happen                   |
| ------ | --------------------------------------------------------- | ------------------------------------- |
| 400    | `"id is required"`                                        | Missing query param                   |
| 400    | `"id must be a positive integer"`                         | Non-integer value                     |
| 401    | `"Authorization header is missing"`                       | No token                              |
| 403    | `"You do not have permission to access this resource"`    | Caller is not `admin`                 |
| 404    | `"User not found"`                                        | No user with that ID                  |
| 409    | `"User cannot be deleted because it has related records"` | User has DB records that block delete |
| 500    | `"Internal server error"`                                 | Unhandled exception                   |

**Side Effects:** Deletes the user row from the DB. Refresh, reset, and activation tokens linked to the user are removed by database cascade.

---

## Packages

---

### POST /api/packages/create

**Description:** Creates a new package. Geocodes the delivery address via the Maps API to obtain latitude/longitude, creates a tracking token, logs the creation, and sends a tracking email to the recipient.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name                             | Type           | Required | Description                                  |
| ----------- | -------------------------------- | -------------- | -------- | -------------------------------------------- |
| Body (JSON) | `packageInfo.recipient_name`     | string         | ✅       | Name of the package recipient                |
| Body (JSON) | `packageInfo.recipient_email`    | string         | ✅       | Email of the recipient                       |
| Body (JSON) | `packageInfo.assigned_to`        | number \| null | ✅       | User ID of the distributor, or `null`        |
| Body (JSON) | `packageInfo.created_by`         | number         | ✅       | User ID of the admin creating the package    |
| Body (JSON) | `packageInfo.status`             | string         | ✅       | Initial status (`pending`, `assigned`, etc.) |
| Body (JSON) | `packageInfo.weight_kg`          | number         | ✅       | Package weight in kilograms                  |
| Body (JSON) | `packageInfo.description`        | string         | ❌       | Optional package description                 |
| Body (JSON) | `packageInfo.estimated_delivery` | string         | ❌       | Estimated delivery date string               |
| Body (JSON) | `address_info.street`            | string         | ✅       | Street address                               |
| Body (JSON) | `address_info.city`              | string         | ✅       | City                                         |
| Body (JSON) | `address_info.postal_code`       | string         | ✅       | Postal/ZIP code                              |

**Request Body Example:**

```json
{
  "packageInfo": {
    "recipient_name": "Maria Garcia",
    "recipient_email": "maria@example.com",
    "assigned_to": 3,
    "created_by": 1,
    "status": "assigned",
    "weight_kg": 2.5,
    "description": "Fragile electronics"
  },
  "address_info": {
    "street": "Calle Mayor 10",
    "city": "Bilbao",
    "postal_code": "48001"
  }
}
```

**Response:**

| Status | Description     | Body                                                               |
| ------ | --------------- | ------------------------------------------------------------------ |
| 201    | Package created | Full package object with `id`, `tracking_code`, `address_id`, etc. |

**Response Body Example (201):**

```json
{
  "id": 42,
  "recipient_name": "Maria Garcia",
  "recipient_email": "maria@example.com",
  "assigned_to": 3,
  "created_by": 1,
  "status": "assigned",
  "weight_kg": 2.5,
  "description": "Fragile electronics",
  "estimated_delivery": null,
  "address_id": 18,
  "tracking_code": "TRK-2024-ABCD1234"
}
```

**Errors:**

| Status | Message                                                                | When does it happen                      |
| ------ | ---------------------------------------------------------------------- | ---------------------------------------- |
| 400    | `"packageInfo is required"` / `"address_info is required"`             | Top-level objects missing                |
| 400    | `"recipient_name is required and must be a non-empty string"`          | Invalid name                             |
| 400    | `"recipient_email is required and must be a valid email"`              | Invalid email                            |
| 400    | `"assigned_to must be a valid user ID"`                                | Non-existent user ID                     |
| 400    | `"created_by is required and must be a valid user ID"`                 | Non-existent creator                     |
| 400    | `"status is required and must be a valid package status"`              | Unknown status                           |
| 400    | `"weight_kg is required and must be a valid number"`                   | Non-numeric weight                       |
| 400    | `"street/city/postal_code is required and must be a non-empty string"` | Missing address fields                   |
| 401    | `"Authorization header is missing"`                                    | No token                                 |
| 403    | `"You do not have permission to access this resource"`                 | Caller is not `admin`                    |
| 500    | `"Internal server error"`                                              | Unhandled exception or geocoding failure |

**Side Effects:** Geocodes address (external Maps API call). Inserts address, package, tracking token, and status log rows. Sends tracking email to recipient.

---

### GET /api/packages/list

**Description:** Returns a paginated list of all packages, optionally filtered by status, assigned distributor, or city.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name          | Type   | Required | Description                             |
| ----------- | ------------- | ------ | -------- | --------------------------------------- |
| Query param | `status`      | string | ❌       | Filter by package status                |
| Query param | `assigned_to` | number | ❌       | Filter by distributor user ID           |
| Query param | `city`        | string | ❌       | Filter by delivery city                 |
| Query param | `page`        | number | ❌       | Page number (default: `1`)              |
| Query param | `limit`       | number | ❌       | Results per page, 1–100 (default: `20`) |

**Request Body Example:** N/A

**Response:**

| Status | Description            | Body                               |
| ------ | ---------------------- | ---------------------------------- |
| 200    | Paginated package list | `{ packages, total, page, limit }` |

**Response Body Example (200):**

```json
{
  "packages": [
    {
      "id": 1,
      "tracking_code": "TRK-2024-ABCD1234",
      "recipient_name": "Maria Garcia",
      "recipient_email": "maria@example.com",
      "weight_kg": 2.5,
      "description": null,
      "status": "assigned",
      "estimated_delivery": "2024-04-20",
      "address_id": 18,
      "assigned_to": 3,
      "created_by": 1,
      "created_at": "2024-04-15T10:00:00.000Z",
      "updated_at": "2024-04-15T10:00:00.000Z",
      "street": "Calle Mayor 10",
      "city": "Bilbao",
      "postal_code": "48001",
      "latitude": 43.263,
      "longitude": -2.935,
      "country": "ES"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

**Errors:**

| Status | Message                                                | When does it happen   |
| ------ | ------------------------------------------------------ | --------------------- |
| 400    | `"status must be a valid package status"`              | Unknown status value  |
| 400    | `"assigned_to must be a positive integer"`             | Non-integer value     |
| 401    | `"Authorization header is missing"`                    | No token              |
| 403    | `"You do not have permission to access this resource"` | Caller is not `admin` |
| 500    | `"Internal server error"`                              | Unhandled exception   |

**Side Effects:** None.

---

### GET /api/packages/getById

**Description:** Returns full details (including joined address) for a single package. Distributors may only access packages assigned to themselves.

**Authentication:** Required — `admin` or `distributor`.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name | Type   | Required | Description                   |
| ----------- | ---- | ------ | -------- | ----------------------------- |
| Query param | `id` | number | ✅       | Package ID (positive integer) |

**Request Body Example:** N/A

**Response:**

| Status | Description    | Body                             |
| ------ | -------------- | -------------------------------- |
| 200    | Package detail | Full `PackageWithAddress` object |

**Response Body Example (200):**

```json
{
  "id": 42,
  "tracking_code": "TRK-2024-ABCD1234",
  "recipient_name": "Maria Garcia",
  "recipient_email": "maria@example.com",
  "weight_kg": 2.5,
  "description": "Fragile electronics",
  "status": "assigned",
  "estimated_delivery": "2024-04-20",
  "address_id": 18,
  "assigned_to": 3,
  "created_by": 1,
  "created_at": "2024-04-15T10:00:00.000Z",
  "updated_at": "2024-04-15T10:00:00.000Z",
  "street": "Calle Mayor 10",
  "city": "Bilbao",
  "postal_code": "48001",
  "latitude": 43.263,
  "longitude": -2.935,
  "country": "ES"
}
```

**Errors:**

| Status | Message                                                | When does it happen                                 |
| ------ | ------------------------------------------------------ | --------------------------------------------------- |
| 400    | `"id is required"`                                     | Missing query param                                 |
| 401    | `"Authorization header is missing"`                    | No token                                            |
| 403    | `"You do not have permission to access this resource"` | Caller role not allowed                             |
| 403    | `"Access denied"`                                      | Distributor querying a package not assigned to them |
| 404    | `"Package not found"`                                  | No package with that ID                             |
| 500    | `"Internal server error"`                              | Unhandled exception                                 |

**Side Effects:** None.

---

### PATCH /api/packages/update

**Description:** Partially updates package fields and/or its delivery address. Address fields (excluding latitude/longitude) can be updated; coordinates are recomputed via the Maps API if any address field changes. Status change is logged. A tracking email is sent if status changes.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name                             | Type           | Required | Description                  |
| ----------- | -------------------------------- | -------------- | -------- | ---------------------------- |
| Query param | `id`                             | number         | ✅       | Package ID                   |
| Body (JSON) | `packageInfo.recipient_name`     | string         | ❌       | New recipient name           |
| Body (JSON) | `packageInfo.recipient_email`    | string         | ❌       | New recipient email          |
| Body (JSON) | `packageInfo.assigned_to`        | number \| null | ❌       | New distributor ID or `null` |
| Body (JSON) | `packageInfo.status`             | string         | ❌       | New package status           |
| Body (JSON) | `packageInfo.weight_kg`          | number         | ❌       | New weight                   |
| Body (JSON) | `packageInfo.description`        | string         | ❌       | New description              |
| Body (JSON) | `packageInfo.estimated_delivery` | string         | ❌       | New estimated delivery date  |
| Body (JSON) | `address_info.street`            | string         | ❌       | New street                   |
| Body (JSON) | `address_info.city`              | string         | ❌       | New city                     |
| Body (JSON) | `address_info.postal_code`       | string         | ❌       | New postal code              |
| Body (JSON) | `address_info.country`           | string         | ❌       | New country code             |

**Request Body Example:**

```json
{
  "packageInfo": {
    "assigned_to": 4,
    "status": "assigned"
  },
  "address_info": {
    "street": "Gran Vía 5",
    "city": "Bilbao"
  }
}
```

**Response:**

| Status | Description     | Body                             |
| ------ | --------------- | -------------------------------- |
| 200    | Updated package | Full `PackageWithAddress` object |

**Response Body Example (200):** Same shape as `GET /api/packages/getById`.

**Errors:**

| Status | Message                                                | When does it happen                      |
| ------ | ------------------------------------------------------ | ---------------------------------------- |
| 400    | `"id is required"`                                     | Missing `id` query param                 |
| 400    | `"id must be a positive integer"`                      | Non-integer ID                           |
| 400    | Field-specific validation messages                     | Individual field validation failures     |
| 400    | `"assigned_to must be an existing active distributor"` | Invalid distributor ID                   |
| 401    | `"Authorization header is missing"`                    | No token                                 |
| 403    | `"You do not have permission to access this resource"` | Caller is not `admin`                    |
| 404    | `"Package not found"`                                  | No package with that ID                  |
| 500    | `"Internal server error"`                              | Unhandled exception or geocoding failure |

**Side Effects:** May re-geocode address (external Maps API call). Inserts a status log entry if status changes. Sends tracking email to recipient if status changes.

---

### DELETE /api/packages/delete

**Description:** Permanently deletes a package and its associated address. Only packages in `pending` status can be deleted.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name | Type   | Required | Description          |
| ----------- | ---- | ------ | -------- | -------------------- |
| Query param | `id` | number | ✅       | Package ID to delete |

**Request Body Example:** N/A

**Response:**

| Status | Description     | Body       |
| ------ | --------------- | ---------- |
| 204    | Package deleted | No content |

**Errors:**

| Status | Message                                                | When does it happen                |
| ------ | ------------------------------------------------------ | ---------------------------------- |
| 400    | `"id is required"`                                     | Missing query param                |
| 400    | `"id must be a positive integer"`                      | Non-integer value                  |
| 400    | `"Package can only be deleted when status is pending"` | Package is not in `pending` status |
| 401    | `"Authorization header is missing"`                    | No token                           |
| 403    | `"You do not have permission to access this resource"` | Caller is not `admin`              |
| 404    | `"Package not found"`                                  | No package with that ID            |
| 500    | `"Internal server error"`                              | Unhandled exception                |

**Side Effects:** Deletes the package row and its linked address row from the DB.

---

### PATCH /api/packages/updateStatus

**Description:** Allows a distributor to transition a package's status. Only the assigned distributor can update the package. Valid transitions: `assigned → in_transit`, `in_transit → delivered`, `in_transit → failed`. A status change log entry is created and a tracking email is sent to the recipient.

**Authentication:** Required — `distributor` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name         | Type   | Required | Description                                 |
| ----------- | ------------ | ------ | -------- | ------------------------------------------- |
| Body (JSON) | `package_id` | number | ✅       | Package ID to update                        |
| Body (JSON) | `new_status` | string | ✅       | Target status (see valid transitions above) |

**Request Body Example:**

```json
{
  "package_id": 42,
  "new_status": "in_transit"
}
```

**Response:**

| Status | Description     | Body                             |
| ------ | --------------- | -------------------------------- |
| 200    | Updated package | Full `PackageWithAddress` object |

**Response Body Example (200):** Same shape as `GET /api/packages/getById`.

**Errors:**

| Status | Message                                                | When does it happen                                |
| ------ | ------------------------------------------------------ | -------------------------------------------------- |
| 400    | `"package_id must be a positive integer"`              | Invalid package ID                                 |
| 400    | `"new_status must be a valid package status"`          | Unknown status                                     |
| 400    | `"Invalid status transition from '...' to '...'"`      | Disallowed status transition                       |
| 401    | `"Authorization header is missing"`                    | No token                                           |
| 403    | `"You do not have permission to access this resource"` | Caller is not `distributor`                        |
| 403    | `"Access denied"`                                      | Package is not assigned to the calling distributor |
| 404    | `"Package not found"`                                  | No package with that ID                            |
| 500    | `"Internal server error"`                              | Unhandled exception                                |

**Side Effects:** Updates package status. Inserts a status change log entry. Sends a tracking email to the recipient with the new status.

---

### GET /api/packages/getMyPackages

**Description:** Returns all packages currently assigned to the authenticated distributor. Includes full address details.

**Authentication:** Required — `distributor` only.

**Cookies:** N/A

**Request Parameters:** N/A

**Request Body Example:** N/A

**Response:**

| Status | Description               | Body                                  |
| ------ | ------------------------- | ------------------------------------- |
| 200    | List of assigned packages | Array of `PackageWithAddress` objects |

**Response Body Example (200):**

```json
[
  {
    "id": 42,
    "tracking_code": "TRK-2024-ABCD1234",
    "recipient_name": "Maria Garcia",
    "recipient_email": "maria@example.com",
    "weight_kg": 2.5,
    "description": null,
    "status": "assigned",
    "estimated_delivery": "2024-04-20",
    "address_id": 18,
    "assigned_to": 3,
    "created_by": 1,
    "created_at": "2024-04-15T10:00:00.000Z",
    "updated_at": "2024-04-15T10:00:00.000Z",
    "street": "Calle Mayor 10",
    "city": "Bilbao",
    "postal_code": "48001",
    "latitude": 43.263,
    "longitude": -2.935,
    "country": "ES"
  }
]
```

**Errors:**

| Status | Message                                                | When does it happen         |
| ------ | ------------------------------------------------------ | --------------------------- |
| 401    | `"Authorization header is missing"`                    | No token                    |
| 403    | `"You do not have permission to access this resource"` | Caller is not `distributor` |
| 500    | `"Internal server error"`                              | Unhandled exception         |

**Side Effects:** None.

---

### GET /api/packages/getDailySummary

**Description:** Returns today's package count broken down by status, plus the total count. Used for the admin dashboard.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:** N/A

**Request Body Example:** N/A

**Response:**

| Status | Description   | Body                       |
| ------ | ------------- | -------------------------- |
| 200    | Daily summary | `{ date, summary, total }` |

**Response Body Example (200):**

```json
{
  "date": "2024-04-19",
  "summary": {
    "pending": 5,
    "assigned": 12,
    "in_transit": 8,
    "delivered": 30,
    "failed": 2
  },
  "total": 57
}
```

**Errors:**

| Status | Message                                                | When does it happen   |
| ------ | ------------------------------------------------------ | --------------------- |
| 401    | `"Authorization header is missing"`                    | No token              |
| 403    | `"You do not have permission to access this resource"` | Caller is not `admin` |
| 500    | `"Internal server error"`                              | Unhandled exception   |

**Side Effects:** None.

---

## Logs

---

### GET /api/logs/listAll

**Description:** Returns a paginated log of all package status changes across the system. Optionally filtered by package, user, and date range.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name        | Type   | Required | Description                                        |
| ----------- | ----------- | ------ | -------- | -------------------------------------------------- |
| Query param | `packageId` | number | ❌       | Filter by package ID (must exist)                  |
| Query param | `changedBy` | number | ❌       | Filter by user ID who made the change (must exist) |
| Query param | `fromDate`  | string | ❌       | Start date filter (any valid date string)          |
| Query param | `toDate`    | string | ❌       | End date filter (any valid date string)            |
| Query param | `page`      | number | ❌       | Page number (default: `1`)                         |
| Query param | `limit`     | number | ❌       | Results per page, 1–100 (default: `20`)            |

**Request Body Example:** N/A

**Response:**

| Status | Description        | Body                           |
| ------ | ------------------ | ------------------------------ |
| 200    | Paginated log list | `{ logs, total, page, limit }` |

**Response Body Example (200):**

```json
{
  "logs": [
    {
      "id": 10,
      "packageId": 42,
      "changedBy": 3,
      "oldStatus": "assigned",
      "newStatus": "in_transit",
      "notes": null,
      "changedAt": "2024-04-19T09:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

**Errors:**

| Status | Message                                                | When does it happen   |
| ------ | ------------------------------------------------------ | --------------------- |
| 400    | `"packageId must be a valid package ID"`               | Non-existent package  |
| 400    | `"changedBy must be a valid user ID"`                  | Non-existent user     |
| 400    | `"fromDate must be a valid date string"`               | Unparseable date      |
| 400    | `"toDate must be a valid date string"`                 | Unparseable date      |
| 401    | `"Authorization header is missing"`                    | No token              |
| 403    | `"You do not have permission to access this resource"` | Caller is not `admin` |
| 500    | `"Internal server error"`                              | Unhandled exception   |

**Side Effects:** None.

---

### GET /api/logs/listByPackage

**Description:** Returns the status-change history for a specific package. Admins can see all logs; distributors can only see logs for packages assigned to them.

**Authentication:** Required — `admin` or `distributor`.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name        | Type   | Required | Description                             |
| ----------- | ----------- | ------ | -------- | --------------------------------------- |
| Query param | `packageId` | number | ✅       | Package ID (must exist)                 |
| Query param | `page`      | number | ❌       | Page number (default: `1`)              |
| Query param | `limit`     | number | ❌       | Results per page, 1–100 (default: `20`) |

**Request Body Example:** N/A

**Response:**

| Status | Description           | Body                           |
| ------ | --------------------- | ------------------------------ |
| 200    | Paginated log entries | `{ logs, total, page, limit }` |

**Response Body Example (200):**

```json
{
  "logs": [
    {
      "id": 10,
      "packageId": 42,
      "oldStatus": null,
      "newStatus": "pending",
      "changedBy": 1,
      "notes": null,
      "changedAt": "2024-04-15T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

**Errors:**

| Status | Message                                                | When does it happen     |
| ------ | ------------------------------------------------------ | ----------------------- |
| 400    | `"packageId is required"`                              | Missing query param     |
| 400    | `"packageId must be a positive integer"`               | Non-integer value       |
| 400    | `"packageId must be a valid package ID"`               | Non-existent package    |
| 401    | `"Authorization header is missing"`                    | No token                |
| 403    | `"You do not have permission to access this resource"` | Caller role not allowed |
| 500    | `"Internal server error"`                              | Unhandled exception     |

**Side Effects:** None. Note: distributors are automatically scoped to their own packages by the service layer.

---

## Routes

---

### POST /api/routes/create

**Description:** Creates a delivery route for a specific distributor on a given future date. The packages are fetched, validated (must be `assigned` to the target distributor), and the stop order is optimized via the Maps API (TSP optimization starting from the warehouse origin). Estimated arrival times and package delivery dates are updated after optimization.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name          | Type     | Required | Description                                                                         |
| ----------- | ------------- | -------- | -------- | ----------------------------------------------------------------------------------- |
| Body (JSON) | `user_id`     | number   | ✅       | ID of the distributor this route is for (must exist)                                |
| Body (JSON) | `date`        | string   | ✅       | Route date in `YYYY-MM-DD` format (must be at least tomorrow)                       |
| Body (JSON) | `package_ids` | number[] | ✅       | Non-empty array of package IDs (no duplicates, all must be `assigned` to `user_id`) |

**Request Body Example:**

```json
{
  "user_id": 3,
  "date": "2024-04-25",
  "package_ids": [42, 43, 44]
}
```

**Response:**

| Status | Description   | Body                     |
| ------ | ------------- | ------------------------ |
| 201    | Route created | `{ route, stops, meta }` |

**Response Body Example (201):**

```json
{
  "route": {
    "id": 7,
    "user_id": 3,
    "route_date": "2024-04-25",
    "status": "planned",
    "created_at": "2024-04-19T10:00:00.000Z"
  },
  "stops": [
    {
      "id": 21,
      "package_id": 43,
      "stop_order": 1,
      "estimated_arrival": "09:30:00",
      "package": {
        "recipient_name": "Maria Garcia",
        "address": {
          "street": "Calle Mayor 10",
          "city": "Bilbao",
          "lat": 43.263,
          "lng": -2.935
        }
      }
    }
  ],
  "meta": {
    "totalStops": 3,
    "totalDistanceKm": 45.2,
    "totalDurationMin": 72
  }
}
```

**Errors:**

| Status | Message                                                   | When does it happen                     |
| ------ | --------------------------------------------------------- | --------------------------------------- |
| 400    | `"user_id is required and must be a valid user ID"`       | Non-existent or invalid user            |
| 400    | `"date is required and must be in YYYY-MM-DD format"`     | Invalid or missing date                 |
| 400    | `"Route date must be at least tomorrow"`                  | Date is today or in the past            |
| 400    | `"package_ids is required and must be a non-empty array"` | Empty or missing array                  |
| 400    | `"All package_ids must be valid package IDs"`             | Any ID doesn't exist                    |
| 400    | `"package_ids must not contain duplicates"`               | Repeated IDs                            |
| 400    | `"user_id must belong to a distributor"`                  | User is not a distributor               |
| 400    | `"Package X is not in 'assigned' status"`                 | Package not ready for routing           |
| 400    | `"Package X is not assigned to user Y"`                   | Package belongs to another distributor  |
| 401    | `"Authorization header is missing"`                       | No token                                |
| 403    | `"You do not have permission to access this resource"`    | Caller is not `admin`                   |
| 404    | `"User X not found"`                                      | User does not exist                     |
| 404    | `"One or more package_ids do not exist"`                  | Missing packages                        |
| 409    | `"Route already exists for user X on Y"`                  | Duplicate route for same user+date      |
| 500    | `"Internal server error"`                                 | Unhandled exception or Maps API failure |

**Side Effects:** External Maps API call for route optimization. Inserts route and stop rows. Updates `estimated_delivery` on each package.

---

### GET /api/routes/getMyDaily

**Description:** Returns the authenticated distributor's delivery route for a given date (defaults to today). Includes all stops with package and address details.

**Authentication:** Required — `distributor` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name   | Type   | Required | Description                                           |
| ----------- | ------ | ------ | -------- | ----------------------------------------------------- |
| Query param | `date` | string | ❌       | Route date in `YYYY-MM-DD` format (defaults to today) |

**Request Body Example:** N/A

**Response:**

| Status | Description      | Body               |
| ------ | ---------------- | ------------------ |
| 200    | Route with stops | `{ route, stops }` |

**Response Body Example (200):**

```json
{
  "route": {
    "id": 7,
    "route_date": "2024-04-19"
  },
  "stops": [
    {
      "id": 21,
      "stop_order": 1,
      "estimated_arrival": "09:30:00",
      "actual_arrival": null,
      "package": {
        "id": 42,
        "recipient_name": "Maria Garcia",
        "status": "assigned",
        "address": {
          "street": "Calle Mayor 10",
          "city": "Bilbao",
          "lat": 43.263,
          "lng": -2.935
        }
      }
    }
  ]
}
```

**Errors:**

| Status | Message                                                | When does it happen         |
| ------ | ------------------------------------------------------ | --------------------------- |
| 400    | `"date must be in YYYY-MM-DD format"`                  | Invalid date format         |
| 401    | `"Authorization header is missing"`                    | No token                    |
| 403    | `"You do not have permission to access this resource"` | Caller is not `distributor` |
| 404    | `"No route found for date YYYY-MM-DD"`                 | No route for that date      |
| 500    | `"Internal server error"`                              | Unhandled exception         |

**Side Effects:** None.

---

### GET /api/routes/getByUserAndDate

**Description:** Returns a specific distributor's delivery route for a given date. Admin-only equivalent of `getMyDaily`.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name      | Type   | Required | Description                       |
| ----------- | --------- | ------ | -------- | --------------------------------- |
| Query param | `user_id` | number | ✅       | Distributor's user ID             |
| Query param | `date`    | string | ✅       | Route date in `YYYY-MM-DD` format |

**Request Body Example:** N/A

**Response:**

| Status | Description      | Body                                       |
| ------ | ---------------- | ------------------------------------------ |
| 200    | Route with stops | Same shape as `GET /api/routes/getMyDaily` |

**Response Body Example (200):** Same shape as `GET /api/routes/getMyDaily`.

**Errors:**

| Status | Message                                                | When does it happen   |
| ------ | ------------------------------------------------------ | --------------------- |
| 400    | `"user_id is required"`                                | Missing query param   |
| 400    | `"user_id must be a positive integer"`                 | Non-integer           |
| 400    | `"date is required"`                                   | Missing query param   |
| 400    | `"date must be in YYYY-MM-DD format"`                  | Invalid format        |
| 401    | `"Authorization header is missing"`                    | No token              |
| 403    | `"You do not have permission to access this resource"` | Caller is not `admin` |
| 404    | `"No route found for user X on YYYY-MM-DD"`            | Route does not exist  |
| 500    | `"Internal server error"`                              | Unhandled exception   |

**Side Effects:** None.

---

### PATCH /api/routes/updateStatus/:id

**Description:** Advances a route's status through the allowed state machine. Valid transitions: `planned → in_progress → completed`. Distributors can only update their own routes; admins can update any route.

**Authentication:** Required — `admin` or `distributor`.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name     | Type   | Required | Description                                     |
| ----------- | -------- | ------ | -------- | ----------------------------------------------- |
| Path param  | `id`     | number | ✅       | Route ID (positive integer)                     |
| Body (JSON) | `status` | string | ✅       | Target status: `"in_progress"` or `"completed"` |

**Request Body Example:**

```json
{
  "status": "in_progress"
}
```

**Response:**

| Status | Description    | Body                                    |
| ------ | -------------- | --------------------------------------- |
| 200    | Status updated | `{ "message": "Route status updated" }` |

**Response Body Example (200):**

```json
{
  "message": "Route status updated"
}
```

**Errors:**

| Status | Message                                                   | When does it happen                               |
| ------ | --------------------------------------------------------- | ------------------------------------------------- |
| 400    | `"routeId must be a positive integer"`                    | Non-integer path param                            |
| 400    | `"status must be 'in_progress' or 'completed'"`           | Invalid target status                             |
| 400    | `"Cannot transition from '...' to '...'. Expected '...'"` | Disallowed state transition                       |
| 401    | `"Authorization header is missing"`                       | No token                                          |
| 403    | `"You do not have permission to access this resource"`    | Caller role not allowed                           |
| 403    | `"You can only update your own routes"`                   | Distributor trying to update another user's route |
| 404    | `"Route not found"`                                       | No route with that ID                             |
| 500    | `"Internal server error"`                                 | Unhandled exception                               |

**Side Effects:** Updates `status` column on the route row.

---

## Stops

---

### PATCH /api/stops/updateArrival

**Description:** Records the actual arrival time for a route stop (marks it as visited). Only the distributor assigned to the route containing the stop may call this. Each stop can only be marked once.

**Authentication:** Required — `distributor` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name      | Type   | Required | Description                      |
| ----------- | --------- | ------ | -------- | -------------------------------- |
| Body (JSON) | `stop_id` | number | ✅       | Route stop ID (positive integer) |

**Request Body Example:**

```json
{
  "stop_id": 21
}
```

**Response:**

| Status | Description      | Body        |
| ------ | ---------------- | ----------- |
| 200    | Arrival recorded | Stop object |

**Response Body Example (200):**

```json
{
  "id": 21,
  "route_id": 7,
  "package_id": 42,
  "stop_order": 1,
  "estimated_arrival": "09:30:00",
  "actual_arrival": "09:45:12"
}
```

**Errors:**

| Status | Message                                                | When does it happen                         |
| ------ | ------------------------------------------------------ | ------------------------------------------- |
| 400    | `"stop_id is required and must be a positive integer"` | Missing or invalid stop ID                  |
| 401    | `"Authorization header is missing"`                    | No token                                    |
| 403    | `"You do not have permission to access this resource"` | Caller is not `distributor`                 |
| 403    | `"You can only update your own route stops"`           | Stop belongs to another distributor's route |
| 404    | `"Stop X not found"`                                   | No stop with that ID                        |
| 409    | `"Stop X already has an arrival recorded"`             | Stop already marked                         |
| 500    | `"Internal server error"`                              | Unhandled exception                         |

**Side Effects:** Writes `actual_arrival = NOW()` to the stop row.

---

### PATCH /api/stops/reorder

**Description:** Reassigns stop ordering for all stops in a route. Useful when an admin manually reorders the delivery sequence. All stops in the route must be included; no extra stops from other routes are permitted.

**Authentication:** Required — `admin` only.

**Cookies:** N/A

**Request Parameters:**

| Location    | Name                  | Type     | Required | Description                                                                       |
| ----------- | --------------------- | -------- | -------- | --------------------------------------------------------------------------------- |
| Body (JSON) | `route_id`            | number   | ✅       | Route ID whose stops are being reordered                                          |
| Body (JSON) | `stops`               | object[] | ✅       | Non-empty array of `{ stop_id, order_index }` (no duplicate `order_index` values) |
| Body (JSON) | `stops[].stop_id`     | number   | ✅       | Stop ID (must belong to `route_id`)                                               |
| Body (JSON) | `stops[].order_index` | number   | ✅       | New 1-based order position (positive integer, unique)                             |

**Request Body Example:**

```json
{
  "route_id": 7,
  "stops": [
    { "stop_id": 21, "order_index": 2 },
    { "stop_id": 22, "order_index": 1 },
    { "stop_id": 23, "order_index": 3 }
  ]
}
```

**Response:**

| Status | Description     | Body                          |
| ------ | --------------- | ----------------------------- |
| 200    | Reordered stops | Array of updated stop objects |

**Response Body Example (200):**

```json
[
  {
    "id": 22,
    "route_id": 7,
    "package_id": 43,
    "stop_order": 1,
    "estimated_arrival": "09:15:00",
    "actual_arrival": null
  },
  {
    "id": 21,
    "route_id": 7,
    "package_id": 42,
    "stop_order": 2,
    "estimated_arrival": "09:30:00",
    "actual_arrival": null
  }
]
```

**Errors:**

| Status | Message                                                            | When does it happen          |
| ------ | ------------------------------------------------------------------ | ---------------------------- |
| 400    | `"route_id is required and must be a positive integer"`            | Missing or invalid route ID  |
| 400    | `"stops is required and must be a non-empty array"`                | Empty or missing stops array |
| 400    | `"Each stop must have a positive integer stop_id and order_index"` | Invalid stop item            |
| 400    | `"order_index values must not contain duplicates"`                 | Duplicate ordering positions |
| 400    | `"Stop X does not belong to route Y"`                              | Stop from a different route  |
| 401    | `"Authorization header is missing"`                                | No token                     |
| 403    | `"You do not have permission to access this resource"`             | Caller is not `admin`        |
| 404    | `"Route X not found"`                                              | No route with that ID        |
| 500    | `"Internal server error"`                                          | Unhandled exception          |

**Side Effects:** Batch-updates `stop_order` on the matching stop rows.

---

## Tracking

---

### GET /api/tracking/:trackingToken

**Description:** Public endpoint. Returns tracking information for a package using its unique tracking token (UUID embedded in the tracking URL sent to the recipient by email). No authentication required — intended for end recipients checking their delivery status.

**Authentication:** None required.

**Cookies:** N/A

**Request Parameters:**

| Location   | Name            | Type   | Required | Description                               |
| ---------- | --------------- | ------ | -------- | ----------------------------------------- |
| Path param | `trackingToken` | string | ✅       | UUID tracking token from the tracking URL |

**Request Body Example:** N/A

**Response:**

| Status | Description   | Body                                                                                  |
| ------ | ------------- | ------------------------------------------------------------------------------------- |
| 200    | Tracking info | `{ tracking_code, recipient_name, status, estimated_delivery, address, last_update }` |

**Response Body Example (200):**

```json
{
  "tracking_code": "TRK-2024-ABCD1234",
  "recipient_name": "Maria Garcia",
  "status": "in_transit",
  "estimated_delivery": "2024-04-20",
  "address": {
    "street": "Calle Mayor 10",
    "city": "Bilbao",
    "postal_code": "48001"
  },
  "last_update": "2024-04-19T09:00:00.000Z"
}
```

**Errors:**

| Status | Message                               | When does it happen                        |
| ------ | ------------------------------------- | ------------------------------------------ |
| 404    | `"Invalid or expired tracking token"` | Token not found or not linked to a package |
| 500    | `"Internal server error"`             | Unhandled exception                        |

**Side Effects:** None.
