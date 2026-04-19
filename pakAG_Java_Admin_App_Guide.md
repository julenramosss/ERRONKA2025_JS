# pakAG — Guía Completa: Aplicación de Administración en Java Swing

> **Documento preparado para el desarrollador Java.**  
> Esta guía contiene todo lo que necesitas saber para construir la aplicación de administración del sistema pakAG: arquitectura, tecnologías, manejo de JWT, y **todos los endpoints de la API** que deberás consumir, con sus payloads y respuestas exactas.

---

## Índice

1. [Contexto del proyecto](#1-contexto-del-proyecto)
2. [Stack tecnológico de la app](#2-stack-tecnológico-de-la-app)
3. [Arquitectura general de la app](#3-arquitectura-general-de-la-app)
4. [Manejo del JWT en Java de escritorio](#4-manejo-del-jwt-en-java-de-escritorio)
5. [Dependencias Maven recomendadas](#5-dependencias-maven-recomendadas)
6. [Pantallas / Vistas que debe tener la app](#6-pantallas--vistas-que-debe-tener-la-app)
7. [Endpoints que usará la app](#7-endpoints-que-usará-la-app)
8. [Consideraciones de UI con FlatLaf](#8-consideraciones-de-ui-con-flatlaf)
9. [Patrones de código recomendados](#9-patrones-de-código-recomendados)
10. [Resumen rápido de endpoints por pantalla](#10-resumen-rápido-de-endpoints-por-pantalla)

---

## 1. Contexto del proyecto

**pakAG** es un sistema de gestión de paquetes y reparto para una empresa de transporte del País Vasco. El sistema tiene tres partes:

| Parte                 | Tecnología            | Quién la usa                                   |
| --------------------- | --------------------- | ---------------------------------------------- |
| App de administración | **Java + Swing** ← TÚ | Administrador (en una sola máquina de oficina) |
| App de repartidores   | React Web             | Repartidores (móvil/tablet)                    |
| Backend API           | Node.js + Express     | Todos se conectan aquí                         |
| Base de datos         | Supabase + PostgreSQL | Solo el backend accede                         |

**Tu misión:** Construir la aplicación de escritorio Java que permite al administrador gestionar todo el sistema. La app **no se conecta directamente a la base de datos**. Toda comunicación es **HTTP/JSON contra la API REST**.

**Base URL de la API:** `http://<host>/api`  
**Formato:** `Content-Type: application/json`  
**Auth:** `Authorization: Bearer <access_token>` en cada petición protegida.

---

## 2. Stack tecnológico de la app

| Componente           | Tecnología                                         | Para qué                                                              |
| -------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| UI                   | Java Swing                                         | Componentes visuales nativos                                          |
| Diseño/Look & Feel   | **FlatLaf**                                        | UI moderna y limpia (reemplaza el look por defecto horrible de Swing) |
| HTTP Client          | `java.net.http.HttpClient` (Java 11+) o **OkHttp** | Hacer peticiones REST                                                 |
| JSON                 | **Gson** o **Jackson**                             | Serializar/deserializar JSON                                          |
| JWT                  | **Auth0 java-jwt** o **JJWT**                      | Leer el token (saber cuándo expira)                                   |
| Almacenamiento local | `java.util.prefs.Preferences`                      | Guardar el refresh token de forma persistente                         |
| Build                | Maven o Gradle                                     | Gestión de dependencias                                               |

---

## 3. Arquitectura general de la app

```
┌───────────────────────────────────────────────────┐
│                  Java Swing App                   │
│                                                   │
│  ┌─────────────┐    ┌───────────────────────────┐ │
│  │   UI Layer  │───▶│     Service Layer         │ │
│  │  (Panels,   │    │  (ApiClient, métodos      │ │
│  │   Frames,   │◀───│   por dominio: auth,      │ │
│  │   Dialogs)  │    │   users, packages, etc.)  │ │
│  └─────────────┘    └──────────────┬────────────┘ │
│                                    │              │
│                     ┌──────────────▼─────────────┐│
│                     │      HttpClient / OkHttp   ││
│                     │   (con interceptor JWT)    ││
│                     └──────────────┬─────────────┘│
└───────────────────────────────────────────────────┘
                                     │ HTTP/JSON
                                     ▼
                          ┌─────────────────────┐
                          │  Node.js + Express  │
                          │       API REST      │
                          └─────────────────────┘
```

### Capa de sesión (Session Manager)

Crea una clase singleton `SessionManager` que mantenga en memoria:

```java
public class SessionManager {
    private static SessionManager instance;

    private String accessToken;       // JWT de corta duración (~15 min)
    private String refreshToken;      // UUID de larga duración (guardado en disco)
    private UserDto currentUser;      // Datos del usuario logueado

    // Métodos: getAccessToken(), setAccessToken(), isTokenExpired(),
    //          getRefreshToken(), saveRefreshTokenToDisk(),
    //          loadRefreshTokenFromDisk(), clear() (logout)
}
```

---

## 4. Manejo del JWT en Java de escritorio

Este es el punto más crítico para una app de escritorio con JWT. En web, las cookies `HttpOnly` gestionan el refresh token automáticamente. En Java, lo tienes que hacer a mano.

### 4.1 — Flujo completo de autenticación

```
Usuario introduce email + password
         │
         ▼
POST /api/auth/login
         │
         ▼
Recibes: { access_token, user }
+ El servidor intenta SET cookie refresh_token (la ignorarás en escritorio)
         │
         ▼
PROBLEMA: Java no maneja cookies HttpOnly automáticamente como un navegador.
SOLUCIÓN: Tienes que leer el header Set-Cookie de la respuesta y extraer
          el valor del refresh_token manualmente.
         │
         ▼
Guarda access_token en memoria (SessionManager)
Guarda refresh_token en disco (java.util.prefs.Preferences)
```

### 4.2 — Leer la cookie `refresh_token` del header

El servidor devuelve el refresh token en un header `Set-Cookie`. Tienes que leerlo tú:

```java
HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

// Buscar el header Set-Cookie
Optional<String> setCookieHeader = response.headers()
    .allValues("set-cookie")
    .stream()
    .filter(h -> h.startsWith("refresh_token="))
    .findFirst();

if (setCookieHeader.isPresent()) {
    String cookieFull = setCookieHeader.get(); // "refresh_token=abc123; HttpOnly; ..."
    String refreshToken = cookieFull.split(";")[0].replace("refresh_token=", "").trim();
    SessionManager.getInstance().saveRefreshToken(refreshToken);
}
```

### 4.3 — Guardar el refresh token en disco

Usa `Preferences` de Java (guarda en el registro de Windows en escritorio):

```java
import java.util.prefs.Preferences;

public class TokenStorage {
    private static final Preferences prefs = Preferences.userNodeForPackage(TokenStorage.class);
    private static final String KEY = "pakag_refresh_token";

    public static void saveRefreshToken(String token) {
        prefs.put(KEY, token);
    }

    public static String loadRefreshToken() {
        return prefs.get(KEY, null); // null si no existe
    }

    public static void clearRefreshToken() {
        prefs.remove(KEY);
    }
}
```

### 4.4 — Detectar que el access token ha expirado

Usando la librería **Auth0 java-jwt**:

```java
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;

public boolean isAccessTokenExpired(String token) {
    try {
        DecodedJWT jwt = JWT.decode(token);
        Date expiresAt = jwt.getExpiresAt();
        // Añade 30 segundos de margen para no pillar el token en el último momento
        return expiresAt.before(new Date(System.currentTimeMillis() + 30_000));
    } catch (Exception e) {
        return true; // Si no se puede decodificar, considera expirado
    }
}
```

> **Nota importante:** Solo estás _leyendo_ el payload del JWT para saber si está expirado, **no estás verificando la firma**. La verificación la hace el backend. En el cliente solo necesitas saber la fecha de expiración.

### 4.5 — Interceptor automático: renovar token antes de cada petición

Este es el patrón más robusto. Antes de cada llamada a la API, comprueba si el token está a punto de expirar y renuévalo:

```java
public HttpResponse<String> requestWithAuth(HttpRequest.Builder requestBuilder) throws Exception {
    // 1. Comprobar si el access token está expirado (o a punto de expirar)
    String accessToken = SessionManager.getInstance().getAccessToken();
    if (accessToken == null || isAccessTokenExpired(accessToken)) {
        // 2. Intentar renovar con el refresh token
        boolean renewed = refreshAccessToken();
        if (!renewed) {
            // 3. Si falla el refresh, sesión caducada → volver al login
            showLoginScreen();
            throw new SessionExpiredException("Sesión expirada");
        }
        accessToken = SessionManager.getInstance().getAccessToken(); // token nuevo
    }

    // 4. Añadir el header Authorization con el token actual
    HttpRequest request = requestBuilder
        .header("Authorization", "Bearer " + accessToken)
        .header("Content-Type", "application/json")
        .build();

    return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
}
```

### 4.6 — Renovar el access token con el refresh token

Tienes que enviar el refresh token como cookie en la petición `POST /api/auth/refresh`:

```java
public boolean refreshAccessToken() {
    String refreshToken = TokenStorage.loadRefreshToken();
    if (refreshToken == null) return false;

    try {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/auth/refresh"))
            .POST(HttpRequest.BodyPublishers.noBody())
            .header("Content-Type", "application/json")
            // Enviar el refresh token como cookie, así lo espera el servidor
            .header("Cookie", "refresh_token=" + refreshToken)
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            JsonObject json = JsonParser.parseString(response.body()).getAsJsonObject();
            String newAccessToken = json.get("access_token").getAsString();
            SessionManager.getInstance().setAccessToken(newAccessToken);

            // El servidor también rota el refresh token → actualizar en disco
            // (leer Set-Cookie igual que en el login)
            extractAndSaveRefreshTokenFromResponse(response);
            return true;
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    return false;
}
```

### 4.7 — Auto-login al arrancar la app

Al iniciar la aplicación, intenta restaurar la sesión automáticamente:

```java
public void initApp() {
    String savedRefreshToken = TokenStorage.loadRefreshToken();
    if (savedRefreshToken != null) {
        boolean renewed = refreshAccessToken(); // usa el token guardado en disco
        if (renewed) {
            // Sesión restaurada, cargar pantalla principal
            showMainScreen();
            return;
        }
    }
    // No hay sesión válida → pantalla de login
    showLoginScreen();
}
```

### 4.8 — Logout correcto

```java
public void logout() {
    // 1. Llamar al endpoint de logout para revocar el token en el servidor
    try {
        callApi("POST", "/auth/logout", null); // con Authorization header
    } catch (Exception ignored) {}

    // 2. Limpiar todo en local
    SessionManager.getInstance().clear();
    TokenStorage.clearRefreshToken();

    // 3. Volver al login
    showLoginScreen();
}
```

---

## 5. Dependencias Maven recomendadas

```xml
<dependencies>
    <!-- UI: FlatLaf -->
    <dependency>
        <groupId>com.formdev</groupId>
        <artifactId>flatlaf</artifactId>
        <version>3.4</version>
    </dependency>

    <!-- JSON: Gson -->
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
        <version>2.10.1</version>
    </dependency>

    <!-- JWT: Auth0 (solo para leer el payload, no verificar firma) -->
    <dependency>
        <groupId>com.auth0</groupId>
        <artifactId>java-jwt</artifactId>
        <version>4.4.0</version>
    </dependency>

    <!-- HTTP Client: incluido en Java 11+, no necesita dependencia extra -->
    <!-- Si prefieres OkHttp: -->
    <!--
    <dependency>
        <groupId>com.squareup.okhttp3</groupId>
        <artifactId>okhttp</artifactId>
        <version>4.12.0</version>
    </dependency>
    -->
</dependencies>
```

---

## 6. Pantallas / Vistas que debe tener la app

```
┌─────────────────────────────────────────────────────────────┐
│  LoginFrame                                                 │
│  • Email + Password + botón "Entrar"                        │
│  • Muestra error si credenciales inválidas                  │
└────────────────────────┬────────────────────────────────────┘
                         │ login exitoso
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  MainFrame  (ventana principal con menú lateral o pestañas) │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────────────────────┐   │
│  │  Panel lateral  │  │       Área de contenido         │   │
│  │  • Dashboard    │  │  (se reemplaza según selección) │   │
│  │  • Paquetes     │  └─────────────────────────────────┘   │
│  │  • Repartidores │                                        │
│  │  • Rutas        │                                        │
│  │  • Historial    │                                        │
│  │  • Cerrar sesión│                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

### Vistas detalladas:

| Vista                   | Descripción                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **DashboardPanel**      | Resumen del día: contador de paquetes por estado. Usa `getDailySummary`.                                                         |
| **PackagesPanel**       | Tabla con todos los paquetes. Filtros por estado, repartidor, ciudad. Paginado. Botones: Nuevo, Editar, Eliminar, Ver historial. |
| **PackageFormDialog**   | Formulario modal para crear/editar un paquete.                                                                                   |
| **PackageDetailDialog** | Vista detallada de un paquete con su historial de estados.                                                                       |
| **UsersPanel**          | Tabla de repartidores (y admins). Filtros. Botones: Nuevo, Editar (activar/desactivar).                                          |
| **UserFormDialog**      | Formulario modal para crear/editar usuario.                                                                                      |
| **RoutesPanel**         | Crear rutas para repartidores. Ver rutas por repartidor y fecha. Reordenar paradas.                                              |
| **LogsPanel**           | Historial global de cambios de estado. Filtros por paquete, usuario, fechas.                                                     |

---

## 7. Endpoints que usará la app

A continuación, **todos y cada uno de los endpoints** que necesitas consumir desde la app de administración, con sus detalles completos.

---

### 🔐 AUTH

---

#### `POST /api/auth/login`

**Cuándo se usa:** Al hacer clic en "Entrar" en la pantalla de login.

**Auth requerida:** ❌ Ninguna.

**Request body:**

```json
{
  "email": "admin@pakag.com",
  "password": "mipassword"
}
```

**Response 200:**

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

**⚠️ Importante:** El `refresh_token` llega en el header `Set-Cookie` de la respuesta, NO en el body. Extráelo manualmente como se explica en la sección 4.2.

**Errores relevantes:**
| Status | Mensaje | Qué mostrar al usuario |
|---|---|---|
| 401 | `"Invalid credentials"` | "Email o contraseña incorrectos" |
| 403 | `"User account is disabled"` | "Cuenta desactivada. Contacta con soporte." |

---

#### `POST /api/auth/logout`

**Cuándo se usa:** Al hacer clic en "Cerrar sesión".

**Auth requerida:** ✅ Bearer token.

**Request body:** Ninguno.  
**Response 200:** `{ "message": "Saioa itxi da" }`

**Efecto:** Revoca el refresh token en el servidor. Luego limpias la sesión en local.

---

#### `POST /api/auth/refresh`

**Cuándo se usa:** Automáticamente, cuando el access token está expirado (el interceptor lo llama antes de cualquier petición).

**Auth requerida:** ❌ No Bearer. Necesitas enviar el refresh token como cookie: `Cookie: refresh_token=<uuid>`

**Request body:** Ninguno.

**Response 200:**

```json
{
  "access_token": "<nuevo_jwt>"
}
```

**⚠️ Importante:** El servidor también rota el refresh token. Lee el nuevo `Set-Cookie` de la respuesta y guárdalo en disco, igual que en el login.

**Errores relevantes:**
| Status | Qué hacer |
|---|---|
| 401 | Sesión caducada definitivamente → volver al login |
| 403 | Usuario desactivado → volver al login |

---

#### `GET /api/auth/me`

**Cuándo se usa:** Justo después del login o del refresh, para cargar los datos del usuario en la interfaz (nombre, rol, etc.).

**Auth requerida:** ✅ Bearer token.

**Response 200:**

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

---

### 👥 USUARIOS (REPARTIDORES)

---

#### `POST /api/users/create`

**Cuándo se usa:** Al guardar el formulario de "Nuevo usuario/repartidor".

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**Request body:**

```json
{
  "name": "John Doe",
  "email": "john@pakag.com",
  "role": "distributor"
}
```

**Response 201:**

```json
{
  "id": 5,
  "name": "John Doe",
  "email": "john@pakag.com",
  "role": "distributor",
  "is_active": false
}
```

> El usuario se crea con `is_active = false`. El servidor le envía un email de activación automáticamente. No tienes que hacer nada más.

**Errores relevantes:**
| Status | Mensaje | Qué mostrar |
|---|---|---|
| 409 | `"A user with this email already exists"` | "Ya existe un usuario con ese email." |

---

#### `GET /api/users/list`

**Cuándo se usa:** Al cargar la tabla de usuarios/repartidores.

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**Query params opcionales:**

| Param       | Tipo   | Descripción                       |
| ----------- | ------ | --------------------------------- |
| `role`      | string | `"admin"` o `"distributor"`       |
| `is_active` | string | `"true"` o `"false"`              |
| `page`      | number | Página (default: 1)               |
| `limit`     | number | Por página, máx 100 (default: 20) |

**Ejemplo:** `GET /api/users/list?role=distributor&is_active=true&page=1&limit=20`

**Response 200:**

```json
{
  "users": [
    {
      "id": 3,
      "name": "Jane Smith",
      "email": "jane@pakag.com",
      "role": "distributor",
      "is_active": true,
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

> Usa `total`, `page` y `limit` para construir el paginador en la tabla.

---

#### `GET /api/users/getById`

**Cuándo se usa:** Al abrir el formulario de edición de un usuario concreto.

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**Query param:** `?id=3`

**Response 200:**

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

---

#### `PATCH /api/users/update`

**Cuándo se usa:** Al guardar cambios en un usuario (editar nombre, email, rol, activar/desactivar).

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**Request body** (solo los campos que quieres cambiar):

```json
{
  "id": 3,
  "name": "Jane Doe",
  "is_active": false
}
```

> Para **desactivar un repartidor**: envía `{ "id": X, "is_active": false }`.  
> Para **reactivar**: envía `{ "id": X, "is_active": true }`.

**Response 200:**

```json
{
  "id": 3,
  "name": "Jane Doe",
  "email": "jane@pakag.com",
  "role": "distributor",
  "is_active": false
}
```

**Errores relevantes:**
| Status | Mensaje |
|---|---|
| 409 | `"This email is already in use by another user"` |
| 400 | `"at least one field must be provided to update"` |

---

### 📦 PAQUETES

---

#### `POST /api/packages/create`

**Cuándo se usa:** Al guardar el formulario de "Nuevo paquete".

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**⚠️ El body tiene estructura anidada obligatoria:**

```json
{
  "packageInfo": {
    "recipient_name": "Maria Garcia",
    "recipient_email": "maria@example.com",
    "assigned_to": 3,
    "created_by": 1,
    "status": "assigned",
    "weight_kg": 2.5,
    "description": "Fragile electronics",
    "estimated_delivery": "2024-04-25"
  },
  "address_info": {
    "street": "Calle Mayor 10",
    "city": "Bilbao",
    "postal_code": "48001"
  }
}
```

> - `assigned_to` puede ser `null` (paquete sin asignar, status `pending`).
> - `created_by` debe ser el ID del admin autenticado (cógelo del `SessionManager`).
> - El servidor llama a la API de mapas para geocodificar la dirección y manda un email automático al destinatario.

**Response 201:**

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

---

#### `GET /api/packages/list`

**Cuándo se usa:** Al cargar la tabla principal de paquetes.

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**Query params opcionales:**

| Param         | Tipo   | Descripción                                                |
| ------------- | ------ | ---------------------------------------------------------- |
| `status`      | string | `pending`, `assigned`, `in_transit`, `delivered`, `failed` |
| `assigned_to` | number | ID del repartidor                                          |
| `city`        | string | Ciudad de entrega                                          |
| `page`        | number | Página (default: 1)                                        |
| `limit`       | number | Resultados por página, máx 100 (default: 20)               |

**Ejemplo:** `GET /api/packages/list?status=assigned&page=1&limit=20`

**Response 200:**

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

---

#### `GET /api/packages/getById`

**Cuándo se usa:** Al abrir el detalle de un paquete concreto.

**Auth requerida:** ✅ Bearer token. `admin` o `distributor`.

**Query param:** `?id=42`

**Response 200:** Misma estructura que un ítem de `packages/list` (objeto `PackageWithAddress` completo).

---

#### `PATCH /api/packages/update`

**Cuándo se usa:** Al guardar cambios en un paquete existente (editar datos, reasignar repartidor, cambiar dirección, cambiar estado manualmente).

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**Query param:** `?id=42`

**Request body** (solo los campos a cambiar, también con estructura anidada):

```json
{
  "packageInfo": {
    "assigned_to": 4,
    "status": "assigned",
    "estimated_delivery": "2024-04-26"
  },
  "address_info": {
    "street": "Gran Vía 5",
    "city": "Bilbao"
  }
}
```

> Si cambias la dirección, el servidor re-geocodifica automáticamente.  
> Si cambias el estado, el servidor registra un log y manda email al destinatario.

**Response 200:** Objeto `PackageWithAddress` actualizado.

---

#### `DELETE /api/packages/delete`

**Cuándo se usa:** Al eliminar un paquete (solo posible si está en estado `pending`).

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**Query param:** `?id=42`

**Response 204:** Sin contenido (éxito).

**Errores relevantes:**
| Status | Mensaje | Qué mostrar |
|---|---|---|
| 400 | `"Package can only be deleted when status is pending"` | "Solo se pueden eliminar paquetes en estado 'pendiente'." |

---

#### `GET /api/packages/getDailySummary`

**Cuándo se usa:** Al cargar el **Dashboard** (pantalla principal), muestra el resumen del día.

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**No requiere parámetros.**

**Response 200:**

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

> Úsalo para mostrar tarjetas con contadores por estado (tipo dashboard).

---

### 📋 HISTORIAL / LOGS

---

#### `GET /api/logs/listAll`

**Cuándo se usa:** En la pantalla de "Historial global" — ver todos los cambios de estado del sistema, con filtros.

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**Query params opcionales:**

| Param       | Tipo   | Descripción                            |
| ----------- | ------ | -------------------------------------- |
| `packageId` | number | Filtrar por paquete concreto           |
| `changedBy` | number | Filtrar por usuario que hizo el cambio |
| `fromDate`  | string | Fecha inicio (`"2024-04-01"`)          |
| `toDate`    | string | Fecha fin (`"2024-04-30"`)             |
| `page`      | number | Página (default: 1)                    |
| `limit`     | number | Máx 100 (default: 20)                  |

**Response 200:**

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

---

#### `GET /api/logs/listByPackage`

**Cuándo se usa:** En el diálogo de detalle de un paquete, para ver su historial de estados específico.

**Auth requerida:** ✅ Bearer token. `admin` o `distributor`.

**Query params:**

| Param       | Requerido | Descripción    |
| ----------- | --------- | -------------- |
| `packageId` | ✅        | ID del paquete |
| `page`      | ❌        | Default: 1     |
| `limit`     | ❌        | Default: 20    |

**Ejemplo:** `GET /api/logs/listByPackage?packageId=42`

**Response 200:**

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

> `oldStatus` puede ser `null` (cuando es la creación del paquete).

---

### 🗺️ RUTAS

---

#### `POST /api/routes/create`

**Cuándo se usa:** Cuando el admin crea la ruta del día para un repartidor.

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**⚠️ Restricciones importantes:**

- La fecha debe ser **mínimo mañana** (no se puede crear rutas para hoy).
- Los paquetes deben estar en estado `assigned` y asignados al repartidor indicado.
- No puede existir ya una ruta para ese repartidor en esa fecha.

**Request body:**

```json
{
  "user_id": 3,
  "date": "2024-04-25",
  "package_ids": [42, 43, 44]
}
```

**Response 201:**

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

**Errores relevantes:**
| Status | Mensaje |
|---|---|
| 409 | `"Route already exists for user X on Y"` — ya hay ruta ese día para ese repartidor |
| 400 | `"Route date must be at least tomorrow"` |
| 400 | `"Package X is not in 'assigned' status"` |

---

#### `GET /api/routes/getByUserAndDate`

**Cuándo se usa:** Para ver la ruta de un repartidor en una fecha concreta (vista de admin).

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**Query params:**

| Param     | Requerido | Descripción                   |
| --------- | --------- | ----------------------------- |
| `user_id` | ✅        | ID del repartidor             |
| `date`    | ✅        | Fecha en formato `YYYY-MM-DD` |

**Ejemplo:** `GET /api/routes/getByUserAndDate?user_id=3&date=2024-04-25`

**Response 200:**

```json
{
  "route": {
    "id": 7,
    "route_date": "2024-04-25"
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

---

#### `PATCH /api/routes/updateStatus/:id`

**Cuándo se usa:** Si el admin necesita avanzar manualmente el estado de una ruta.

**Auth requerida:** ✅ Bearer token. `admin` o `distributor`.

**Transiciones válidas:** `planned → in_progress → completed`

**Path param:** `:id` = ID de la ruta (en la URL, no en el body).  
**Ejemplo:** `PATCH /api/routes/updateStatus/7`

**Request body:**

```json
{
  "status": "in_progress"
}
```

**Response 200:**

```json
{
  "message": "Route status updated"
}
```

---

### 🔀 PARADAS DE RUTA (STOPS)

---

#### `PATCH /api/stops/reorder`

**Cuándo se usa:** Cuando el admin reordena manualmente las paradas de una ruta (drag & drop en la lista de paradas).

**Auth requerida:** ✅ Bearer token. Solo `admin`.

**⚠️ Importante:** Debes incluir **todas** las paradas de la ruta en el array, no solo las que cambian.

**Request body:**

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

**Response 200:** Array con todos los stops actualizados con su nuevo orden.

**Errores relevantes:**
| Status | Mensaje |
|---|---|
| 400 | `"order_index values must not contain duplicates"` |
| 400 | `"Stop X does not belong to route Y"` |

---

## 8. Consideraciones de UI con FlatLaf

### Inicializar FlatLaf (hacerlo antes de cualquier componente Swing):

```java
import com.formdev.flatlaf.FlatDarkLaf;   // Tema oscuro
import com.formdev.flatlaf.FlatLightLaf;  // Tema claro

public static void main(String[] args) {
    // Opción A: Tema oscuro moderno
    FlatDarkLaf.setup();

    // Opción B: Tema claro moderno
    // FlatLightLaf.setup();

    SwingUtilities.invokeLater(() -> {
        new MainFrame().setVisible(true);
    });
}
```

### Buenas prácticas con FlatLaf:

- Usa `JTable` con modelos propios (`AbstractTableModel`) — FlatLaf los estiliza automáticamente.
- Los `JDialog` modales quedan bien para formularios de crear/editar.
- Usa `JSplitPane` para el layout de panel lateral + área de contenido.
- `JTabbedPane` para organizar las distintas secciones si prefieres pestañas.
- Para los botones de acción en la tabla (editar, eliminar), usa un `TableCellRenderer` custom.
- FlatLaf soporta modo oscuro/claro con un simple cambio de `LookAndFeel`.

### Ejemplo de tabla con datos de la API:

```java
// Modelo de tabla para paquetes
public class PackagesTableModel extends AbstractTableModel {
    private final String[] columns = {"ID", "Destinatario", "Ciudad", "Estado", "Repartidor", "Creado"};
    private List<PackageDto> packages = new ArrayList<>();

    public void setData(List<PackageDto> data) {
        this.packages = data;
        fireTableDataChanged();
    }

    @Override public int getRowCount() { return packages.size(); }
    @Override public int getColumnCount() { return columns.length; }
    @Override public String getColumnName(int col) { return columns[col]; }

    @Override
    public Object getValueAt(int row, int col) {
        PackageDto p = packages.get(row);
        return switch (col) {
            case 0 -> p.getId();
            case 1 -> p.getRecipientName();
            case 2 -> p.getCity();
            case 3 -> p.getStatus();
            case 4 -> p.getAssignedTo();
            case 5 -> p.getCreatedAt();
            default -> "";
        };
    }
}
```

---

## 9. Patrones de código recomendados

### Hacer peticiones HTTP de forma limpia

```java
public class ApiClient {
    private static final String BASE_URL = "http://localhost:3000/api";
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final Gson gson = new Gson();

    // GET con query params
    public <T> T get(String path, Class<T> responseType) throws Exception {
        String token = getValidAccessToken(); // renueva si hace falta
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + path))
            .GET()
            .header("Authorization", "Bearer " + token)
            .header("Accept", "application/json")
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        handleErrors(response);
        return gson.fromJson(response.body(), responseType);
    }

    // POST con body JSON
    public <T> T post(String path, Object body, Class<T> responseType) throws Exception {
        String token = getValidAccessToken();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + path))
            .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(body)))
            .header("Authorization", "Bearer " + token)
            .header("Content-Type", "application/json")
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        handleErrors(response);
        return gson.fromJson(response.body(), responseType);
    }

    private void handleErrors(HttpResponse<String> response) throws ApiException {
        if (response.statusCode() >= 400) {
            JsonObject error = JsonParser.parseString(response.body()).getAsJsonObject();
            String message = error.has("error") ? error.get("error").getAsString() : "Error desconocido";
            throw new ApiException(response.statusCode(), message);
        }
    }
}
```

### Llamadas en background (evitar bloquear la UI)

Nunca hagas llamadas HTTP en el hilo de eventos de Swing. Usa `SwingWorker`:

```java
new SwingWorker<List<PackageDto>, Void>() {
    @Override
    protected List<PackageDto> doInBackground() throws Exception {
        // Esto se ejecuta en un hilo separado
        PackagesResponse resp = apiClient.get("/packages/list?page=1&limit=20", PackagesResponse.class);
        return resp.getPackages();
    }

    @Override
    protected void done() {
        try {
            List<PackageDto> packages = get(); // resultado del doInBackground
            tableModel.setData(packages);       // actualizar UI en el EDT
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Error cargando paquetes: " + e.getMessage());
        }
    }
}.execute();
```

---

## 10. Resumen rápido de endpoints por pantalla

| Pantalla / Acción                          | Método | Endpoint                    |
| ------------------------------------------ | ------ | --------------------------- |
| Login                                      | POST   | `/auth/login`               |
| Logout                                     | POST   | `/auth/logout`              |
| Auto-renovar token                         | POST   | `/auth/refresh`             |
| Cargar datos usuario actual                | GET    | `/auth/me`                  |
| **Dashboard** — resumen del día            | GET    | `/packages/getDailySummary` |
| **Paquetes** — cargar tabla                | GET    | `/packages/list`            |
| **Paquetes** — ver detalle                 | GET    | `/packages/getById`         |
| **Paquetes** — crear nuevo                 | POST   | `/packages/create`          |
| **Paquetes** — editar / reasignar          | PATCH  | `/packages/update`          |
| **Paquetes** — eliminar                    | DELETE | `/packages/delete`          |
| **Paquetes** — ver historial de uno        | GET    | `/logs/listByPackage`       |
| **Repartidores** — cargar tabla            | GET    | `/users/list`               |
| **Repartidores** — ver detalle             | GET    | `/users/getById`            |
| **Repartidores** — crear nuevo             | POST   | `/users/create`             |
| **Repartidores** — editar / desactivar     | PATCH  | `/users/update`             |
| **Rutas** — crear ruta para repartidor     | POST   | `/routes/create`            |
| **Rutas** — ver ruta de repartidor + fecha | GET    | `/routes/getByUserAndDate`  |
| **Rutas** — cambiar estado de ruta         | PATCH  | `/routes/updateStatus/:id`  |
| **Rutas** — reordenar paradas              | PATCH  | `/stops/reorder`            |
| **Historial global** — con filtros         | GET    | `/logs/listAll`             |

---

> **Nota final:** Los endpoints `PATCH /api/packages/updateStatus`, `GET /api/packages/getMyPackages`, `GET /api/routes/getMyDaily`, `PATCH /api/stops/updateArrival` y `GET /api/tracking/:token` son exclusivos para la app de repartidores (React) y para acceso público. La app Java de administración **no los necesita**.
