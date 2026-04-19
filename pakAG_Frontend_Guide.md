# pakAG — Guía Completa del Frontend React

> **App de repartidores (banatzaileak)** — construida en React + TypeScript.  
> Arquitectura escalable para que en el futuro también pueda tener vista de administrador web.  
> Paleta: dark UI con acento morado profundo.

---

## Índice

1. [Contexto rápido](#1-contexto-rápido)
2. [Stack técnico](#2-stack-técnico)
3. [Arquitectura de archivos](#3-arquitectura-de-archivos)
4. [Autenticación: el middleware de React](#4-autenticación-el-middleware-de-react)
5. [Tipados TypeScript de la API](#5-tipados-typescript-de-la-api)
6. [Capa de servicios: cómo organizar los fetch](#6-capa-de-servicios-cómo-organizar-los-fetch)
7. [Páginas y vistas](#7-páginas-y-vistas)
8. [Google Maps](#8-google-maps)
9. [Gestión de estado global](#9-gestión-de-estado-global)
10. [Variables de entorno](#10-variables-de-entorno)

---

## 1. Contexto rápido

| Parte | Tecnología | Quién la usa |
|---|---|---|
| App escritorio admin | Java + Swing | Kudeatzailea (administrador) |
| **App web** ← TÚ | React + TypeScript | Banatzaileak (repartidores) en móvil/tablet |
| Backend API | Node.js + Express | Ambas apps |
| Base de datos | Supabase + PostgreSQL | Solo el backend |

La app React **solo habla HTTP/JSON con la API**. Nunca toca Supabase directamente.

**Base URL:** `http://<host>/api`  
**Auth:** `Authorization: Bearer <access_token>` en cada petición protegida.

---

## 2. Stack técnico

| Paquete | Para qué |
|---|---|
| `react` + `typescript` | Base |
| `react-router-dom` v6 | Navegación y rutas protegidas |
| `axios` | HTTP client (interceptores automáticos) |
| `zustand` | Estado global ligero (mejor que Redux para este tamaño) |
| `@tanstack/react-query` | Cache de peticiones, loading/error states automáticos |
| `@react-google-maps/api` | Google Maps en React |
| `react-hook-form` + `zod` | Formularios con validación tipada |
| `date-fns` | Manipulación de fechas |
| `tailwindcss` | Estilos utility-first |
| `shadcn/ui` | Componentes base (ya usa Tailwind, customizable) |

---

## 3. Arquitectura de archivos

```
src/
│
├── main.tsx                        ← Punto de entrada. ReactDOM.createRoot.
├── App.tsx                         ← Router principal con rutas y ProtectedRoute.
│
├── config/
│   └── api.config.ts               ← BASE_URL, timeouts, versión. Una sola fuente de verdad.
│
├── lib/
│   ├── axios.ts                    ← Instancia de Axios configurada con interceptores.
│   └── queryClient.ts              ← Instancia de React Query.
│
├── types/
│   ├── api.types.ts                ← Tipos base: ApiResponse<T>, PaginatedResponse<T>, ApiError
│   ├── auth.types.ts               ← User, LoginPayload, LoginResponse, TokenPayload
│   ├── package.types.ts            ← Package, PackageStatus, CreatePackagePayload...
│   ├── route.types.ts              ← Route, Stop, DailyRoute...
│   └── log.types.ts                ← LogEntry, LogFilter...
│
├── services/                       ← TODA la lógica de fetch vive aquí. Las páginas solo llaman servicios.
│   ├── auth.service.ts
│   ├── package.service.ts
│   ├── route.service.ts
│   └── log.service.ts
│
├── store/
│   └── auth.store.ts               ← Estado global de autenticación (zustand)
│
├── hooks/                          ← React Query hooks custom. Encapsulan loading, error, data.
│   ├── useAuth.ts
│   ├── usePackages.ts
│   ├── useMyRoute.ts
│   └── useLogs.ts
│
├── middleware/
│   └── ProtectedRoute.tsx          ← El "middleware" de React. Protege rutas del dashboard.
│
├── pages/
│   ├── Login/
│   │   ├── LoginPage.tsx
│   │   └── LoginPage.module.css    (o Tailwind clases directamente)
│   ├── TwoFactor/
│   │   └── TwoFactorPage.tsx
│   ├── Dashboard/
│   │   └── DashboardPage.tsx
│   ├── Packages/
│   │   ├── PackagesPage.tsx        ← Lista de paquetes asignados
│   │   └── PackageDetailPage.tsx   ← Detalle de un paquete
│   ├── Route/
│   │   └── RoutePage.tsx           ← Mapa con Google Maps + paradas
│   ├── History/
│   │   └── HistoryPage.tsx         ← Historial personal de entregas
│   ├── Settings/
│   │   └── SettingsPage.tsx        ← Perfil, cambiar email, 2FA
│   └── Tracking/
│       └── TrackingPage.tsx        ← Página pública (sin auth) de seguimiento
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx           ← Shell con sidebar + contenido
│   │   ├── Sidebar.tsx
│   │   └── BottomNav.tsx           ← Navegación en móvil
│   ├── ui/                         ← Componentes genéricos reutilizables
│   │   ├── Badge.tsx               ← Badge de estado de paquete (coloreado por estado)
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── EmptyState.tsx
│   └── package/
│       ├── PackageCard.tsx         ← Card de paquete para vista móvil
│       └── PackageStatusBadge.tsx
│
└── utils/
    ├── token.utils.ts              ← Leer payload JWT, comprobar expiración
    ├── date.utils.ts               ← Formatear fechas con date-fns
    └── status.utils.ts             ← Colores y labels por PackageStatus
```

---

## 4. Autenticación: el "middleware" de React

### ¿Qué significa "middleware" en React?

En React no hay un middleware como en Express. Lo que se hace es:

1. **`ProtectedRoute`** — componente que comprueba si hay token antes de renderizar cualquier página protegida. Si no hay sesión → redirige a `/login`. Esto es el equivalente al middleware de ruta.

2. **Interceptores de Axios** — se ejecutan automáticamente antes de cada petición (añaden el header `Authorization`) y después de cada respuesta (manejan los 401 renovando el token). Esto es el equivalente al middleware de request/response.

---

### 4.1 — `ProtectedRoute.tsx`

```tsx
// src/middleware/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export function ProtectedRoute() {
  const { accessToken, isInitialized } = useAuthStore()

  // Mientras se comprueba si hay sesión guardada (al arrancar), no renderizamos nada
  if (!isInitialized) {
    return <div>Cargando...</div>
  }

  // Si no hay token → redirigir al login
  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  // Autenticado → renderizar la página hija
  return <Outlet />
}
```

### 4.2 — `App.tsx` con las rutas

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/middleware/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/Login/LoginPage'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
// ...

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas PÚBLICAS — no requieren autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/2fa" element={<TwoFactorPage />} />
        <Route path="/tracking/:token" element={<TrackingPage />} />

        {/* Rutas PROTEGIDAS — pasan por ProtectedRoute primero */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/packages/:id" element={<PackageDetailPage />} />
            <Route path="/route" element={<RoutePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Redirigir / al dashboard o al login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### 4.3 — Store de autenticación (`zustand`)

```tsx
// src/store/auth.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/auth.types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isInitialized: boolean

  setTokens: (access: string, refresh: string) => void
  setUser: (user: User) => void
  logout: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isInitialized: false,

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({ accessToken: null, refreshToken: null, user: null }),

      initialize: () => set({ isInitialized: true }),
    }),
    {
      name: 'pakag-auth',           // Clave en localStorage
      partialState: (state) => ({   // Solo persistir el refreshToken, no el accessToken
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
)
```

### 4.4 — Interceptores de Axios

```ts
// src/lib/axios.ts
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { API_BASE_URL } from '@/config/api.config'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── REQUEST INTERCEPTOR ────────────────────────────────────────────────────
// Antes de cada petición: añadir el access token automáticamente
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// ── RESPONSE INTERCEPTOR ──────────────────────────────────────────────────
// Si la respuesta es 401 (token expirado) → intentar renovar con refreshToken
let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

apiClient.interceptors.response.use(
  (response) => response, // respuesta OK → pasar normal
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        // Si ya hay un refresh en curso, encolar esta petición
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(apiClient(originalRequest))
          })
        })
      }

      isRefreshing = true
      const { refreshToken, setTokens, logout } = useAuthStore.getState()

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })
        const newAccessToken = data.accessToken
        setTokens(newAccessToken, data.refreshToken ?? refreshToken!)

        // Resolver las peticiones en cola
        refreshQueue.forEach((cb) => cb(newAccessToken))
        refreshQueue = []

        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch {
        // Refresh falló → sesión caducada → logout
        logout()
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
```

---

## 5. Tipados TypeScript de la API

Esta sección es **la que más importa**. Todos los tipos viven en `src/types/` y son la fuente de verdad del contrato con la API.

### 5.1 — Tipos base (`api.types.ts`)

```ts
// src/types/api.types.ts

// Wrapper genérico que envuelve TODA respuesta exitosa de la API
export interface ApiResponse<T> {
  success: true
  data: T
  message?: string
}

// Respuesta paginada (para listados con filtros)
export interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Error de la API
export interface ApiError {
  success: false
  error: string
  details?: Record<string, string>  // errores de validación campo a campo
}

// Tipo de error de Axios tipado
export interface AxiosApiError {
  response?: {
    data: ApiError
    status: number
  }
}
```

### 5.2 — Tipos de autenticación (`auth.types.ts`)

```ts
// src/types/auth.types.ts

export type UserRole = 'admin' | 'banatzailea'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  has2FA: boolean
  createdAt: string
}

// POST /auth/login — body
export interface LoginPayload {
  email: string
  password: string
}

// POST /auth/login — respuesta exitosa
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
  requires2FA?: boolean   // Si true → redirigir a /login/2fa
}

// POST /auth/refresh — body
export interface RefreshPayload {
  refreshToken: string
}

// POST /auth/refresh — respuesta
export interface RefreshResponse {
  accessToken: string
  refreshToken?: string   // El backend puede rotar el refresh token o no
}

// POST /auth/verify-2fa — body
export interface Verify2FAPayload {
  code: string            // Código de 6 dígitos
}

// GET /auth/me — respuesta
export type MeResponse = ApiResponse<User>
```

### 5.3 — Tipos de paquetes (`package.types.ts`)

```ts
// src/types/package.types.ts
import type { ApiResponse, PaginatedResponse } from './api.types'

export type PackageStatus =
  | 'pendiente'
  | 'en_ruta'
  | 'entregado'
  | 'fallido'
  | 'devuelto'

export interface Package {
  id: string
  trackingCode: string
  status: PackageStatus

  // Destinatario
  recipientName: string
  recipientEmail: string
  recipientPhone?: string

  // Dirección de entrega
  address: string
  city: string
  postalCode: string
  country: string

  // Coordenadas (para el mapa)
  lat?: number
  lng?: number

  // Relaciones
  assignedTo?: string           // ID del repartidor asignado
  assignedToName?: string       // Nombre para mostrar (join del backend)

  // Metadata
  notes?: string
  estimatedDelivery?: string    // ISO date string
  createdAt: string
  updatedAt: string
}

// GET /packages/getMyPackages — respuesta (paquetes del repartidor autenticado)
export type MyPackagesResponse = PaginatedResponse<Package>

// PATCH /packages/updateStatus — body
export interface UpdatePackageStatusPayload {
  packageId: string
  status: PackageStatus
  notes?: string
}

// PATCH /packages/updateStatus — respuesta
export type UpdatePackageStatusResponse = ApiResponse<Package>
```

### 5.4 — Tipos de rutas y paradas (`route.types.ts`)

```ts
// src/types/route.types.ts
import type { ApiResponse } from './api.types'
import type { Package } from './package.types'

export type RouteStatus = 'pendiente' | 'en_curso' | 'completada'
export type StopStatus = 'pendiente' | 'completada' | 'saltada'

export interface Stop {
  id: string
  routeId: string
  packageId: string
  package: Package          // El backend devuelve el paquete embebido
  order: number             // Posición en la ruta (1, 2, 3...)
  status: StopStatus
  estimatedArrival?: string // ISO datetime
  actualArrival?: string    // ISO datetime — se rellena al confirmar llegada
}

export interface Route {
  id: string
  userId: string
  date: string              // YYYY-MM-DD
  status: RouteStatus
  stops: Stop[]
  totalStops: number
  completedStops: number
  createdAt: string
}

// GET /routes/getMyDaily — respuesta
export type MyDailyRouteResponse = ApiResponse<Route>

// PATCH /stops/updateArrival — body
export interface UpdateArrivalPayload {
  stopId: string
  status: StopStatus
}

// PATCH /stops/updateArrival — respuesta
export type UpdateArrivalResponse = ApiResponse<Stop>
```

### 5.5 — Tipos de historial/logs (`log.types.ts`)

```ts
// src/types/log.types.ts
import type { PaginatedResponse } from './api.types'
import type { PackageStatus } from './package.types'

export interface LogEntry {
  id: string
  packageId: string
  userId: string
  userName: string          // JOIN del backend para mostrar nombre
  previousStatus: PackageStatus | null
  newStatus: PackageStatus
  notes?: string
  createdAt: string
}

// GET /logs/listByPackage — respuesta
export type PackageLogsResponse = PaginatedResponse<LogEntry>

// GET /logs/listAll — query params (para la vista de historial)
export interface LogFilters {
  packageId?: string
  userId?: string
  status?: PackageStatus
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}
```

### 5.6 — Tipo de tracking público (`tracking.types.ts`)

```ts
// src/types/tracking.types.ts
import type { ApiResponse } from './api.types'
import type { PackageStatus } from './package.types'

export interface TrackingInfo {
  trackingCode: string
  status: PackageStatus
  recipientName: string
  city: string
  estimatedDelivery?: string
  delivererName?: string    // Nombre del repartidor (sin datos sensibles)
  lastUpdate: string
}

// GET /tracking/:token — respuesta pública
export type TrackingResponse = ApiResponse<TrackingInfo>
```

---

## 6. Capa de servicios: cómo organizar los fetch

**Regla de oro:** Las páginas/componentes **nunca llaman a `apiClient` directamente**. Siempre usan un hook (que a su vez usa un servicio). Esto hace que todo sea testeable y reutilizable.

```
Componente → Hook (React Query) → Servicio → apiClient (Axios)
```

### 6.1 — `auth.service.ts`

```ts
// src/services/auth.service.ts
import { apiClient } from '@/lib/axios'
import type {
  LoginPayload, LoginResponse,
  RefreshPayload, RefreshResponse,
  MeResponse, Verify2FAPayload
} from '@/types/auth.types'

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>('/auth/login', payload),

  logout: () =>
    apiClient.post('/auth/logout'),

  refresh: (payload: RefreshPayload) =>
    apiClient.post<RefreshResponse>('/auth/refresh', payload),

  getMe: () =>
    apiClient.get<MeResponse>('/auth/me'),

  verify2FA: (payload: Verify2FAPayload) =>
    apiClient.post('/auth/verify-2fa', payload),
}
```

### 6.2 — `package.service.ts`

```ts
// src/services/package.service.ts
import { apiClient } from '@/lib/axios'
import type {
  MyPackagesResponse,
  UpdatePackageStatusPayload,
  UpdatePackageStatusResponse
} from '@/types/package.types'

export const packageService = {
  // Paquetes asignados al repartidor autenticado
  getMyPackages: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<MyPackagesResponse>('/packages/getMyPackages', { params }),

  // Actualizar estado de un paquete (ej: marcar entregado)
  updateStatus: (payload: UpdatePackageStatusPayload) =>
    apiClient.patch<UpdatePackageStatusResponse>('/packages/updateStatus', payload),
}
```

### 6.3 — `route.service.ts`

```ts
// src/services/route.service.ts
import { apiClient } from '@/lib/axios'
import type {
  MyDailyRouteResponse,
  UpdateArrivalPayload,
  UpdateArrivalResponse
} from '@/types/route.types'

export const routeService = {
  // Ruta del día del repartidor autenticado
  getMyDaily: (date?: string) =>
    apiClient.get<MyDailyRouteResponse>('/routes/getMyDaily', {
      params: date ? { date } : undefined,
    }),

  // Confirmar llegada a una parada
  updateArrival: (payload: UpdateArrivalPayload) =>
    apiClient.patch<UpdateArrivalResponse>('/stops/updateArrival', payload),
}
```

### 6.4 — Hooks con React Query

Los hooks encapsulan el estado de loading/error/data y el caché automático.

```ts
// src/hooks/useMyRoute.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { routeService } from '@/services/route.service'
import type { UpdateArrivalPayload } from '@/types/route.types'

export function useMyDailyRoute(date?: string) {
  return useQuery({
    queryKey: ['route', 'daily', date],
    queryFn: async () => {
      const { data } = await routeService.getMyDaily(date)
      return data.data       // Tipado: Route
    },
    staleTime: 1000 * 60,   // 1 minuto de caché
  })
}

export function useUpdateArrival() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateArrivalPayload) =>
      routeService.updateArrival(payload),
    onSuccess: () => {
      // Invalidar la caché de la ruta para que se recargue
      queryClient.invalidateQueries({ queryKey: ['route', 'daily'] })
    },
  })
}
```

**Uso en un componente:**

```tsx
// src/pages/Route/RoutePage.tsx
import { useMyDailyRoute, useUpdateArrival } from '@/hooks/useMyRoute'

export function RoutePage() {
  const { data: route, isLoading, error } = useMyDailyRoute()
  const { mutate: updateArrival, isPending } = useUpdateArrival()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message="Error cargando la ruta" />
  if (!route) return <EmptyState message="No tienes ruta asignada hoy" />

  return (
    <div>
      <h1>Ruta del día — {route.completedStops}/{route.totalStops} paradas</h1>
      {/* Mapa, lista de paradas, etc. */}
    </div>
  )
}
```

---

## 7. Páginas y vistas

### 7.1 — `/login` — LoginPage

**Qué hace:** Formulario de login. Si el servidor devuelve `requires2FA: true` redirige a `/login/2fa`.

**Elementos:**
- Logo pakAG + tagline
- Campo email + campo password con toggle mostrar/ocultar
- Checkbox "Recordarme"
- Botón "Iniciar sesión" (estado loading con spinner)
- Mensaje de error inline
- Footer

**Fetch:** `POST /auth/login`

**Lógica post-login:**
```ts
const onSubmit = async (values: LoginPayload) => {
  const { data } = await authService.login(values)
  if (data.requires2FA) {
    navigate('/login/2fa')
  } else {
    setTokens(data.accessToken, data.refreshToken)
    setUser(data.user)
    navigate('/dashboard')
  }
}
```

---

### 7.2 — `/login/2fa` — TwoFactorPage

**Qué hace:** 6 inputs individuales para el código OTP. Auto-focus al siguiente al escribir. Countdown para reenviar.

**Fetch:** `POST /auth/verify-2fa`

---

### 7.3 — `/dashboard` — DashboardPage

**Qué hace:** Vista general del día del repartidor.

**Elementos:**
- Header "¡Buenos días, [nombre]!"
- Cards de resumen: paquetes pendientes hoy, en ruta, entregados, fallidos
- Lista resumida de los próximos paquetes (máx 5)
- Botón "Ver mi ruta" → `/route`
- Banner si hay paquete activo "en curso"

**Fetch:** `GET /packages/getMyPackages` con filtros del día

---

### 7.4 — `/packages` — PackagesPage

**Qué hace:** Lista completa de paquetes asignados al repartidor.

**Elementos:**
- Filtros: por estado (chips/tabs), búsqueda por destinatario o dirección
- Vista móvil: lista de cards (`PackageCard`)
- Vista desktop: tabla
- Cada item tiene botón "Ver detalle" → `/packages/:id`
- Badge de estado coloreado según `PackageStatus`

**Fetch:** `GET /packages/getMyPackages` con paginación

---

### 7.5 — `/packages/:id` — PackageDetailPage

**Qué hace:** Detalle completo de un paquete + historial de cambios.

**Elementos:**
- Info del destinatario y dirección
- Badge de estado actual
- Botones de acción: "Marcar entregado", "Marcar fallido", "En ruta"
- Mini mapa con la ubicación del paquete (Google Maps estático o embed)
- Sección "Historial" con timeline de cambios de estado

**Fetches:**
- `GET /packages/getMyPackages` (ya cacheado, filtrar por ID)
- `PATCH /packages/updateStatus`
- `GET /logs/listByPackage`

---

### 7.6 — `/route` — RoutePage

**Qué hace:** La vista más importante para el repartidor en campo. Mapa con la ruta del día y todas las paradas en orden.

**Elementos:**
- Google Maps con:
  - Marcadores numerados por cada parada
  - Línea de ruta dibujada entre paradas (Directions API)
  - Marcador de posición actual del usuario
- Lista de paradas debajo del mapa, en orden:
  - Dirección + nombre destinatario
  - Estado (pendiente / completada)
  - Botón "Confirmar llegada" / "Marcar entregado"
- Barra de progreso: X/Y paradas completadas

**Fetches:**
- `GET /routes/getMyDaily`
- `PATCH /stops/updateArrival`
- `PATCH /packages/updateStatus`

---

### 7.7 — `/history` — HistoryPage

**Qué hace:** Historial personal del repartidor: todos los paquetes que ha entregado, con filtros.

**Elementos:**
- Filtros: rango de fechas, estado
- Lista/tabla de logs con: paquete, estado anterior, nuevo estado, fecha
- Paginación

**Fetch:** `GET /logs/listByPackage` o el endpoint de historial personal

---

### 7.8 — `/settings` — SettingsPage

**Qué hace:** Configuración del perfil del usuario.

**Secciones:**
- **Perfil:** cambiar nombre, email (requiere contraseña actual para confirmación)
- **Seguridad:** cambiar contraseña, activar/desactivar 2FA
- **Sesiones:** botón "Cerrar sesión en todos los dispositivos"

**Fetches:**
- `GET /auth/me`
- `PATCH /users/update` (editar su propio perfil)

---

### 7.9 — `/tracking/:token` — TrackingPage (PÚBLICA)

**Qué hace:** Página pública sin login. El cliente accede desde el email con el link de tracking.

**Elementos:**
- Sin navbar ni layout del dashboard
- Logo pakAG
- Estado del paquete con icono grande y texto claro ("Tu paquete está en camino")
- Entrega estimada
- Nombre del repartidor (solo el nombre, sin datos sensibles)
- Timeline visual del estado: pedido → en ruta → entregado

**Fetch:** `GET /tracking/:token` — **sin header Authorization**

---

## 8. Google Maps

### Setup

```ts
// src/main.tsx — envolver la app con el provider
import { LoadScript } from '@react-google-maps/api'

const LIBRARIES: ('places' | 'directions')[] = ['places', 'directions']

root.render(
  <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY} libraries={LIBRARIES}>
    <App />
  </LoadScript>
)
```

### En RoutePage — Directions entre paradas

```tsx
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api'

// Calcular la ruta entre todas las paradas
const calculateRoute = async (stops: Stop[]) => {
  const directionsService = new google.maps.DirectionsService()

  const waypoints = stops.slice(1, -1).map((stop) => ({
    location: { lat: stop.package.lat!, lng: stop.package.lng! },
    stopover: true,
  }))

  const result = await directionsService.route({
    origin: { lat: stops[0].package.lat!, lng: stops[0].package.lng! },
    destination: {
      lat: stops[stops.length - 1].package.lat!,
      lng: stops[stops.length - 1].package.lng!,
    },
    waypoints,
    travelMode: google.maps.TravelMode.DRIVING,
    optimizeWaypoints: false,   // El orden ya lo optimiza el backend
  })

  setDirections(result)
}
```

---

## 9. Gestión de estado global

Solo hay **dos cosas que necesitan estado global** en esta app. Todo lo demás es estado local del componente o caché de React Query.

| Estado | Dónde | Por qué |
|---|---|---|
| Autenticación (tokens + user) | `zustand` | Necesario en toda la app |
| Caché de datos de API | `react-query` | Loading, error, refetch automático |
| Estado de formularios | `react-hook-form` | Local al componente |
| Estado de UI (modales, etc.) | `useState` local | No necesita ser global |

No usar Redux para esto. Es excesivo para el tamaño del proyecto.

---

## 10. Variables de entorno

```env
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_KEY=AIza...
```

```ts
// src/config/api.config.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
export const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string
```

---

## Resumen: endpoints que usa el frontend React

| Página | Método | Endpoint |
|---|---|---|
| Login | POST | `/auth/login` |
| Verify 2FA | POST | `/auth/verify-2fa` |
| Auto-renovar token | POST | `/auth/refresh` |
| Cargar usuario | GET | `/auth/me` |
| Dashboard | GET | `/packages/getMyPackages` |
| Paquetes (lista) | GET | `/packages/getMyPackages` |
| Paquetes (cambiar estado) | PATCH | `/packages/updateStatus` |
| Detalle paquete (historial) | GET | `/logs/listByPackage` |
| Ruta del día | GET | `/routes/getMyDaily` |
| Confirmar parada | PATCH | `/stops/updateArrival` |
| Historial personal | GET | `/logs/listByPackage` |
| Settings (editar perfil) | PATCH | `/users/update` |
| Tracking público | GET | `/tracking/:token` |
| Logout | POST | `/auth/logout` |
