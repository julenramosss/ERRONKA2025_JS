# CLAUDE.md — Guía completa para el agente

> Este archivo centraliza **todo** lo que CLAUDE debe conocer antes de tocar el repositorio:
> arquitectura, convenciones, bugs conocidos, mejoras de clean code, buenas prácticas y
> elementos no documentados en ningún otro sitio.

---

## 1. Stack y estructura del monorepo

| Carpeta | Qué es |
|---|---|
| `backend-js/` | API Next.js 15 App Router + TypeScript |
| `docs/` | Sitio de documentación (Next.js, MDX) |
| `erronkaFrontend-React/` | Frontend React (admin) |
| `frontend-app/` | Otra aplicación frontend |
| `schema.sql` | Esquema MySQL completo (fuente de verdad) |
| `mocked_data.sql` | Datos de prueba para desarrollo |

---

## 2. Arquitectura del backend (`backend-js/`)

### 2.1 Patrón por endpoint

Cada endpoint sigue **exactamente** esta estructura de carpetas:

```
src/app/api/{recurso}/{accion}/
  ├── dtos/           → interfaz + validateXxxDto(body: unknown)   [NO Zod]
  ├── repository/     → solo SQL con mysql2, prepared statements
  ├── service/        → solo lógica de negocio, sin SQL
  ├── route.ts        → try/catch + orquestación, sin SQL ni lógica
  └── types.ts        → tipos/interfaces de dominio locales
```

> **Referencia de oro:** `src/app/api/users/create/` y `src/app/api/users/changePwd/`

### 2.2 Librerías compartidas en `src/app/lib/`

| Archivo | Responsabilidad |
|---|---|
| `errors.ts` | `ValidationError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError` |
| `response.ts` | `res.ok / res.created / res.noContent / res.validationError / res.notFound / res.conflict / res.serverError` + `handleError()` |
| `jwt.ts` | `signAccessToken`, `verifyAccessToken`, `extractBearerToken`, `requireAuth` |
| `dto.ts` | Guards de tipo: `isString`, `isEmail`, `isNumber`, `isBoolean`, `isPositiveInteger`, `isUserRole`, `isPackageValidStatus` |
| `hashPasword.ts` | `encryptPwd`, `verifyPassword` (bcrypt) — **ver bug §4.1** |
| `email/email.service.ts` | Envío de emails via Resend |
| `maps/maps.service.ts` | `optimizeRoute`, `geocodeAddress` (Google Directions/Geocoding API) |
| `packageStatus/packageStatusSideEffects.service.ts` | Inserta logs de estado + envía emails de tracking |

### 2.3 Configuración

| Archivo | Responsabilidad |
|---|---|
| `src/app/config/envConfig.ts` | Lee todas las variables de entorno |
| `src/app/config/dbConfig.ts` | Pool MySQL singleton (`connect()`) |
| `.env.example` | Plantilla de variables (copiar a `.env.local`) |

### 2.4 Tipos globales

```
src/app/types/index.ts
  USER_ROLES      → "admin" | "distributor"
  PACKAGE_STATUSES → "pending" | "assigned" | "in_transit" | "delivered" | "undelivered" | "failed"
  TOKEN_TYPES     → "refresh_token" | "tracking_token" | "reset_pwd_token" | "activate_account_token"
```

---

## 3. Endpoints disponibles

### Auth
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login; devuelve access_token + refresh_token (cookie HttpOnly) |
| POST | `/api/auth/refresh` | cookie `refresh_token` | Rota el refresh token y emite nuevo access_token |
| POST | `/api/auth/logout` | — | Revoca el refresh token |
| GET | `/api/auth/me` | Bearer (any role) | Devuelve el usuario autenticado |
| POST | `/api/auth/forgotPassword` | — | Envía email de reset |
| POST | `/api/auth/changePwd` | token de reset (query param) | Cambia contraseña con token |
| POST | `/api/auth/activateAccount` | token de activación | Activa cuenta nueva |

### Users (admin only)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/users/create` | Crea usuario; envía email de activación |
| GET | `/api/users/list` | Lista usuarios con filtros |
| GET | `/api/users/getById` | Obtiene usuario por id |
| PATCH | `/api/users/update` | Actualiza nombre/email/rol/is_active |
| DELETE | `/api/users/remove` | Elimina usuario (no puede borrarse a sí mismo) |
| PATCH | `/api/users/changeMyPwd` | Cambio de contraseña propio (any role) |

### Packages
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/packages/create` | admin | Crea paquete + geocodifica dirección + emite tracking token + envía email |
| GET | `/api/packages/list` | admin | Lista paquetes con filtros/paginación |
| GET | `/api/packages/getById` | admin | Obtiene paquete por id |
| PATCH | `/api/packages/update` | admin | Actualiza paquete + dirección |
| DELETE | `/api/packages/delete` | admin | Elimina paquete |
| PATCH | `/api/packages/updateStatus` | distributor | Actualiza estado(s) + logs + emails |
| GET | `/api/packages/getMyPackages` | distributor | Lista paquetes asignados al distribuidor |
| GET | `/api/packages/getDailySummary` | admin | Conteo de paquetes por estado (hoy) |

### Routes
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/routes/create` | admin | Crea ruta optimizada con Google Maps |
| GET | `/api/routes/getByUserAndDate` | admin | Obtiene ruta por usuario y fecha |
| GET | `/api/routes/getMyDaily` | distributor | Obtiene la ruta diaria del distribuidor autenticado |
| PATCH | `/api/routes/updateStatus/[id]` | admin \| distributor | Actualiza estado de la ruta |
| GET | `/api/routes/continueFromPast` | distributor | Consulta si hay ruta pasada pendiente |
| POST | `/api/routes/continueFromPast` | distributor | Migra paradas pendientes de ayer a hoy |

### Stops
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| PATCH | `/api/stops/reorder` | admin | Reordena paradas de una ruta |
| PATCH | `/api/stops/updateArrival` | distributor | Registra hora de llegada real a una parada |

### Logs
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/logs/listAll` | admin | Lista todos los logs de estado con filtros |
| GET | `/api/logs/listByPackage` | admin | Lista logs de un paquete concreto |

### Tracking (público)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tracking/[trackingToken]` | Consulta pública del estado de un paquete |

---

## 4. Bugs y errores conocidos

### 4.1 Typo en nombre de archivo: `hashPasword.ts`
**Archivo:** `src/app/lib/hashPasword.ts`  
**Problema:** El archivo se llama `hashPasword` (falta una `s`). Todos los imports usan esta ortografía incorrecta.  
**Acción:** Renombrar a `hashPassword.ts` y actualizar todos los imports. Mientras no se corrija, **no cambies** el nombre de los imports o romperás el código.

### 4.2 JWT_SECRET con fallback hardcodeado
**Archivo:** `src/app/config/envConfig.ts` línea 14  
**Problema:**
```ts
export const jwt_secret =
  process.env.JWT_SECRET ?? "kjhaf7ya(/SFYAOUhf98ya9fya(SYf9a8fY)8sfyf08=A)uf98UF98U)OAIfu98af98u";
```
Si `JWT_SECRET` no está definida en producción, se usa un secreto conocido públicamente (está en el repo). Cualquiera puede forjar tokens.  
**Acción:** Eliminar el fallback y lanzar un error en startup si la variable no está definida.

### 4.3 DEFAULT_USER_PASSWORD con fallback hardcodeado
**Archivo:** `src/app/config/envConfig.ts` línea 37  
**Problema:** Igual que §4.2 pero para la contraseña por defecto de usuarios nuevos.  
**Acción:** Eliminar fallback; requerir la variable o lanzar error.

### 4.4 Variables de entorno MySQL no validadas
**Archivo:** `src/app/config/envConfig.ts` líneas 1-5  
**Problema:** `mysql_user`, `mysql_password`, `mysql_host` y `mysql_database` pueden ser `undefined`. La pool MySQL acepta `undefined` sin quejarse en tiempo de arranque pero falla en runtime.  
**Acción:** Validar en startup con un guard explícito y lanzar error descriptivo.

### 4.5 `handleError` expone mensajes internos en respuestas 500
**Archivo:** `src/app/lib/response.ts` línea 83-85  
**Problema:**
```ts
const message = error instanceof Error ? error.message : String(error);
console.error(tag, error);
return res.serverError(message);  // mensaje interno enviado al cliente
```
Los mensajes de error de MySQL o de bibliotecas externas pueden filtrar información sensible (nombres de tablas, stack traces, etc.).  
**Acción:** En producción, devolver siempre `"Internal server error"` al cliente y solo loguear el detalle en servidor.

### 4.6 `isValidUser`, `isValidPackage`, `isValidRoute` ejecutan SQL en `lib/dto.ts`
**Archivo:** `src/app/lib/dto.ts` líneas 53-85  
**Problema:** Estas funciones emiten consultas SQL directamente desde una librería de validación. Esto viola la regla arquitectónica *"Nunca SQL en route.ts. Nunca lógica en repository/"* y también *"repository/ → solo SQL"* porque estas consultas genéricas no viven en ningún repositorio.  
**Acción:** Mover estas funciones a repositorios específicos (o a un `shared.repository.ts`). Los DTOs solo deben validar estructura.

### 4.7 DTO de `logs/listByPackage` hace llamada a BD
**Archivo:** `src/app/api/logs/listByPackage/dto/listByPackage.dto.ts` línea 21  
**Problema:** El DTO llama a `isValidPackage(packageId)` que ejecuta una query SQL. Los DTOs no deben tener efectos secundarios de BD.  
**Acción:** Mover la validación de existencia al service o al repository.

### 4.8 Dependencias muertas en `package.json`
**Archivo:** `backend-js/package.json`  
**Problema:**
- `mysql` (v2) está en `dependencies` pero el código usa exclusivamente `mysql2`. Es código muerto y conflicto potencial.
- `@upstash/ratelimit` y `@upstash/redis` están instalados pero **no se usan en ningún archivo** del backend.  
**Acción:** Eliminar `mysql`, `@upstash/ratelimit` y `@upstash/redis` de `package.json`.

### 4.9 Coordenadas de origen hardcodeadas
**Archivo:** `src/app/api/routes/create/service/create.service.ts` línea 23  
**Problema:**
```ts
const PAKAG_ORIGIN = { lat: 43.1253804, lng: -2.0619009 };
```
Las coordenadas del almacén/origen están hardcodeadas. Si cambia la ubicación hay que tocar código.  
**Acción:** Moverlas a variables de entorno `ORIGIN_LAT` / `ORIGIN_LNG` leídas desde `envConfig.ts`.

### 4.10 Aserción `!` sobre `directions_api_key`
**Archivo:** `src/app/config/envConfig.ts` línea 9  
**Problema:**
```ts
export const directions_api_key = process.env.GOOGLE_DIRECTIONS_API_KEY!;
```
El `!` suprime el error de TypeScript pero en runtime puede ser `undefined`.  
**Acción:** Validar en startup junto con el resto de variables críticas.

---

## 5. Mejoras de clean code

### 5.1 Inconsistencia en nombres de carpeta de DTOs
Algunos endpoints usan `dtos/` (plural) y otros usan `dto/` (singular):
- `users/create/dtos/` vs `packages/create/dto/`

**Convención a seguir:** `dtos/` (plural), igual que el patrón de referencia en `users/create/`.

### 5.2 Función DTO sin prefijo `validate`
**Archivo:** `src/app/api/packages/updateStatus/dto/updateStatus.dto.ts`  
**Problema:** La función exportada se llama `updateStatusDto` en lugar de `validateUpdateStatusDto`.  
**Convención:** Todas las funciones de DTO deben llamarse `validateXxxDto(body: unknown)`.

### 5.3 `changeMyPwd` del usuario fuera de `auth/`
El endpoint `PATCH /api/users/changeMyPwd` permite a cualquier rol cambiar su propia contraseña. Conceptualmente pertenece a `auth/` junto con `changePwd`, `forgotPassword` y `me`.

### 5.4 `createPackageDto` innecesariamente `async`
**Archivo:** `src/app/api/packages/create/route.ts`  
```ts
const { packageInfo, address_info } = await createPackageDto(body);
```
La función `createPackageDto` es síncrona (la geocodificación ocurre en el service). Eliminar el `await` y declarar la función como síncrona.

### 5.5 Mezcla de snake_case y camelCase en `createPackage.service.ts`
**Archivo:** `src/app/api/packages/create/service/createPackage.service.ts`  
```ts
createPackageService(packageInfo, address_info)  // address_info en snake_case
```
**Convención:** usar camelCase en TypeScript para variables locales. El snake_case solo aplica a columnas de DB.

### 5.6 `findPendingPastRouteForUser` es un wrapper trivial en service
**Archivo:** `src/app/api/routes/continueFromPast/service/continueFromPast.service.ts`  
La función `findPendingPastRouteForUser` solo llama a `findLatestPastPendingRoute` sin añadir lógica. El `route.ts` importa esta función del service, lo que es correcto, pero la función debería añadir al menos una transformación o ser llamada directamente desde el service interno.

### 5.7 `todayIso()` duplicada
La función `todayIso()` que genera la fecha actual en formato `YYYY-MM-DD` se repite en varios servicios. Extraerla a `src/app/lib/date.ts`.

### 5.8 `DUMMY_HASH` hardcodeado en login service
**Archivo:** `src/app/api/auth/login/service/login.service.ts` línea 41  
```ts
const DUMMY_HASH = "$2b$10$j/waxomoVjsEiVu47WVHdu3CJIeGRfRsKOHasolKli6n2JNFjWnVq";
```
Aunque el propósito es mitigar timing attacks (correcto), el hash hardcodeado puede confundir. Documentar con un comentario claro o generarlo una vez al arranque.

### 5.9 Tipos `any` implícitos en `maps.service.ts`
**Archivo:** `src/app/lib/maps/maps.service.ts` líneas 87-107  
Los reducers sobre `route.legs` usan tipos inline anónimos en lugar de interfaces tipadas. Definir una interfaz `GoogleMapsLeg` para la respuesta de la API y usarla.

---

## 6. Seguridad

| # | Severidad | Descripción | Acción |
|---|---|---|---|
| S1 | 🔴 Alta | JWT_SECRET con fallback conocido en repo | Ver §4.2 |
| S2 | 🔴 Alta | DEFAULT_USER_PASSWORD con fallback conocido | Ver §4.3 |
| S3 | 🟡 Media | `handleError` filtra mensajes internos en 500 | Ver §4.5 |
| S4 | 🟡 Media | Rate limiting instalado pero no implementado | Ver §7.2 |
| S5 | 🟡 Media | `directions_api_key` con `!` sin validación | Ver §4.10 |
| S6 | 🟢 Baja | Variables MySQL pueden ser `undefined` en runtime | Ver §4.4 |

---

## 7. Cosas no documentadas

### 7.1 Flujo de autenticación completo

```
1. POST /api/auth/login
   → Devuelve { user, access_token } en body
   → Devuelve refresh_token en cookie HttpOnly (SameSite=Lax en dev, None+Secure en prod)

2. Cada request autenticado:
   → Header: Authorization: Bearer <access_token>

3. Cuando access_token expira (15 min por defecto):
   → POST /api/auth/refresh  (cookie refresh_token enviada automáticamente)
   → Rota el refresh token (el anterior se revoca en BD)
   → Devuelve nuevo { access_token } en body + nuevo refresh_token en cookie

4. POST /api/auth/logout
   → Revoca el refresh_token en BD
```

### 7.2 Rate limiting (instalado, no implementado)

Los paquetes `@upstash/ratelimit` y `@upstash/redis` están en `package.json` pero **no hay ningún middleware ni uso en el código**. Si se quiere implementar:
- Crear `src/app/lib/rateLimit.ts`
- Configurar Redis con `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` en `.env.local`
- Aplicar en los endpoints públicos: `login`, `forgotPassword`, `tracking/[token]`

### 7.3 Sistema de tracking público

Cada paquete tiene un token opaco (hex de 32 bytes) almacenado en la tabla `tokens` con `type='tracking_token'`. El endpoint `GET /api/tracking/[trackingToken]` es **público** (sin auth). El token expira según `TRACKING_EXPIRES_DAYS` (por defecto 30 días).

### 7.4 Flujo de creación de usuario y activación de cuenta

```
1. Admin: POST /api/users/create { name, email, role }
   → Usuario se crea con is_active=FALSE y contraseña DEFAULT_USER_PASSWORD hasheada
   → Se genera activate_account_token (hex 32 bytes, expira en 24h)
   → Se envía email con link: RESET_BASE_URL + token

2. Usuario: POST /api/auth/activateAccount?token=<token>
   { password, confirmPassword }
   → Verifica token no revocado y no expirado
   → Hashea nueva contraseña, activa cuenta (is_active=TRUE), revoca token
```

### 7.5 Flujo de reset de contraseña

```
1. POST /api/auth/forgotPassword { email }
   → Responde siempre con mensaje genérico (no filtra si el email existe)
   → Si el email existe: genera reset_pwd_token, envía email con link

2. POST /api/auth/changePwd?token=<token> { password, confirmPassword }
   → Verifica token (tipo reset_pwd_token, no revocado, no expirado)
   → Cambia contraseña, revoca token
```

### 7.6 Sistema de estados de paquete y sus efectos secundarios

```
pending → assigned:    Email "paquete asignado" al destinatario
assigned → in_transit: Email "paquete en tránsito" al destinatario
in_transit → delivered:   Email "paquete entregado"
in_transit → undelivered: Email "intento fallido de entrega"
in_transit → failed:      Email "entrega fallida definitiva"
```

Todos los cambios de estado se registran en `package_status_logs`. La lógica se centraliza en `src/app/lib/packageStatus/packageStatusSideEffects.service.ts`.

### 7.7 Flujo de creación de ruta optimizada

```
1. Admin: POST /api/routes/create { user_id, date, package_ids[] }
2. Service verifica que user_id es un distributor
3. Busca paquetes "carryover" (paquetes del usuario en estado assigned de días anteriores)
4. Une carryover + package_ids solicitados (máx 20 paradas)
5. Llama a Google Directions API con optimize:true para reordenar paradas
6. Inserta la ruta y las paradas con estimated_arrival calculadas
7. Actualiza estimated_delivery en cada paquete
8. Devuelve la ruta con paradas ordenadas y meta (distancia, duración)
```

### 7.8 Proxy del backend (`src/proxy.ts`)

El archivo `src/proxy.ts` existe en el backend pero no está documentado. Revisar si es parte de Next.js 15 proxy feature (`next.config.ts` proxy routes) o un punto de entrada personalizado.

### 7.9 Variables de entorno completas

```env
# Base de datos
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=pakag        # ⚠️ El schema.sql crea la DB como "erronka", no "pakag"
MYSQL_PORT=3306

# JWT
JWT_SECRET=<long-random-secret>      # ⚠️ OBLIGATORIO en producción
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_DAYS=7

# Email (Resend)
RESEND_API_KEY=re_xxxx

# Google Maps
GOOGLE_DIRECTIONS_API_KEY=AIzaSy_xxxx

# URLs
TRACKING_BASE_URL=https://tolosaerronka.es/tracking/
RESET_BASE_URL=https://tolosaerronka.es/resetPassword/

# Tokens
TRACKING_EXPIRES_DAYS=30

# Usuarios
DEFAULT_USER_PASSWORD=ChangeMe123!   # ⚠️ OBLIGATORIO en producción
```

**⚠️ Inconsistencia:** `schema.sql` crea la base de datos con nombre `erronka`, pero `MYSQL_DATABASE` en `.env.example` dice `pakag`. Verificar cuál es el nombre correcto en el entorno de producción.

### 7.10 Tests existentes

Existe un test unitario para el servicio de mapas:
```
src/app/lib/maps/__tests__/optimizeRoute.test.ts
```
No hay configuración de test runner documentada en `package.json` (no hay script `test`). Añadir vitest o jest y el script correspondiente.

### 7.11 Schema: nombre de columnas lat/lng en addresses

La tabla `addresses` usa `latitude` y `longitude` como nombres de columna, pero el código y los tipos TypeScript los exponen como `lat` y `lng` (renombrados en las queries SQL con `AS`). Tener esto en cuenta al escribir nuevas queries.

---

## 8. Reglas de desarrollo (resumen ejecutivo)

1. **`tsc --noEmit` siempre debe pasar.** Sin `any` explícito ni implícito.
2. **SQL solo en `repository/`.** Nunca en `route.ts`, `service/`, `dto/` ni `lib/`.
3. **Lógica solo en `service/`.** El repository no toma decisiones.
4. **`route.ts` solo orquesta:** `requireAuth → validateDto → service → res.xxx`.
5. **Errores:** usar siempre las clases de `src/app/lib/errors.ts`. No lanzar `new Error()` genérico.
6. **DTOs:** función `validateXxxDto(body: unknown): XxxDto`. Sin llamadas a BD.
7. **Nombres:** `dtos/` (plural), funciones `validateXxxDto`, servicios `xxxService`, repos `xxxRepository` o `xxx.repo.ts`.
8. **Nunca** exponer mensajes de error internos al cliente en respuestas 500.
9. **Variables de entorno críticas** (`JWT_SECRET`, `DEFAULT_USER_PASSWORD`, `GOOGLE_DIRECTIONS_API_KEY`) deben validarse en startup; no usar fallbacks en producción.
