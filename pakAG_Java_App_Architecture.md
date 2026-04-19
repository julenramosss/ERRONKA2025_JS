# pakAG Admin App — Arquitectura, Estructura y Buenas Prácticas

> Documento de referencia completo para el desarrollo de la aplicación de escritorio Java + Swing.  
> Léelo entero antes de escribir una sola línea de código. La IA con la que hagas live coding también debe tenerlo presente en todo momento.

---

## Índice

1. [Estructura de directorios](#1-estructura-de-directorios)
2. [Arquitectura en capas](#2-arquitectura-en-capas)
3. [Capa de red — `network/`](#3-capa-de-red--network)
4. [Capa de DTOs — `dto/`](#4-capa-de-dtos--dto)
5. [Capa de servicios — `service/`](#5-capa-de-servicios--service)
6. [Capa de sesión y seguridad — `session/`](#6-capa-de-sesión-y-seguridad--session)
7. [Escalabilidad futura — CSRF y 2FA](#7-escalabilidad-futura--csrf-y-2fa)
8. [Capa GUI — `gui/`](#8-capa-gui--gui)
9. [Paleta de colores y tema FlatLaf](#9-paleta-de-colores-y-tema-flatlaf)
10. [Funcionalidades completas de la GUI](#10-funcionalidades-completas-de-la-gui)
11. [Buenas prácticas de Java](#11-buenas-prácticas-de-java)
12. [Manejo de errores y excepciones](#12-manejo-de-errores-y-excepciones)
13. [Concurrencia en Swing](#13-concurrencia-en-swing)
14. [Checklist antes de entregar](#14-checklist-antes-de-entregar)

---

## 1. Estructura de directorios

```
src/
└── main/
    └── java/
        └── com/
            └── pakag/
                └── admin/
                    │
                    ├── Main.java                  ← Punto de entrada. Inicializa FlatLaf y arranca la app.
                    │
                    ├── config/
                    │   └── AppConfig.java         ← Constantes globales: BASE_URL, timeouts, versión, etc.
                    │
                    ├── session/
                    │   ├── SessionManager.java    ← Singleton. Guarda access token y datos del usuario en memoria.
                    │   ├── TokenStorage.java      ← Lee/escribe el refresh token en disco (Preferences API).
                    │   └── SecurityContext.java   ← Estado de seguridad: rol, permisos, flags 2FA/CSRF.
                    │
                    ├── network/
                    │   ├── ApiClient.java         ← HttpClient centralizado. Gestión de headers, token auto-refresh.
                    │   ├── ApiResponse.java       ← Wrapper genérico de respuesta HTTP.
                    │   ├── RequestInterceptor.java← Interceptor: añade auth, CSRF token, logs.
                    │   └── CookieStore.java       ← Gestión manual de cookies (refresh_token, CSRF).
                    │
                    ├── dto/
                    │   ├── auth/
                    │   │   ├── LoginRequestDto.java
                    │   │   ├── LoginResponseDto.java
                    │   │   ├── RefreshResponseDto.java
                    │   │   └── UserDto.java
                    │   ├── user/
                    │   │   ├── CreateUserRequestDto.java
                    │   │   ├── UpdateUserRequestDto.java
                    │   │   ├── UserDetailDto.java
                    │   │   └── UsersListResponseDto.java
                    │   ├── packages/
                    │   │   ├── CreatePackageRequestDto.java
                    │   │   ├── UpdatePackageRequestDto.java
                    │   │   ├── PackageDto.java
                    │   │   ├── PackageInfoDto.java
                    │   │   ├── AddressInfoDto.java
                    │   │   ├── PackagesListResponseDto.java
                    │   │   └── DailySummaryDto.java
                    │   ├── logs/
                    │   │   ├── LogEntryDto.java
                    │   │   └── LogsListResponseDto.java
                    │   └── routes/
                    │       ├── CreateRouteRequestDto.java
                    │       ├── RouteDto.java
                    │       ├── StopDto.java
                    │       ├── RouteWithStopsDto.java
                    │       ├── ReorderStopsRequestDto.java
                    │       └── StopOrderDto.java
                    │
                    ├── service/
                    │   ├── AuthService.java       ← login(), logout(), refresh(), me()
                    │   ├── UserService.java       ← create(), list(), getById(), update()
                    │   ├── PackageService.java    ← create(), list(), getById(), update(), delete(), getDailySummary()
                    │   ├── LogService.java        ← listAll(), listByPackage()
                    │   └── RouteService.java      ← create(), getByUserAndDate(), updateStatus(), reorderStops()
                    │
                    ├── exception/
                    │   ├── ApiException.java      ← Excepción con statusCode + mensaje de la API.
                    │   ├── SessionExpiredException.java
                    │   ├── NetworkException.java
                    │   └── UnauthorizedException.java
                    │
                    └── gui/
                        ├── AppFrame.java          ← JFrame principal. Contiene el layout raíz.
                        ├── NavigationManager.java ← Controla qué panel está activo.
                        ├── Theme.java             ← Paleta de colores, fuentes, dimensiones globales.
                        │
                        ├── auth/
                        │   ├── LoginPanel.java    ← Pantalla de login.
                        │   └── TwoFactorPanel.java← Pantalla de introducir código 2FA (preparada para el futuro).
                        │
                        ├── common/
                        │   ├── Sidebar.java           ← Panel lateral de navegación.
                        │   ├── HeaderBar.java         ← Barra superior con nombre de usuario y logout.
                        │   ├── StatusBadge.java       ← Componente de badge coloreado para estados.
                        │   ├── PaginationPanel.java   ← Componente reutilizable de paginación.
                        │   ├── LoadingOverlay.java    ← Overlay semitransparente con spinner.
                        │   ├── ConfirmDialog.java     ← Diálogo de confirmación reutilizable.
                        │   ├── ErrorDialog.java       ← Diálogo de error reutilizable.
                        │   ├── RoundedButton.java     ← JButton con bordes redondeados.
                        │   └── FilterBar.java         ← Componente de barra de filtros reutilizable.
                        │
                        ├── dashboard/
                        │   └── DashboardPanel.java    ← Resumen del día con tarjetas de estado.
                        │
                        ├── packages/
                        │   ├── PackagesPanel.java         ← Vista principal: tabla + filtros + paginación.
                        │   ├── PackageTableModel.java     ← AbstractTableModel para la tabla.
                        │   ├── PackageFormDialog.java     ← Modal crear/editar paquete.
                        │   ├── PackageDetailDialog.java   ← Modal detalle + historial de un paquete.
                        │   └── PackageStatusRenderer.java ← Renderer de celda para mostrar badges de estado.
                        │
                        ├── users/
                        │   ├── UsersPanel.java            ← Vista principal: tabla + filtros + paginación.
                        │   ├── UserTableModel.java
                        │   ├── UserFormDialog.java        ← Modal crear/editar usuario.
                        │   └── UserDetailDialog.java      ← Modal detalle de usuario.
                        │
                        ├── routes/
                        │   ├── RoutesPanel.java           ← Vista de creación y consulta de rutas.
                        │   ├── CreateRouteDialog.java     ← Modal para crear ruta (seleccionar repartidor, fecha, paquetes).
                        │   ├── RouteDetailDialog.java     ← Modal para ver ruta con paradas y reordenarlas.
                        │   └── StopListModel.java         ← Modelo de lista para drag & drop de paradas.
                        │
                        └── logs/
                            ├── LogsPanel.java             ← Vista historial global con filtros.
                            └── LogTableModel.java
```

---

## 2. Arquitectura en capas

La aplicación sigue una arquitectura estricta de **4 capas**. Cada capa solo se comunica con la inmediatamente inferior. **Nunca saltes capas.**

```
┌───────────────────────────────────────────────────────┐
│                    GUI Layer  (gui/)                   │
│  Panels, Dialogs, Renderers, Models de tabla          │
│  Solo llama a: Service Layer                          │
│  Nunca llama a: ApiClient, DTOs directamente          │
└─────────────────────────┬─────────────────────────────┘
                          │ llama a
┌─────────────────────────▼─────────────────────────────┐
│                  Service Layer  (service/)             │
│  AuthService, PackageService, UserService, etc.       │
│  Lógica de negocio del cliente. Construye DTOs.       │
│  Solo llama a: ApiClient                              │
└─────────────────────────┬─────────────────────────────┘
                          │ llama a
┌─────────────────────────▼─────────────────────────────┐
│                  Network Layer  (network/)             │
│  ApiClient, RequestInterceptor, CookieStore           │
│  HTTP puro. Sin lógica de negocio.                    │
│  Solo devuelve: ApiResponse<String> (JSON crudo)      │
└─────────────────────────┬─────────────────────────────┘
                          │ HTTP/JSON
                          ▼
                   Node.js + Express API
```

**Regla de oro:** La GUI no sabe qué es un `HttpRequest`. Los servicios no saben qué es un `JPanel`. El `ApiClient` no sabe qué es un paquete.

---

## 3. Capa de red — `network/`

### `AppConfig.java`

```java
package com.pakag.admin.config;

public final class AppConfig {
    private AppConfig() {}

    public static final String BASE_URL        = "http://localhost:3000/api";
    public static final int    CONNECT_TIMEOUT = 10;   // segundos
    public static final int    READ_TIMEOUT    = 30;   // segundos
    public static final String APP_VERSION     = "1.0.0";
    public static final String APP_NAME        = "pakAG Admin";

    // Preparado para 2FA: nombre del header cuando el servidor lo requiera
    public static final String TOTP_HEADER     = "X-2FA-Code";

    // Preparado para CSRF: nombre del header y cookie
    public static final String CSRF_HEADER     = "X-CSRF-Token";
    public static final String CSRF_COOKIE     = "csrf_token";
}
```

---

### `ApiResponse.java`

Wrapper genérico que encapsula la respuesta HTTP. Los servicios trabajan con esto, no con `HttpResponse` directamente.

```java
package com.pakag.admin.network;

public class ApiResponse<T> {
    private final int    statusCode;
    private final T      body;
    private final String rawBody;

    public ApiResponse(int statusCode, T body, String rawBody) {
        this.statusCode = statusCode;
        this.body       = body;
        this.rawBody    = rawBody;
    }

    public boolean isSuccess() { return statusCode >= 200 && statusCode < 300; }
    public int     getStatusCode() { return statusCode; }
    public T       getBody()       { return body; }
    public String  getRawBody()    { return rawBody; }
}
```

---

### `CookieStore.java`

Gestión manual de cookies en memoria (y lectura de `Set-Cookie` de las respuestas). **No confiar en el CookieManager de Java, que tiene comportamiento errático con HttpOnly.**

```java
package com.pakag.admin.network;

import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class CookieStore {
    private static final CookieStore INSTANCE = new CookieStore();
    private final Map<String, String> cookies  = new HashMap<>();

    private CookieStore() {}
    public static CookieStore getInstance() { return INSTANCE; }

    /** Extrae y guarda todas las cookies relevantes de una respuesta HTTP. */
    public void extractFromResponse(HttpResponse<String> response) {
        response.headers().allValues("set-cookie").forEach(header -> {
            String[] parts = header.split(";");
            if (parts.length > 0) {
                String[] kv = parts[0].split("=", 2);
                if (kv.length == 2) {
                    cookies.put(kv[0].trim(), kv[1].trim());
                }
            }
        });
    }

    /** Construye el header Cookie para enviar en una petición. */
    public String buildCookieHeader(String... keys) {
        StringBuilder sb = new StringBuilder();
        for (String key : keys) {
            if (cookies.containsKey(key)) {
                if (sb.length() > 0) sb.append("; ");
                sb.append(key).append("=").append(cookies.get(key));
            }
        }
        return sb.toString();
    }

    public Optional<String> get(String key) {
        return Optional.ofNullable(cookies.get(key));
    }

    public void set(String key, String value) { cookies.put(key, value); }
    public void remove(String key)            { cookies.remove(key); }
    public void clear()                       { cookies.clear(); }
}
```

---

### `ApiClient.java`

El núcleo de la capa de red. Centraliza todas las peticiones HTTP, gestiona el refresh automático del token y añade los headers de seguridad.

```java
package com.pakag.admin.network;

import com.google.gson.Gson;
import com.pakag.admin.config.AppConfig;
import com.pakag.admin.exception.ApiException;
import com.pakag.admin.exception.SessionExpiredException;
import com.pakag.admin.session.SessionManager;
import com.pakag.admin.session.TokenStorage;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class ApiClient {

    private static final ApiClient INSTANCE = new ApiClient();
    private final HttpClient httpClient;
    private final Gson       gson = new Gson();

    private ApiClient() {
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(AppConfig.CONNECT_TIMEOUT))
            .build();
    }

    public static ApiClient getInstance() { return INSTANCE; }

    // ─── Métodos públicos ────────────────────────────────────────────────────

    public ApiResponse<String> get(String path) throws Exception {
        return execute(buildAuthRequest(path).GET().build());
    }

    public ApiResponse<String> post(String path, Object body) throws Exception {
        return execute(buildAuthRequest(path)
            .POST(jsonBody(body)).build());
    }

    public ApiResponse<String> patch(String path, Object body) throws Exception {
        return execute(buildAuthRequest(path)
            .method("PATCH", jsonBody(body)).build());
    }

    public ApiResponse<String> delete(String path) throws Exception {
        return execute(buildAuthRequest(path).DELETE().build());
    }

    /** POST sin auth (para /auth/login, /auth/refresh) */
    public ApiResponse<String> postPublic(String path, Object body, String... cookieKeys) throws Exception {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
            .uri(URI.create(AppConfig.BASE_URL + path))
            .timeout(Duration.ofSeconds(AppConfig.READ_TIMEOUT))
            .header("Content-Type", "application/json")
            .POST(body != null ? jsonBody(body) : HttpRequest.BodyPublishers.noBody());

        // Añadir cookies si se piden (e.g. refresh_token para /auth/refresh)
        if (cookieKeys.length > 0) {
            String cookieHeader = CookieStore.getInstance().buildCookieHeader(cookieKeys);
            if (!cookieHeader.isEmpty()) builder.header("Cookie", cookieHeader);
        }

        HttpResponse<String> raw = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        CookieStore.getInstance().extractFromResponse(raw);  // guardar nuevas cookies
        return new ApiResponse<>(raw.statusCode(), raw.body(), raw.body());
    }

    // ─── Internos ────────────────────────────────────────────────────────────

    private HttpRequest.Builder buildAuthRequest(String path) throws Exception {
        ensureValidToken();
        String token = SessionManager.getInstance().getAccessToken();

        HttpRequest.Builder builder = HttpRequest.newBuilder()
            .uri(URI.create(AppConfig.BASE_URL + path))
            .timeout(Duration.ofSeconds(AppConfig.READ_TIMEOUT))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + token);

        // ── Preparado para CSRF ──────────────────────────────────────────────
        // Cuando el backend empiece a emitir CSRF tokens, el servidor
        // mandará el token en una cookie. Aquí ya lo leemos y lo enviamos
        // en el header X-CSRF-Token automáticamente. Solo hay que descomentar:
        //
        // CookieStore.getInstance().get(AppConfig.CSRF_COOKIE)
        //     .ifPresent(csrf -> builder.header(AppConfig.CSRF_HEADER, csrf));

        return builder;
    }

    private ApiResponse<String> execute(HttpRequest request) throws Exception {
        HttpResponse<String> raw = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        CookieStore.getInstance().extractFromResponse(raw);

        if (raw.statusCode() == 401) {
            // Token expirado en el servidor aunque no lo detectamos en cliente → reintentar
            boolean renewed = refreshAccessToken();
            if (!renewed) throw new SessionExpiredException("Sesión expirada");
            return execute(request); // segundo intento con el token nuevo
        }

        return new ApiResponse<>(raw.statusCode(), raw.body(), raw.body());
    }

    private void ensureValidToken() throws Exception {
        String token = SessionManager.getInstance().getAccessToken();
        if (token == null || SessionManager.getInstance().isTokenExpiredSoon()) {
            boolean renewed = refreshAccessToken();
            if (!renewed) throw new SessionExpiredException("No hay sesión activa");
        }
    }

    public boolean refreshAccessToken() {
        String refreshToken = TokenStorage.loadRefreshToken();
        if (refreshToken == null) return false;

        try {
            CookieStore.getInstance().set("refresh_token", refreshToken);
            ApiResponse<String> resp = postPublic("/auth/refresh", null, "refresh_token");

            if (resp.isSuccess()) {
                // Parsear nuevo access_token
                com.google.gson.JsonObject json =
                    com.google.gson.JsonParser.parseString(resp.getBody()).getAsJsonObject();
                String newToken = json.get("access_token").getAsString();
                SessionManager.getInstance().setAccessToken(newToken);

                // Guardar nuevo refresh_token (token rotation)
                CookieStore.getInstance().get("refresh_token")
                    .ifPresent(TokenStorage::saveRefreshToken);
                return true;
            }
        } catch (Exception e) {
            System.err.println("[ApiClient] Error en refresh: " + e.getMessage());
        }
        return false;
    }

    private HttpRequest.BodyPublisher jsonBody(Object body) {
        return HttpRequest.BodyPublishers.ofString(gson.toJson(body));
    }
}
```

---

## 4. Capa de DTOs — `dto/`

Los DTOs (Data Transfer Objects) son **clases simples de solo datos** — sin lógica, sin dependencias. Su único propósito es mapear JSON a Java y viceversa con Gson.

### Reglas para los DTOs:

- Todos los campos son `private`.
- Constructor vacío obligatorio para Gson (o usa el de todos los campos).
- Getters para todos los campos. Setters solo si la clase se usa en requests.
- Los nombres de campo deben coincidir exactamente con los campos JSON de la API **o** usar `@SerializedName`.
- No mezcles lógica de negocio en los DTOs.

### Ejemplos clave:

**`LoginRequestDto.java`**

```java
package com.pakag.admin.dto.auth;

public class LoginRequestDto {
    private final String email;
    private final String password;

    public LoginRequestDto(String email, String password) {
        this.email    = email;
        this.password = password;
    }

    public String getEmail()    { return email; }
    public String getPassword() { return password; }
}
```

**`LoginResponseDto.java`**

```java
package com.pakag.admin.dto.auth;

import com.google.gson.annotations.SerializedName;

public class LoginResponseDto {
    private UserDto user;

    @SerializedName("access_token")
    private String accessToken;

    public UserDto getUserDto()     { return user; }
    public String  getAccessToken() { return accessToken; }
}
```

**`UserDto.java`** (dentro de auth/ porque viene en el login; el de users/ tiene más campos)

```java
package com.pakag.admin.dto.auth;

import com.google.gson.annotations.SerializedName;

public class UserDto {
    private int     id;
    private String  name;
    private String  email;
    private String  role;

    @SerializedName("is_active")
    private boolean isActive;

    // Getters...
}
```

**`PackageDto.java`**

```java
package com.pakag.admin.dto.packages;

import com.google.gson.annotations.SerializedName;

public class PackageDto {
    private int     id;

    @SerializedName("tracking_code")
    private String  trackingCode;

    @SerializedName("recipient_name")
    private String  recipientName;

    @SerializedName("recipient_email")
    private String  recipientEmail;

    @SerializedName("weight_kg")
    private double  weightKg;

    private String  description;
    private String  status;

    @SerializedName("estimated_delivery")
    private String  estimatedDelivery;

    @SerializedName("assigned_to")
    private Integer assignedTo;

    @SerializedName("created_by")
    private int     createdBy;

    @SerializedName("created_at")
    private String  createdAt;

    // Campos de address (vienen joineados en list y getById)
    private String  street;
    private String  city;

    @SerializedName("postal_code")
    private String  postalCode;

    private Double  latitude;
    private Double  longitude;

    // Getters...
}
```

**`CreatePackageRequestDto.java`** — el body tiene estructura anidada

```java
package com.pakag.admin.dto.packages;

public class CreatePackageRequestDto {
    private final PackageInfoDto packageInfo;    // campo "packageInfo" en JSON
    private final AddressInfoDto address_info;  // campo "address_info" en JSON

    public CreatePackageRequestDto(PackageInfoDto packageInfo, AddressInfoDto addressInfo) {
        this.packageInfo  = packageInfo;
        this.address_info = addressInfo;
    }

    // Getters...
}
```

**`DailySummaryDto.java`**

```java
package com.pakag.admin.dto.packages;

import java.util.Map;

public class DailySummaryDto {
    private String           date;
    private Map<String, Integer> summary;  // {"pending":5, "assigned":12, ...}
    private int              total;

    public String              getDate()    { return date; }
    public Map<String, Integer> getSummary() { return summary; }
    public int                 getTotal()   { return total; }
}
```

**`PackagesListResponseDto.java`** — para respuestas paginadas

```java
package com.pakag.admin.dto.packages;

import java.util.List;

public class PackagesListResponseDto {
    private List<PackageDto> packages;
    private int              total;
    private int              page;
    private int              limit;

    // Getters...
}
```

---

## 5. Capa de servicios — `service/`

Los servicios son el puente entre la GUI y la red. Contienen **toda la lógica del cliente**: construyen DTOs, llaman al `ApiClient`, parsean el JSON de respuesta y lanzan excepciones con mensajes claros.

```java
package com.pakag.admin.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.pakag.admin.dto.packages.*;
import com.pakag.admin.exception.ApiException;
import com.pakag.admin.network.ApiClient;
import com.pakag.admin.network.ApiResponse;

public class PackageService {

    private static final PackageService INSTANCE = new PackageService();
    private final ApiClient apiClient = ApiClient.getInstance();
    private final Gson      gson      = new Gson();

    private PackageService() {}
    public static PackageService getInstance() { return INSTANCE; }

    // ── Listar paquetes con filtros ──────────────────────────────────────────

    public PackagesListResponseDto list(String status, Integer assignedTo, String city,
                                        int page, int limit) throws Exception {
        StringBuilder path = new StringBuilder("/packages/list?page=" + page + "&limit=" + limit);
        if (status    != null) path.append("&status=").append(status);
        if (assignedTo != null) path.append("&assigned_to=").append(assignedTo);
        if (city      != null && !city.isBlank()) path.append("&city=").append(city);

        ApiResponse<String> resp = apiClient.get(path.toString());
        handleErrors(resp);
        return gson.fromJson(resp.getBody(), PackagesListResponseDto.class);
    }

    // ── Crear paquete ────────────────────────────────────────────────────────

    public PackageDto create(CreatePackageRequestDto request) throws Exception {
        ApiResponse<String> resp = apiClient.post("/packages/create", request);
        handleErrors(resp);
        return gson.fromJson(resp.getBody(), PackageDto.class);
    }

    // ── Obtener por ID ───────────────────────────────────────────────────────

    public PackageDto getById(int id) throws Exception {
        ApiResponse<String> resp = apiClient.get("/packages/getById?id=" + id);
        handleErrors(resp);
        return gson.fromJson(resp.getBody(), PackageDto.class);
    }

    // ── Actualizar ───────────────────────────────────────────────────────────

    public PackageDto update(int id, UpdatePackageRequestDto request) throws Exception {
        ApiResponse<String> resp = apiClient.patch("/packages/update?id=" + id, request);
        handleErrors(resp);
        return gson.fromJson(resp.getBody(), PackageDto.class);
    }

    // ── Eliminar ─────────────────────────────────────────────────────────────

    public void delete(int id) throws Exception {
        ApiResponse<String> resp = apiClient.delete("/packages/delete?id=" + id);
        handleErrors(resp);
    }

    // ── Resumen diario ───────────────────────────────────────────────────────

    public DailySummaryDto getDailySummary() throws Exception {
        ApiResponse<String> resp = apiClient.get("/packages/getDailySummary");
        handleErrors(resp);
        return gson.fromJson(resp.getBody(), DailySummaryDto.class);
    }

    // ── Manejo de errores ────────────────────────────────────────────────────

    private void handleErrors(ApiResponse<String> resp) throws ApiException {
        if (!resp.isSuccess()) {
            String message = "Error del servidor";
            try {
                JsonObject json = JsonParser.parseString(resp.getBody()).getAsJsonObject();
                if (json.has("error")) message = json.get("error").getAsString();
            } catch (Exception ignored) {}
            throw new ApiException(resp.getStatusCode(), message);
        }
    }
}
```

> Todos los demás servicios (`AuthService`, `UserService`, `LogService`, `RouteService`) siguen el mismo patrón exacto.

---

## 6. Capa de sesión y seguridad — `session/`

### `SessionManager.java`

```java
package com.pakag.admin.session;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.pakag.admin.dto.auth.UserDto;

import java.util.Date;

public class SessionManager {
    private static final SessionManager INSTANCE = new SessionManager();

    private String  accessToken;
    private UserDto currentUser;

    private SessionManager() {}
    public static SessionManager getInstance() { return INSTANCE; }

    public String  getAccessToken()               { return accessToken; }
    public void    setAccessToken(String token)   { this.accessToken = token; }
    public UserDto getCurrentUser()               { return currentUser; }
    public void    setCurrentUser(UserDto user)   { this.currentUser = user; }
    public boolean isLoggedIn()                   { return accessToken != null && currentUser != null; }

    /** Devuelve true si el token expira en menos de 60 segundos. */
    public boolean isTokenExpiredSoon() {
        if (accessToken == null) return true;
        try {
            DecodedJWT jwt = JWT.decode(accessToken);
            return jwt.getExpiresAt().before(new Date(System.currentTimeMillis() + 60_000));
        } catch (Exception e) {
            return true;
        }
    }

    public void clear() {
        accessToken = null;
        currentUser = null;
    }
}
```

### `TokenStorage.java`

```java
package com.pakag.admin.session;

import java.util.prefs.Preferences;

public final class TokenStorage {
    private TokenStorage() {}

    private static final Preferences PREFS = Preferences.userNodeForPackage(TokenStorage.class);
    private static final String KEY_REFRESH = "pakag_refresh_token";

    /** Guarda en el registro de Windows (o equivalente en macOS/Linux). */
    public static void    saveRefreshToken(String token) { PREFS.put(KEY_REFRESH, token); }
    public static String  loadRefreshToken()             { return PREFS.get(KEY_REFRESH, null); }
    public static void    clearRefreshToken()            { PREFS.remove(KEY_REFRESH); }
}
```

### `SecurityContext.java`

Centraliza los flags de seguridad. Preparado para 2FA y CSRF.

```java
package com.pakag.admin.session;

public class SecurityContext {
    private static final SecurityContext INSTANCE = new SecurityContext();

    // ── Estado 2FA ────────────────────────────────────────────────────────────
    // Cuando el servidor devuelva { "requires_2fa": true } en el login,
    // setRequires2FA(true) y mostrar TwoFactorPanel antes de ir al MainFrame.
    private boolean requires2FA      = false;
    private boolean twoFactorPassed  = false;

    // ── Estado CSRF ───────────────────────────────────────────────────────────
    // Cuando el servidor empiece a mandar CSRF tokens, se guardan aquí
    // además de en CookieStore. El ApiClient los lee de CookieStore.
    private String csrfToken         = null;

    private SecurityContext() {}
    public static SecurityContext getInstance() { return INSTANCE; }

    public boolean isRequires2FA()           { return requires2FA; }
    public void    setRequires2FA(boolean v) { requires2FA = v; }
    public boolean isTwoFactorPassed()       { return twoFactorPassed; }
    public void    setTwoFactorPassed(boolean v) { twoFactorPassed = v; }
    public String  getCsrfToken()            { return csrfToken; }
    public void    setCsrfToken(String t)    { csrfToken = t; }

    public void    reset() {
        requires2FA     = false;
        twoFactorPassed = false;
        csrfToken       = null;
    }
}
```

---

## 7. Escalabilidad futura — CSRF y 2FA

### 7.1 — Soporte CSRF

El backend actualmente usa JWT stateless y no necesita CSRF. Pero si en el futuro se añade (por ejemplo, si se empiezan a usar cookies de sesión para algo), la arquitectura ya está preparada:

**Lo que hay que hacer cuando el backend lo implemente:**

1. El servidor enviará el CSRF token en una cookie no-HttpOnly (para que el cliente JS/Java pueda leerla).
2. En `CookieStore.extractFromResponse()` ya se extrae automáticamente.
3. En `ApiClient.buildAuthRequest()` hay un bloque comentado que envía `X-CSRF-Token`. Solo hay que descomentarlo.
4. En `SecurityContext` se puede cachear el valor si se necesita acceso desde la GUI.

**Cambios en código: 1 línea descomentada en `ApiClient.java`.** El resto ya está implementado.

---

### 7.2 — Soporte 2FA por email (o TOTP)

**Flujo de autenticación con 2FA activo:**

```
POST /auth/login  →  Servidor responde con { "requires_2fa": true, "temp_token": "..." }
                                              │
                                              ▼
                              Mostrar TwoFactorPanel (pedir código de email/TOTP)
                                              │
                              POST /auth/verify2fa  { "code": "123456", "temp_token": "..." }
                                              │
                              Responde con { "access_token": "...", user }
                                              │
                              Continuar flujo normal (guardar token, ir a MainFrame)
```

**Lo que ya está preparado:**

- `TwoFactorPanel.java` está en la estructura (solo hay que implementarlo).
- `SecurityContext.requires2FA` y `SecurityContext.twoFactorPassed` ya existen.
- `AppConfig.TOTP_HEADER` ya está definido.
- `NavigationManager` debe comprobar `SecurityContext.isTwoFactorPassed()` antes de ir a `MainFrame`.

**Cambios en código cuando el backend implemente 2FA:**

1. En `AuthService.login()`: si la respuesta tiene `requires_2fa: true`, setear `SecurityContext.setRequires2FA(true)` y guardar el `temp_token`.
2. `NavigationManager.showMainFrame()`: antes de navegar, comprobar el flag.
3. Implementar `TwoFactorPanel` (campo de texto + botón verificar + llamada a `/auth/verify2fa`).
4. Añadir `verify2FA(String code, String tempToken)` a `AuthService`.

**Cambios en código: mínimos y localizados. La arquitectura ya los soporta.**

---

## 8. Capa GUI — `gui/`

### Reglas absolutas de la GUI:

1. **Toda la lógica de UI está dentro de `gui/`**. Cero referencias a `ApiClient` o a `HttpRequest` desde cualquier clase de `gui/`.
2. **Las llamadas a servicios siempre van en `SwingWorker`**. Nunca bloquees el Event Dispatch Thread (EDT).
3. **Los datos entre UI y servicios viajan como DTOs**. Nunca pases objetos de Swing (como el texto de un `JTextField`) a un servicio directamente — extrae los valores primero.
4. **Los diálogos modales son `JDialog`**. Usa `setModal(true)` para que bloqueen la ventana padre.
5. **Toda actualización de UI ocurre en el EDT**: usa `SwingUtilities.invokeLater()` si dudas.

---

### `Main.java` — Punto de entrada

```java
package com.pakag.admin;

import com.formdev.flatlaf.FlatDarkLaf;
import com.pakag.admin.gui.AppFrame;
import com.pakag.admin.session.SessionManager;
import com.pakag.admin.network.ApiClient;
import com.pakag.admin.session.TokenStorage;

import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        // 1. Aplicar el tema ANTES de cualquier componente Swing
        FlatDarkLaf.setup();
        applyCustomTheme();

        // 2. Arrancar en el EDT
        SwingUtilities.invokeLater(() -> {
            AppFrame frame = new AppFrame();

            // 3. Intentar restaurar sesión desde disco
            String savedToken = TokenStorage.loadRefreshToken();
            if (savedToken != null) {
                boolean renewed = ApiClient.getInstance().refreshAccessToken();
                if (renewed) {
                    frame.showMainView();
                    return;
                }
            }

            // 4. Sin sesión válida → pantalla de login
            frame.showLoginView();
        });
    }

    private static void applyCustomTheme() {
        // Ver sección 9 para los valores exactos
        UIManager.put("Component.arc", 8);
        UIManager.put("Button.arc",    8);
        UIManager.put("TextComponent.arc", 6);
    }
}
```

---

### `NavigationManager.java`

Controla qué panel se muestra en el área de contenido del `AppFrame`. Patrón **CardLayout**.

```java
package com.pakag.admin.gui;

import javax.swing.*;
import java.awt.*;

public class NavigationManager {
    private static final NavigationManager INSTANCE = new NavigationManager();

    public static final String LOGIN     = "LOGIN";
    public static final String TWO_FA    = "TWO_FA";
    public static final String DASHBOARD = "DASHBOARD";
    public static final String PACKAGES  = "PACKAGES";
    public static final String USERS     = "USERS";
    public static final String ROUTES    = "ROUTES";
    public static final String LOGS      = "LOGS";

    private JPanel      contentArea;
    private CardLayout  cardLayout;
    private AppFrame    appFrame;

    private NavigationManager() {}
    public static NavigationManager getInstance() { return INSTANCE; }

    public void init(AppFrame frame, JPanel content, CardLayout layout) {
        this.appFrame    = frame;
        this.contentArea = content;
        this.cardLayout  = layout;
    }

    public void navigateTo(String destination) {
        SwingUtilities.invokeLater(() -> {
            cardLayout.show(contentArea, destination);
            appFrame.getSidebar().setActiveItem(destination);
        });
    }
}
```

---

### `AppFrame.java`

El `JFrame` raíz. Nunca crea lógica de negocio aquí, solo estructura visual.

```java
package com.pakag.admin.gui;

import com.pakag.admin.gui.auth.LoginPanel;
import com.pakag.admin.gui.common.Sidebar;
import com.pakag.admin.gui.common.HeaderBar;
import com.pakag.admin.gui.dashboard.DashboardPanel;
import com.pakag.admin.gui.packages.PackagesPanel;
import com.pakag.admin.gui.users.UsersPanel;
import com.pakag.admin.gui.routes.RoutesPanel;
import com.pakag.admin.gui.logs.LogsPanel;

import javax.swing.*;
import java.awt.*;

public class AppFrame extends JFrame {

    private Sidebar   sidebar;
    private JPanel    contentArea;
    private CardLayout cardLayout;
    private JPanel    mainLayout;   // sidebar + content
    private LoginPanel loginPanel;

    public AppFrame() {
        setTitle("pakAG — Administración");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1280, 800);
        setMinimumSize(new Dimension(1024, 680));
        setLocationRelativeTo(null);

        initComponents();
        NavigationManager.getInstance().init(this, contentArea, cardLayout);
        setVisible(true);
    }

    private void initComponents() {
        // Login panel (pantalla completa, sin sidebar)
        loginPanel = new LoginPanel(this);

        // Área principal (sidebar + contenido)
        sidebar     = new Sidebar();
        cardLayout  = new CardLayout();
        contentArea = new JPanel(cardLayout);

        contentArea.add(new DashboardPanel(), NavigationManager.DASHBOARD);
        contentArea.add(new PackagesPanel(),  NavigationManager.PACKAGES);
        contentArea.add(new UsersPanel(),     NavigationManager.USERS);
        contentArea.add(new RoutesPanel(),    NavigationManager.ROUTES);
        contentArea.add(new LogsPanel(),      NavigationManager.LOGS);

        mainLayout = new JPanel(new BorderLayout());
        mainLayout.add(sidebar,     BorderLayout.WEST);
        mainLayout.add(new HeaderBar(), BorderLayout.NORTH);
        mainLayout.add(contentArea, BorderLayout.CENTER);

        // Root: CardLayout entre login y main
        CardLayout rootLayout = new CardLayout();
        JPanel root = new JPanel(rootLayout);
        root.add(loginPanel, "LOGIN");
        root.add(mainLayout, "MAIN");
        setContentPane(root);
    }

    public void showLoginView() {
        ((CardLayout) getContentPane().getLayout()).show(getContentPane(), "LOGIN");
        sidebar.setVisible(false);
    }

    public void showMainView() {
        ((CardLayout) getContentPane().getLayout()).show(getContentPane(), "MAIN");
        sidebar.setVisible(true);
        NavigationManager.getInstance().navigateTo(NavigationManager.DASHBOARD);
    }

    public Sidebar getSidebar() { return sidebar; }
}
```

---

## 9. Paleta de colores y tema FlatLaf

La app usa una paleta **morada oscura profesional**. Todas las constantes de color están en una única clase `Theme.java` para que sean fáciles de cambiar.

### `Theme.java`

```java
package com.pakag.admin.gui;

import javax.swing.*;
import java.awt.*;

public final class Theme {
    private Theme() {}

    // ── Paleta principal ─────────────────────────────────────────────────────
    public static final Color BG_DARKEST      = new Color(0x0E0B16);  // Fondo más oscuro
    public static final Color BG_DARK         = new Color(0x1A1626);  // Fondo principal de la app
    public static final Color BG_SURFACE      = new Color(0x231D35);  // Cards, paneles elevados
    public static final Color BG_ELEVATED     = new Color(0x2D2545);  // Elementos sobre surface

    public static final Color ACCENT_PRIMARY  = new Color(0x7C3AED);  // Morado principal (acciones)
    public static final Color ACCENT_HOVER    = new Color(0x6D28D9);  // Morado hover
    public static final Color ACCENT_LIGHT    = new Color(0xA78BFA);  // Morado claro (textos, iconos)
    public static final Color ACCENT_SUBTLE   = new Color(0x3D2960);  // Morado muy suave (backgrounds)

    public static final Color TEXT_PRIMARY    = new Color(0xF5F3FF);  // Texto principal
    public static final Color TEXT_SECONDARY  = new Color(0xA89DC4);  // Texto secundario / labels
    public static final Color TEXT_DISABLED   = new Color(0x6B5B8A);  // Texto deshabilitado

    public static final Color BORDER_NORMAL   = new Color(0x3D3358);  // Bordes normales
    public static final Color BORDER_FOCUS    = new Color(0x7C3AED);  // Borde al hacer focus

    // ── Estados de paquetes ───────────────────────────────────────────────────
    public static final Color STATUS_PENDING    = new Color(0xF59E0B);  // Amarillo
    public static final Color STATUS_ASSIGNED   = new Color(0x3B82F6);  // Azul
    public static final Color STATUS_IN_TRANSIT = new Color(0x8B5CF6);  // Morado
    public static final Color STATUS_DELIVERED  = new Color(0x10B981);  // Verde
    public static final Color STATUS_FAILED     = new Color(0xEF4444);  // Rojo

    // Backgrounds de los badges (versión transparente del color del estado)
    public static final Color STATUS_PENDING_BG    = new Color(0xF59E0B, true).darker();
    public static final Color STATUS_ASSIGNED_BG   = new Color(0x1D3D6B);
    public static final Color STATUS_IN_TRANSIT_BG = new Color(0x3B2567);
    public static final Color STATUS_DELIVERED_BG  = new Color(0x0D3D2A);
    public static final Color STATUS_FAILED_BG     = new Color(0x4D1515);

    // ── Fuentes ───────────────────────────────────────────────────────────────
    public static final Font FONT_TITLE    = new Font("Segoe UI", Font.BOLD,  20);
    public static final Font FONT_SUBTITLE = new Font("Segoe UI", Font.BOLD,  14);
    public static final Font FONT_BODY     = new Font("Segoe UI", Font.PLAIN, 13);
    public static final Font FONT_SMALL    = new Font("Segoe UI", Font.PLAIN, 11);
    public static final Font FONT_MONO     = new Font("Consolas", Font.PLAIN, 12);

    // ── Dimensiones ───────────────────────────────────────────────────────────
    public static final int SIDEBAR_WIDTH     = 220;
    public static final int HEADER_HEIGHT     = 56;
    public static final int ROW_HEIGHT        = 40;
    public static final int PADDING           = 16;
    public static final int BORDER_RADIUS     = 8;

    // ── Aplicar a FlatLaf ─────────────────────────────────────────────────────
    public static void apply() {
        UIManager.put("Panel.background",             BG_DARK);
        UIManager.put("Table.background",             BG_SURFACE);
        UIManager.put("Table.alternateRowColor",      BG_ELEVATED);
        UIManager.put("Table.foreground",             TEXT_PRIMARY);
        UIManager.put("Table.selectionBackground",    ACCENT_SUBTLE);
        UIManager.put("Table.selectionForeground",    TEXT_PRIMARY);
        UIManager.put("Table.gridColor",              BORDER_NORMAL);
        UIManager.put("TableHeader.background",       BG_ELEVATED);
        UIManager.put("TableHeader.foreground",       ACCENT_LIGHT);

        UIManager.put("Button.background",            ACCENT_PRIMARY);
        UIManager.put("Button.foreground",            Color.WHITE);
        UIManager.put("Button.hoverBackground",       ACCENT_HOVER);
        UIManager.put("Button.arc",                   BORDER_RADIUS);

        UIManager.put("TextField.background",         BG_ELEVATED);
        UIManager.put("TextField.foreground",         TEXT_PRIMARY);
        UIManager.put("TextField.caretForeground",    ACCENT_LIGHT);
        UIManager.put("TextField.border",             BorderFactory.createLineBorder(BORDER_NORMAL));

        UIManager.put("ComboBox.background",          BG_ELEVATED);
        UIManager.put("ComboBox.foreground",          TEXT_PRIMARY);

        UIManager.put("ScrollBar.thumb",              ACCENT_SUBTLE);
        UIManager.put("ScrollBar.track",              BG_DARK);
        UIManager.put("ScrollBar.width",              8);

        UIManager.put("Label.foreground",             TEXT_PRIMARY);
        UIManager.put("Label.disabledForeground",     TEXT_DISABLED);

        UIManager.put("Separator.foreground",         BORDER_NORMAL);

        UIManager.put("ToolTip.background",           BG_ELEVATED);
        UIManager.put("ToolTip.foreground",           TEXT_PRIMARY);
    }

    // ── Helper: obtener color del estado ──────────────────────────────────────
    public static Color getStatusColor(String status) {
        return switch (status.toLowerCase()) {
            case "pending"    -> STATUS_PENDING;
            case "assigned"   -> STATUS_ASSIGNED;
            case "in_transit" -> STATUS_IN_TRANSIT;
            case "delivered"  -> STATUS_DELIVERED;
            case "failed"     -> STATUS_FAILED;
            default           -> TEXT_SECONDARY;
        };
    }

    public static Color getStatusBgColor(String status) {
        return switch (status.toLowerCase()) {
            case "pending"    -> STATUS_PENDING_BG;
            case "assigned"   -> STATUS_ASSIGNED_BG;
            case "in_transit" -> STATUS_IN_TRANSIT_BG;
            case "delivered"  -> STATUS_DELIVERED_BG;
            case "failed"     -> STATUS_FAILED_BG;
            default           -> BG_ELEVATED;
        };
    }
}
```

---

## 10. Funcionalidades completas de la GUI

Este es el **inventario completo** de todo lo que la app Java de administración debe hacer. Úsalo como checklist durante el desarrollo.

---

### 🔐 Autenticación

- [ ] **Pantalla de login** con campo email y campo password (con toggle mostrar/ocultar).
- [ ] Botón "Entrar" que llama a `POST /auth/login`.
- [ ] Mostrar mensaje de error bajo los campos si las credenciales son incorrectas.
- [ ] Mostrar mensaje especial si la cuenta está desactivada.
- [ ] Al login exitoso: guardar access token en `SessionManager`, guardar refresh token en disco con `TokenStorage`.
- [ ] **Auto-login al arrancar**: intentar renovar sesión desde el refresh token guardado. Si funciona, ir directamente al dashboard sin mostrar el login.
- [ ] **`TwoFactorPanel` preparado**: si el servidor responde `requires_2fa: true`, mostrar este panel antes de ir al dashboard (implementación futura, estructura ya creada).
- [ ] **Logout**: botón en el header que llama a `POST /auth/logout`, limpia sesión local y vuelve al login.
- [ ] **Renovación automática de token**: el `ApiClient` lo hace transparente en cada petición. Si el refresh también falla, volver al login con mensaje "Sesión expirada".

---

### 🏠 Dashboard

- [ ] Se carga al entrar a la app (primera vista tras login).
- [ ] Llama a `GET /packages/getDailySummary` al cargar.
- [ ] Muestra **5 tarjetas** con los contadores del día:
  - 🟡 Pendientes (`pending`)
  - 🔵 Asignados (`assigned`)
  - 🟣 En tránsito (`in_transit`)
  - 🟢 Entregados (`delivered`)
  - 🔴 Fallidos (`failed`)
- [ ] Cada tarjeta tiene el nombre del estado, el número grande y el color del estado.
- [ ] Total de paquetes del día visible.
- [ ] Botón "Actualizar" o auto-refresh cada X minutos.
- [ ] Al hacer clic en una tarjeta, navegar a **Paquetes** con ese filtro de estado pre-aplicado.

---

### 📦 Paquetes

#### Vista principal (tabla)

- [ ] Tabla paginada con columnas: ID, Código de seguimiento, Destinatario, Ciudad, Estado (badge), Repartidor, Fecha creación.
- [ ] **Barra de filtros**: combo de estado, combo de repartidor, campo de ciudad, botón "Aplicar filtros", botón "Limpiar".
- [ ] **Paginación**: botones Anterior/Siguiente, indicador "Página X de Y", selector de límite por página (10/20/50).
- [ ] Los badges de estado deben ser componentes coloreados (no texto plano) — usar `StatusBadge` component.
- [ ] Selección de fila al hacer clic.
- [ ] **Botones de acción**: Nuevo paquete, Editar (activo si hay fila seleccionada), Eliminar (activo si hay fila seleccionada), Ver historial.
- [ ] Confirmar antes de eliminar (usar `ConfirmDialog`).
- [ ] Mensaje de error si la eliminación falla porque no está en `pending`.
- [ ] Doble clic en fila → abrir `PackageDetailDialog`.

#### Formulario crear/editar (`PackageFormDialog`)

- [ ] Campo: Nombre del destinatario (texto, obligatorio).
- [ ] Campo: Email del destinatario (texto, obligatorio, validar formato email en cliente antes de enviar).
- [ ] Campo: Peso en kg (numérico, obligatorio).
- [ ] Campo: Descripción (textarea, opcional).
- [ ] Campo: Repartidor asignado (combo cargado con `GET /users/list?role=distributor&is_active=true`, opción "Sin asignar").
- [ ] Campo: Estado inicial (combo: `pending`, `assigned`).
- [ ] Campo: Fecha de entrega estimada (date picker o campo texto formato YYYY-MM-DD).
- [ ] Sección Dirección: Calle, Ciudad, Código postal.
- [ ] En modo edición, precargar todos los campos con los datos actuales.
- [ ] Validaciones en cliente antes de llamar a la API (campos obligatorios, formato email, peso > 0).
- [ ] Mostrar spinner mientras se guarda.
- [ ] Mostrar mensaje de error si la API responde con error.
- [ ] Al guardar con éxito, cerrar el modal y recargar la tabla.

#### Detalle + historial (`PackageDetailDialog`)

- [ ] Mostrar todos los campos del paquete (incluyendo tracking code y dirección completa).
- [ ] Sección "Historial de estados": tabla con columnas Fecha, Estado anterior, Estado nuevo, Realizado por.
- [ ] Carga el historial con `GET /logs/listByPackage?packageId=X`.
- [ ] Botón "Cerrar".

---

### 👥 Repartidores

#### Vista principal (tabla)

- [ ] Tabla con columnas: ID, Nombre, Email, Rol, Estado (Activo/Inactivo badge), Fecha creación.
- [ ] **Filtros**: por rol (admin/distributor), por estado (activo/inactivo).
- [ ] **Paginación**.
- [ ] **Botones**: Nuevo usuario, Editar (fila seleccionada), Activar/Desactivar (toggle).
- [ ] Los usuarios inactivos deben verse visualmente diferenciados (texto en gris/apagado).

#### Formulario crear/editar (`UserFormDialog`)

- [ ] Campo: Nombre completo.
- [ ] Campo: Email (único).
- [ ] Campo: Rol (combo: admin / distributor).
- [ ] En modo edición: campo `is_active` (checkbox Activo/Inactivo).
- [ ] Al **crear**: se llama a `POST /users/create`. El usuario se crea inactivo y recibe email de activación automáticamente. Mostrar mensaje informativo al admin: "Se ha enviado un email de activación al usuario."
- [ ] Validaciones en cliente.
- [ ] Mostrar error 409 si el email ya existe.

---

### 🗺️ Rutas

#### Vista principal

- [ ] **Selector de repartidor + fecha** para buscar la ruta existente.
- [ ] Al buscar, llama a `GET /routes/getByUserAndDate`.
- [ ] Muestra la ruta con sus paradas en orden: número de parada, hora estimada, destinatario, dirección, estado actual del paquete.
- [ ] Si no hay ruta para esa fecha, mostrar botón "Crear ruta".
- [ ] Botón "Reordenar paradas" que abre `RouteDetailDialog`.
- [ ] Botón "Cambiar estado de ruta" para avanzar el estado (`planned → in_progress → completed`).

#### Crear ruta (`CreateRouteDialog`)

- [ ] Combo para seleccionar repartidor (cargado con `GET /users/list?role=distributor&is_active=true`).
- [ ] Date picker para la fecha (mínimo mañana — validar en cliente).
- [ ] Lista de paquetes disponibles para ese repartidor: cargados con `GET /packages/list?assigned_to=X&status=assigned`.
- [ ] El usuario selecciona los paquetes a incluir en la ruta (checkboxes o lista multiselección).
- [ ] Al confirmar, llama a `POST /routes/create`.
- [ ] Mostrar el resultado con el resumen (`meta.totalStops`, `meta.totalDistanceKm`, `meta.totalDurationMin`).

#### Reordenar paradas (`RouteDetailDialog`)

- [ ] Lista de paradas en orden actual con botones Subir / Bajar (o drag & drop).
- [ ] Botón "Guardar orden" que llama a `PATCH /stops/reorder` con el orden nuevo.
- [ ] **Importante**: enviar TODAS las paradas en el array, no solo las movidas.

---

### 📋 Historial Global

- [ ] Tabla con columnas: ID log, ID paquete, Estado anterior, Estado nuevo, Realizado por, Fecha y hora.
- [ ] **Filtros**: por ID de paquete, por repartidor (combo), por fecha desde, por fecha hasta.
- [ ] **Paginación**.
- [ ] Carga con `GET /logs/listAll` y los query params de filtro.
- [ ] Al hacer clic en un log, opcionalmente mostrar el detalle del paquete relacionado.

---

### 🔧 Componentes comunes reutilizables

| Componente        | Descripción                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `StatusBadge`     | Pastilla coloreada (fondo + texto) para mostrar el estado de un paquete. Recibe un `String status` y usa `Theme.getStatusColor()`. |
| `PaginationPanel` | Barra de paginación: botones Anterior/Siguiente, label "Página X de Y", selector de `limit`.                                       |
| `LoadingOverlay`  | Overlay semitransparente con `JProgressBar` indeterminado. Se muestra encima del panel mientras carga.                             |
| `ConfirmDialog`   | `JDialog` modal con mensaje configurable y botones "Confirmar" / "Cancelar". Devuelve `boolean`.                                   |
| `ErrorDialog`     | `JOptionPane.showMessageDialog` wrapeado con el estilo de la app.                                                                  |
| `FilterBar`       | Panel horizontal con los combos/campos de filtro y botones Aplicar/Limpiar.                                                        |
| `RoundedButton`   | `JButton` con `paintComponent` override para bordes redondeados y color de fondo morado.                                           |

---

## 11. Buenas prácticas de Java

### Principios generales

- **Una clase = una responsabilidad.** Si una clase hace más de una cosa, divídela.
- **Inmutabilidad preferida**: usa `final` en campos que no cambien. Los DTOs de request son inmutables. Los DTOs de respuesta pueden tener solo getters.
- **No uses null como valor por defecto**: usa `Optional<T>` cuando algo puede no existir.
- **Constantes en clases dedicadas**: nunca strings mágicos ni números mágicos dispersos. Todo en `AppConfig` o `Theme`.
- **Logs en lugar de `System.out.println`**: usa `java.util.logging.Logger` o, mejor, configura SLF4J + Logback.

### Convenciones de nomenclatura

| Elemento         | Convención               | Ejemplo                         |
| ---------------- | ------------------------ | ------------------------------- |
| Clases           | PascalCase               | `PackageService`, `LoginPanel`  |
| Métodos          | camelCase, verbo primero | `createPackage()`, `loadData()` |
| Variables        | camelCase                | `currentUser`, `pageNumber`     |
| Constantes       | UPPER_SNAKE_CASE         | `BASE_URL`, `ACCENT_PRIMARY`    |
| Paquetes         | lowercase, singular      | `com.pakag.admin.service`       |
| DTOs             | sufijo `Dto`             | `PackageDto`, `LoginRequestDto` |
| Panels           | sufijo `Panel`           | `DashboardPanel`                |
| Dialogs          | sufijo `Dialog`          | `PackageFormDialog`             |
| Modelos de tabla | sufijo `TableModel`      | `PackageTableModel`             |

### Validaciones en cliente (antes de llamar a la API)

Siempre valida en el formulario antes de hacer la llamada. Ahorras un round-trip y das feedback inmediato:

```java
private boolean validateForm() {
    if (nameField.getText().isBlank()) {
        showFieldError(nameField, "El nombre es obligatorio");
        return false;
    }
    if (!emailField.getText().matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
        showFieldError(emailField, "Email inválido");
        return false;
    }
    try {
        double weight = Double.parseDouble(weightField.getText());
        if (weight <= 0) throw new NumberFormatException();
    } catch (NumberFormatException e) {
        showFieldError(weightField, "El peso debe ser un número positivo");
        return false;
    }
    return true;
}
```

### Singletons correctos

Usa el patrón **Initialization-on-demand holder** (thread-safe sin `synchronized`):

```java
public class PackageService {
    private PackageService() {}

    private static class Holder {
        static final PackageService INSTANCE = new PackageService();
    }

    public static PackageService getInstance() { return Holder.INSTANCE; }
}
```

### Cierre de recursos

Usa try-with-resources para cualquier recurso que implemente `AutoCloseable`:

```java
// Bien
try (InputStream is = connection.getInputStream()) {
    // usar is
}

// Mal
InputStream is = connection.getInputStream();
try {
    // usar is
} finally {
    is.close(); // puede no ejecutarse si hay excepción
}
```

---

## 12. Manejo de errores y excepciones

### Jerarquía de excepciones propias

```
Exception
└── RuntimeException
    └── ApiException              ← Error de la API con statusCode + mensaje
        ├── SessionExpiredException  ← 401 que no se pudo renovar
        ├── UnauthorizedException    ← 403 (sin permisos)
        └── NetworkException         ← Timeout, sin conexión
```

```java
package com.pakag.admin.exception;

public class ApiException extends RuntimeException {
    private final int    statusCode;
    private final String apiMessage;

    public ApiException(int statusCode, String apiMessage) {
        super(apiMessage);
        this.statusCode = statusCode;
        this.apiMessage = apiMessage;
    }

    public int    getStatusCode() { return statusCode; }
    public String getApiMessage() { return apiMessage; }
}
```

### Patrón de manejo en la GUI

En cada `SwingWorker`, captura las excepciones y muéstralas al usuario de forma apropiada:

```java
new SwingWorker<PackagesListResponseDto, Void>() {
    @Override
    protected PackagesListResponseDto doInBackground() throws Exception {
        return PackageService.getInstance().list(selectedStatus, null, null, page, limit);
    }

    @Override
    protected void done() {
        loadingOverlay.hide();
        try {
            PackagesListResponseDto result = get();
            tableModel.setData(result.getPackages());
            paginationPanel.update(result.getTotal(), result.getPage(), result.getLimit());
        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            if (cause instanceof SessionExpiredException) {
                // Sesión caducada: volver al login
                NavigationManager.getInstance().navigateTo(NavigationManager.LOGIN);
            } else if (cause instanceof ApiException apiEx) {
                ErrorDialog.show(PackagesPanel.this,
                    "Error al cargar paquetes",
                    apiEx.getApiMessage() + " (HTTP " + apiEx.getStatusCode() + ")");
            } else {
                ErrorDialog.show(PackagesPanel.this,
                    "Error de conexión",
                    "No se pudo conectar con el servidor. Comprueba tu conexión.");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}.execute();
```

---

## 13. Concurrencia en Swing

### Regla de oro

**Nunca hagas IO (HTTP, disco) en el EDT (Event Dispatch Thread)**. El EDT es el hilo que dibuja la UI. Si lo bloqueas, la ventana se congela.

| Qué hacer                    | Dónde hacerlo                                         |
| ---------------------------- | ----------------------------------------------------- |
| Llamadas HTTP a la API       | `SwingWorker.doInBackground()`                        |
| Actualizar componentes Swing | `SwingWorker.done()` o `SwingUtilities.invokeLater()` |
| Animaciones/timers           | `javax.swing.Timer`                                   |

### Patrón completo con loading overlay

```java
private void loadPackages() {
    loadingOverlay.show();         // Mostrar spinner (en EDT, está bien)
    refreshButton.setEnabled(false);

    new SwingWorker<PackagesListResponseDto, Void>() {
        @Override
        protected PackagesListResponseDto doInBackground() throws Exception {
            // ← AQUÍ va la llamada HTTP (hilo separado)
            return PackageService.getInstance().list(...);
        }

        @Override
        protected void done() {
            // ← AQUÍ actualizas la UI (vuelve al EDT)
            loadingOverlay.hide();
            refreshButton.setEnabled(true);
            try {
                PackagesListResponseDto result = get();
                tableModel.setData(result.getPackages());
            } catch (Exception e) {
                handleException(e);
            }
        }
    }.execute();
}
```

---

## 14. Checklist antes de entregar

### Funcionalidad

- [ ] Login y logout funcionan correctamente.
- [ ] Auto-login al arrancar si hay refresh token guardado.
- [ ] El access token se renueva automáticamente sin que el usuario lo note.
- [ ] Si la sesión expira definitivamente, vuelve al login con mensaje.
- [ ] Dashboard muestra el resumen diario real de la API.
- [ ] CRUD completo de paquetes funciona (crear, ver, editar, eliminar).
- [ ] Los filtros y la paginación de paquetes funcionan.
- [ ] El historial de un paquete se carga correctamente.
- [ ] CRUD de usuarios/repartidores funciona (crear, editar, activar/desactivar).
- [ ] Creación de rutas funciona con los paquetes asignados al repartidor.
- [ ] Vista de ruta existente carga correctamente.
- [ ] Reordenar paradas funciona y persiste.
- [ ] Historial global carga con filtros y paginación.

### Calidad

- [ ] No hay llamadas HTTP en el EDT (ninguna pantalla se congela).
- [ ] Todos los errores de API muestran mensajes comprensibles al usuario.
- [ ] Todos los formularios validan en cliente antes de llamar a la API.
- [ ] No hay strings mágicos: colores en `Theme`, URLs en `AppConfig`.
- [ ] No hay lógica de negocio en las clases de GUI.
- [ ] No hay referencias a `HttpClient` o `ApiClient` desde clases de `gui/`.
- [ ] El refresh token se guarda y se carga correctamente de disco.

### Seguridad

- [ ] El access token nunca se escribe en disco (solo en memoria).
- [ ] El refresh token se guarda en `Preferences` (registro de Windows), no en un fichero de texto plano.
- [ ] El `CookieStore` está preparado para leer CSRF tokens cuando el backend los implemente.
- [ ] `SecurityContext` tiene los flags de 2FA preparados para activación futura.
- [ ] No hay credenciales ni API keys hardcodeadas en el código.

### UI

- [ ] El tema morado oscuro está aplicado consistentemente en toda la app.
- [ ] Los badges de estado usan `Theme.getStatusColor()` / `Theme.getStatusBgColor()`.
- [ ] Hay un `LoadingOverlay` durante todas las cargas de datos.
- [ ] Los diálogos de confirmación se usan antes de acciones destructivas (eliminar).
- [ ] La app tiene un tamaño mínimo de ventana (`setMinimumSize`) y es responsive dentro de ese límite.
- [ ] El `Sidebar` marca visualmente el ítem activo al navegar.
