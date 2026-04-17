# Prompt para Claude Code — pakAG Backend API

> Pega esto en Claude Code (terminal) desde la raíz del repositorio del backend.
> Si tu estructura tiene `src/app/api/...` (Next.js App Router), ya está todo preparado.

---

## 🎯 Objetivo

Implementar **todos los endpoints restantes** de la API REST de pakAG siguiendo la **clean architecture** ya establecida en el repo. Los servicios de **Email** y **Google Maps** se dejan como stubs tipados — función, firma, tipos y lugar donde meterlo, pero **sin implementación real**: yo (el usuario) lo rellenaré después.

---

## 🧭 Contexto del proyecto

**pakAG** — Sistema de gestión de paquetería para Euskal Herria. Dos roles:

- **admin** (kudeatzailea): app Java Swing, gestiona paquetes, banatzaileak, envía emails
- **distributor** (banatzailea): app React Web, ve sus paquetes, actualiza estados, consulta su ruta

**Stack del backend:**

- Next.js 15 App Router (Route Handlers en `src/app/api/...`)
- TypeScript strict
- MySQL (`mysql2/promise`, pool de conexiones) — **NO es Supabase** aunque haya archivos viejos que lo mencionen, ignóralos o límpialos
- JWT access (15 min) + refresh tokens en DB (tabla `tokens`)
- `bcryptjs` para hashear passwords
- `nodemailer` para email (Resend / SendGrid SMTP)
- Google Maps Directions API para rutas

**Tablas en DB** (7):
`users`, `packages`, `addresses`, `tokens`, `package_status_logs`, `routes`, `route_stops`.

La tabla `tokens` es unificada: el campo `type` distingue entre `refresh_token` (user_id lleno, 7 días) y `tracking` (package_id lleno, 30 días).

---

## 🏗️ Arquitectura (OBLIGATORIA, no negociable)

Cada endpoint vive en su carpeta `src/app/api/{recurso}/{accion}/` con **exactamente** esta estructura:

```
src/app/api/{recurso}/{accion}/
├── dtos/
│   └── {accion}.dto.ts        → interfaz Xxx + validateXxxDto(body: unknown)
├── repository/
│   └── {accion}.repository.ts → SOLO SQL puro (mysql2), sin lógica de negocio
├── service/
│   └── {accion}.service.ts    → SOLO lógica, sin SQL directo
├── types.ts                    → interfaces de dominio de este endpoint
└── route.ts                    → handler HTTP: try/catch + orquestación
```

**Reglas de capas (si las rompes, tendré que rehacerlo):**

1. **`route.ts`** — NUNCA tiene lógica de negocio ni SQL. Solo:
   - Parseo del body / params / auth
   - Llamada a `validateXxxDto()`
   - Llamada al servicio
   - Mapeo de errores a respuestas HTTP (4xx/5xx)
   - Logs de error con `console.error("[METHOD /api/ruta]", e)`
2. **`service/`** — Lógica pura. Llama al repository. No importa `NextRequest` ni `NextResponse`. No hace SQL.
3. **`repository/`** — SOLO SQL. Recibe tipos ya validados, devuelve tipos de dominio. No decide nada de negocio.
4. **`dtos/`** — Validación manual sin Zod:
   ```ts
   export interface CreatePackageDto { ... }
   export function validateCreatePackageDto(body: unknown): CreatePackageDto {
     if (typeof body !== "object" || body === null) throw new ValidationError("body inválido");
     // chequeo campo a campo...
     return body as CreatePackageDto;
   }
   ```
   Lanza `ValidationError` (clase custom en `src/lib/errors.ts` — créala si no existe) con mensajes claros.
5. **`types.ts`** — Interfaces del dominio del endpoint (entradas/salidas del service, no del HTTP).

---

## 📌 Referencia: patrón ya existente

**Ya están hechos y son la plantilla a copiar:**

- `src/app/api/users/create/`
- `src/app/api/users/changePwd/`

**Antes de escribir nada nuevo**, lee estos dos endpoints enteros (todos sus archivos) y respeta:

- Los nombres de funciones (`validateXxxDto`, `xxxService`, `xxxRepository`)
- El estilo de imports
- Cómo se manejan los errores
- El estilo de las respuestas JSON (`res.ok()`, `res.validationError()`, `res.serverError()`, etc. — si hay helpers en `src/lib/response.ts`, úsalos; si no, crea ese helper antes de seguir)
- El estilo de logs
- El formato de SQL (prepared statements con `?`, nunca concatenación)

Si ves inconsistencias entre `users/create` y `users/changePwd`, la que está mejor es la referencia; si dudas, pregúntame.

---

## 📋 Endpoints a implementar

Agrupados en **fases**. **Ejecuta fase a fase**, para de verificar con `npx tsc --noEmit` al final de cada fase, y reporta antes de continuar.

### Fase 1 — Auth completo (crítico, lo demás depende de esto)

| Endpoint       | Método | Auth                  | Descripción                                                  |
| -------------- | ------ | --------------------- | ------------------------------------------------------------ |
| `auth/login`   | POST   | público               | email + password → access_token + refresh_token (15m / 7d)   |
| `auth/refresh` | POST   | refresh token en body | nuevo access_token (rotar refresh opcional pero recomendado) |
| `auth/logout`  | POST   | access token          | revoca el refresh token (UPDATE `tokens` SET `revoked=true`) |
| `auth/me`      | GET    | access token          | devuelve el usuario actual (sin password_hash)               |

Crea también `src/lib/jwt.ts` con `signAccessToken`, `verifyAccessToken`, `requireAuth(req, allowedRoles?)` si no existe ya.

### Fase 2 — Users (resto)

| Endpoint        | Método | Auth  | Descripción                                                     |
| --------------- | ------ | ----- | --------------------------------------------------------------- |
| `users/list`    | GET    | admin | lista todos, filtro opcional `?role=distributor&is_active=true` |
| `users/getById` | GET    | admin | por `?id=`                                                      |
| `users/update`  | PATCH  | admin | cambia `full_name`, `phone`, `email`                            |
| `users/disable` | PATCH  | admin | soft delete: `is_active=false`                                  |
| `users/enable`  | PATCH  | admin | reactiva                                                        |

### Fase 3 — Addresses (las necesitan los packages)

| Endpoint            | Método | Auth  | Descripción                                        |
| ------------------- | ------ | ----- | -------------------------------------------------- |
| `addresses/create`  | POST   | admin | recibe street/city/postal_code/lat/lng             |
| `addresses/list`    | GET    | admin | todas, con paginación (`?page=&limit=`)            |
| `addresses/getById` | GET    | admin | por `?id=`                                         |
| `addresses/update`  | PATCH  | admin |                                                    |
| `addresses/delete`  | DELETE | admin | si no hay packages asociados; si hay, 409 Conflict |

### Fase 4 — Packages (núcleo del sistema)

| Endpoint                   | Método | Auth                            | Notas                                                                                                                                                                                                                          |
| -------------------------- | ------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/create`          | POST   | admin                           | Genera `tracking_code` único + token tipo `tracking` (UUID, 30 días). Al final llama a `emailService.sendTrackingEmail(...)` (stub).                                                                                           |
| `packages/list`            | GET    | admin                           | Lista todas con JOIN a address + distributor. Filtros `?status=&assigned_to=&from=&to=`. Paginada.                                                                                                                             |
| `packages/getById`         | GET    | admin o el distributor asignado | Devuelve `PackageWithDetails`                                                                                                                                                                                                  |
| `packages/update`          | PATCH  | admin                           | Datos del destinatario, peso, notas, dirección                                                                                                                                                                                 |
| `packages/delete`          | DELETE | admin                           | Solo si `status='pending'`, si no 409                                                                                                                                                                                          |
| `packages/assign`          | PATCH  | admin                           | asigna `assigned_to`, mete log en `package_status_logs`, pasa status a `assigned`                                                                                                                                              |
| `packages/updateStatus`    | PATCH  | admin o el distributor asignado | Cambia status. Si pasa a `in_transit` → `emailService.sendInTransitEmail(...)` (stub). Si pasa a `delivered` → fija `delivered_at` + `emailService.sendDeliveredEmail(...)` (stub). Siempre mete log en `package_status_logs`. |
| `packages/getMyPackages`   | GET    | distributor                     | Solo los del usuario autenticado. Filtro opcional por status.                                                                                                                                                                  |
| `packages/getDailySummary` | GET    | admin                           | Conteo por status del día de hoy. `{ pending: N, assigned: N, in_transit: N, delivered: N, failed: N }`                                                                                                                        |

**Reglas de validación de status:** solo transiciones permitidas:

- `pending → assigned`
- `assigned → in_transit | failed`
- `in_transit → delivered | failed`
- `failed → in_transit` (reintentar)
- `delivered` es terminal

Si se intenta una transición inválida → `ValidationError` → 400.

### Fase 5 — Package Status Logs (historial)

| Endpoint             | Método | Auth                            | Descripción                                     |
| -------------------- | ------ | ------------------------------- | ----------------------------------------------- |
| `logs/listByPackage` | GET    | admin o distributor del paquete | historial de un paquete por `?package_id=`      |
| `logs/listAll`       | GET    | admin                           | todos, filtros `?from=&to=&changed_by=&status=` |

### Fase 6 — Routes + Stops

| Endpoint                  | Método | Auth                  | Descripción                                                                                                                                                                      |
| ------------------------- | ------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `routes/create`           | POST   | admin                 | crea ruta para un distributor + fecha + array de package_ids. Genera route_stops ordenados. Al final llama a `mapsService.optimizeRoute(...)` (stub) para calcular orden óptimo. |
| `routes/getMyDaily`       | GET    | distributor           | su ruta del día (`?date=YYYY-MM-DD`, default hoy) con stops y packages                                                                                                           |
| `routes/getByUserAndDate` | GET    | admin                 | `?user_id=&date=`                                                                                                                                                                |
| `routes/update`           | PATCH  | admin                 |                                                                                                                                                                                  |
| `stops/updateArrival`     | PATCH  | distributor del route | marca `actual_arrival_time`                                                                                                                                                      |
| `stops/reorder`           | PATCH  | admin                 | cambia el orden de los stops                                                                                                                                                     |

### Fase 7 — Tracking público (sin auth)

| Endpoint              | Método | Auth        | Descripción                                                                                                                                                                                                                                |
| --------------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tracking/getByToken` | GET    | **público** | `?token=UUID`. Valida en `tokens` (tipo `tracking`, no revocado, no expirado). Devuelve `PublicTrackingInfo` (ver `types.ts` raíz): recipient_name, status, distributor_name, estimated_delivery, historial público (sin emails, sin IDs). |

---

## 📧 Services como stubs (NO implementar la lógica real)

Crea `src/lib/email/email.service.ts` con **solo firmas y TODOs**:

```ts
// src/lib/email/email.service.ts
// TODO: implementar con nodemailer + Resend/SendGrid

export interface TrackingEmailParams {
  to: string;
  recipientName: string;
  trackingCode: string;
  trackingUrl: string; // ej: https://pakag.eus/tracking/{uuid}
}

export interface InTransitEmailParams {
  to: string;
  recipientName: string;
  distributorName: string;
  estimatedDelivery: string;
}

export interface DeliveredEmailParams {
  to: string;
  recipientName: string;
  deliveredAt: string;
}

export const emailService = {
  async sendTrackingEmail(params: TrackingEmailParams): Promise<void> {
    // TODO: implementar envío
    console.log("[stub] sendTrackingEmail", params);
  },

  async sendInTransitEmail(params: InTransitEmailParams): Promise<void> {
    // TODO: implementar envío
    console.log("[stub] sendInTransitEmail", params);
  },

  async sendDeliveredEmail(params: DeliveredEmailParams): Promise<void> {
    // TODO: implementar envío
    console.log("[stub] sendDeliveredEmail", params);
  },
};
```

Crea `src/lib/maps/maps.service.ts` también como stub:

```ts
// src/lib/maps/maps.service.ts
// TODO: implementar con Google Maps Directions API

export interface RouteStop {
  packageId: string;
  lat: number;
  lng: number;
}

export interface OptimizedRoute {
  orderedStops: Array<RouteStop & { order: number; estimatedArrival: string }>;
  totalDistanceKm: number;
  totalDurationMin: number;
}

export const mapsService = {
  async optimizeRoute(
    origin: { lat: number; lng: number },
    stops: RouteStop[]
  ): Promise<OptimizedRoute> {
    // TODO: llamada a https://maps.googleapis.com/maps/api/directions/json con waypoints optimize:true
    console.log("[stub] optimizeRoute", { origin, stopsCount: stops.length });
    return {
      orderedStops: stops.map((s, i) => ({
        ...s,
        order: i,
        estimatedArrival: new Date().toISOString(),
      })),
      totalDistanceKm: 0,
      totalDurationMin: 0,
    };
  },
};
```

**Importante:** el stub **debe tener los tipos completos y exportados**, y devolver un valor coherente con el tipo de retorno, para que el código que los llama compile y funcione en local aunque no haga nada real.

---

## ✅ Criterios de "hecho"

1. `npx tsc --noEmit` pasa sin errores en todo el repo
2. `npm run lint` pasa (si hay ESLint configurado)
3. Cada endpoint tiene **los 5 archivos** (`dtos/`, `repository/`, `service/`, `route.ts`, `types.ts`)
4. Ningún `route.ts` contiene SQL ni lógica de negocio
5. Ningún `repository/` tiene lógica de negocio (if/else de reglas, llamadas a email, etc.)
6. Ningún `service/` tiene SQL directo ni importa `mysql2`
7. Todos los errores de negocio se lanzan como `ValidationError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError` (crea esas clases en `src/lib/errors.ts` si no existen) y se mapean en `route.ts` a su código HTTP
8. Los `console.error` siempre llevan `[METHOD /api/ruta]` como prefijo
9. Los servicios `email` y `maps` son **stubs con `console.log`** — jamás implementar la llamada real en este prompt

---

## 🚦 Cómo ejecutar (flujo esperado)

1. **Lee primero** `src/app/api/users/create/` entero y `src/app/api/users/changePwd/` entero. Deriva el estilo.
2. Revisa `src/lib/` entero — mira qué helpers existen (`response.ts`, `jwt.ts`, `db.ts`, `errors.ts`). Si falta alguno que vas a necesitar, créalo antes.
3. Revisa el **schema SQL** en el repo (`schema.sql`, `database.sql`, `migrations/`, o lo que haya). Si no encuentras el schema, **para y pregúntame** antes de inventar nombres de columnas.
4. Ejecuta **fase por fase**. Al final de cada fase:
   - `npx tsc --noEmit`
   - Si falla, arregla ANTES de seguir
   - Haz un resumen breve de lo creado
   - **Continúa automáticamente** con la siguiente fase (no preguntes permiso salvo si encuentras algo ambiguo)
5. Al final, genera un `API.md` en la raíz con la tabla de todos los endpoints: método, ruta, auth requerido, body de ejemplo, respuesta de ejemplo.

---

## ⚠️ Cosas que NO debes hacer

- NO uses Zod (el patrón del repo es validación manual con `validateXxxDto`)
- NO pongas SQL en services ni en routes
- NO implementes el envío real de emails ni la llamada real a Google Maps
- NO inventes columnas de la DB — si dudas del schema, pregunta
- NO rompas el estilo existente de `users/create` / `users/changePwd`
- NO uses `any` — si hace falta, usa `unknown` y tipa bien tras validar
- NO metas comentarios obvios (`// creamos el usuario` sobre una línea que claramente crea el usuario). Solo comentarios que expliquen el "por qué" no el "qué".

---

## 📦 Entregable final

Cuando termines las 7 fases:

1. Todos los endpoints compilan y siguen la arquitectura
2. `src/lib/email/email.service.ts` y `src/lib/maps/maps.service.ts` están como stubs tipados con `console.log`
3. `API.md` actualizado
4. Mensaje final resumen: qué quedó hecho, qué stubs quedan, qué TODO quedaron pendientes

Arranca ya. Empieza por **leer la referencia** y luego la **Fase 1**.
