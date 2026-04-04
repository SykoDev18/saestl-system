# SAESTL — Sistema Administrativo de la Sociedad de Alumnos (ESTl, UAEH)

Sistema de gestión financiera y administrativa para la Sociedad de Alumnos de la Escuela Superior de Tlahuelilpan, UAEH. Permite controlar transacciones, rifas, eventos, presupuestos, cuentas por pagar y generar reportes.

## Requisitos previos

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **Java JDK** | 25 | `java -version` |
| **Docker Desktop** | 4+ | `docker -v` |
| **Git** | 2+ | `git -v` |

## Estructura del proyecto

```
SAESTL2/
├── Backend/                         # Spring Boot 4 (Java 25)
│   ├── compose.yaml                 # Docker Compose — PostgreSQL
│   ├── pom.xml                      # Dependencias Maven
│   ├── mvnw / mvnw.cmd             # Maven Wrapper
│   └── src/
│       └── main/
│           ├── java/com/saestl_sistema/vm/
│           │   ├── VmApplication.java         # Entry point
│           │   ├── config/
│           │   │   ├── SecurityConfig.java    # JWT + CORS + Security
│           │   │   ├── PasswordConfig.java    # BCrypt encoder
│           │   │   └── DataInitializer.java   # Seed admin user
│           │   ├── controller/
│           │   │   └── AuthController.java    # Login / Register
│           │   ├── dto/
│           │   │   ├── LoginRequest.java
│           │   │   ├── RegisterRequest.java
│           │   │   └── AuthResponse.java
│           │   ├── entity/                    # JPA Entities
│           │   │   ├── User.java
│           │   │   ├── Categoria.java
│           │   │   ├── Transaccion.java
│           │   │   ├── Evento.java
│           │   │   ├── AsistenteEvento.java
│           │   │   ├── Rifa.java
│           │   │   ├── BoletoRifa.java
│           │   │   └── Presupuesto.java
│           │   ├── repository/                # Spring Data JPA
│           │   ├── security/
│           │   │   ├── JwtUtil.java
│           │   │   └── JwtAuthenticationFilter.java
│           │   └── service/
│           │       └── UserService.java
│           └── resources/
│               ├── application.properties           # Config general
│               ├── application-dev.properties        # H2 in-memory
│               ├── application-docker.properties     # PostgreSQL real
│               └── db/migration/                     # Flyway
│                   ├── V1__create_users_table.sql
│                   ├── V2__create_categorias_table.sql
│                   ├── V3__create_transacciones_table.sql
│                   ├── V4__create_eventos_table.sql
│                   ├── V5__create_asistentes_evento_table.sql
│                   ├── V6__create_rifas_table.sql
│                   ├── V7__create_boletos_rifa_table.sql
│                   ├── V8__create_presupuestos_table.sql
│                   └── V99__seed_data.sql
│
├── Frontend/                        # React 18 + Vite 6 + TypeScript
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── .env.production              # URL del API en producción
│   └── src/
│       ├── main.tsx                 # Entry point
│       ├── app/
│       │   ├── App.tsx              # Router provider
│       │   ├── routes.ts            # React Router 7 (Data Mode)
│       │   ├── api/
│       │   │   └── client.ts        # HTTP client (fetch + JWT)
│       │   ├── components/
│       │   │   ├── FinancialPrivacyContext.tsx  # Toggle ocultar montos
│       │   │   ├── events/
│       │   │   │   ├── CreateEventWizard.tsx
│       │   │   │   └── EventDetailModal.tsx
│       │   │   └── layout/
│       │   │       ├── AppLayout.tsx
│       │   │       ├── Header.tsx
│       │   │       ├── Sidebar.tsx
│       │   │       └── BottomNav.tsx
│       │   ├── data/
│       │   │   └── mockData.ts      # Datos mock + interfaces TypeScript
│       │   └── pages/
│       │       ├── LoginPage.tsx
│       │       ├── DashboardPage.tsx
│       │       ├── TransactionsPage.tsx
│       │       ├── RifasPage.tsx
│       │       ├── EventsPage.tsx
│       │       ├── BudgetsPage.tsx
│       │       ├── AccountsPage.tsx
│       │       ├── ReportsPage.tsx
│       │       └── SettingsPage.tsx
│       └── styles/
│           ├── index.css
│           ├── tailwind.css
│           ├── theme.css            # Nothing Design System tokens
│           └── fonts.css
│
└── README.md
```

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/SAESTL2.git
cd SAESTL2
```

### 2. Iniciar PostgreSQL con Docker

```bash
cd Backend
docker compose up postgres -d
```

Esto levanta un contenedor PostgreSQL. Por defecto se mapea al puerto **5433** del host para evitar conflictos si ya tienes PostgreSQL local.

> **Verificar que está corriendo:**
> ```bash
> docker ps
> ```
> Debes ver un contenedor `postgres:latest` en estado `Up`.

### 3. Iniciar el Backend (Spring Boot)

Desde la raíz del proyecto:

```bash
cd Backend
```

**Windows (PowerShell):**
```powershell
$env:SPRING_PROFILES_ACTIVE="docker"
.\mvnw.cmd spring-boot:run
```

**macOS / Linux:**
```bash
SPRING_PROFILES_ACTIVE=docker ./mvnw spring-boot:run
```

El backend arranca en **http://localhost:8080**. Al iniciar:
- Flyway ejecuta las migraciones SQL (V1 a V99)
- Se crea un usuario admin automáticamente

> **Modo dev sin Docker:** Si no tienes Docker, puedes usar el perfil `dev` que usa H2 in-memory:
> ```bash
> # Sin variable — el perfil dev es el default
> .\mvnw.cmd spring-boot:run
> ```

### 4. Iniciar el Frontend (Vite)

En otra terminal:

```bash
cd Frontend
npm install
npm run dev
```

El frontend arranca en **http://localhost:5173**.

### 5. Acceder al sistema

Abre http://localhost:5173 en el navegador.

**Credenciales por defecto:**

| Campo | Valor |
|---|---|
| Email | `admin@uaeh.edu.mx` |
| Contraseña | `admin123` |

## Perfiles de Spring Boot

| Perfil | Base de datos | Cuándo usar |
|---|---|---|
| `dev` (default) | H2 in-memory | Desarrollo rápido sin Docker |
| `docker` | PostgreSQL (Docker) | Desarrollo con BD real |

## API Endpoints

Base URL: `http://localhost:8080`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | No | Iniciar sesión → JWT |
| POST | `/api/auth/register` | No | Registrar usuario |
| GET | `/swagger-ui.html` | No | Documentación OpenAPI |

> Todos los demás endpoints requieren header `Authorization: Bearer <token>`.

## Stack tecnológico

### Backend
- **Spring Boot 4.0.5** — Framework web
- **Java 25** — Lenguaje
- **PostgreSQL 15** — Base de datos (Docker)
- **Flyway** — Migraciones de esquema
- **Spring Security + JWT** — Autenticación stateless
- **Spring Data JPA / Hibernate** — ORM
- **SpringDoc OpenAPI** — Documentación Swagger

### Frontend
- **React 18** — UI library
- **TypeScript** — Tipado estático
- **Vite 6** — Bundler
- **React Router 7** — Enrutamiento (Data Mode)
- **Tailwind CSS v4** — Estilos utility-first
- **Recharts** — Gráficas
- **Lucide React** — Iconos
- **Sonner** — Toasts / Notificaciones
- **Radix UI** — Componentes primitivos

### Design System
- **Nothing Design System** — Tema oscuro minimalista
- Fuentes: Doto (display), Space Grotesk (body), Space Mono (monospace)
- Color principal (guinda UAEH): `#8B1C23`

## Esquema de base de datos

```
users ──────────────┐
                    │
categorias ─────────┤
                    │
transacciones ◄─────┤ (user_id, categoria_id)
                    │
eventos ◄───────────┤ (created_by → users)
  │                 │
  └► asistentes_evento
                    │
rifas ◄─────────────┤ (created_by → users)
  │
  └► boletos_rifa
                    │
presupuestos ◄──────┘ (created_by → users)
```

**8 tablas + 1 script de seed** gestionadas por Flyway.

## Variables de entorno

### Backend (application-docker.properties)

| Variable | Default | Descripción |
|---|---|---|
| `POSTGRES_HOST` | `localhost` | Host de PostgreSQL |
| `POSTGRES_PORT` | `5433` | Puerto de PostgreSQL |
| `POSTGRES_DB` | `saestl_db` | Nombre de la BD |
| `POSTGRES_USER` | `saestl` | Usuario de BD |
| `POSTGRES_PASSWORD` | `saestl_secret` | Contraseña de BD |
| `JWT_SECRET` | (dev key) | Clave para firmar JWT (cambiar en prod) |
| `JWT_EXPIRATION` | `86400000` | Expiración del token (24h en ms) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Orígenes permitidos |

### Frontend (.env.production)

| Variable | Default | Descripción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080/api` | URL base del API |

## Comandos rápidos

```bash
# === Docker ===
docker compose up postgres -d          # Iniciar PostgreSQL
docker compose down                    # Detener todo
docker compose down -v                  # Detener + borrar volúmenes (reset BD)

# === Backend ===
cd Backend
.\mvnw.cmd spring-boot:run             # Modo dev (H2)
$env:SPRING_PROFILES_ACTIVE="docker"; .\mvnw.cmd spring-boot:run  # Modo docker (PG)
.\mvnw.cmd clean package -DskipTests   # Generar JAR

# === Frontend ===
cd Frontend
npm install                            # Instalar dependencias
npm run dev                            # Servidor de desarrollo
npm run build                          # Build de producción → dist/

# === Probar login rápido (PowerShell) ===
$body = '{"email":"admin@uaeh.edu.mx","password":"admin123"}'
Invoke-RestMethod -Uri http://localhost:8080/api/auth/login -Method Post -ContentType "application/json" -Body $body
```

## Troubleshooting

| Problema | Solución |
|---|---|
| Puerto 5432 ocupado | El compose usa 5433. Verifica con `docker ps`. |
| Backend no conecta a PG | Asegúrate de usar `SPRING_PROFILES_ACTIVE=docker`. |
| CORS error en navegador | Verifica que el frontend corre en `localhost:5173`. |
| Flyway falla | Borra volúmenes: `docker compose down -v` y reinicia. |
| `mvnw` no tiene permisos (Linux/Mac) | `chmod +x mvnw` |

## Licencia

Proyecto interno — Sociedad de Alumnos ESTl, UAEH.
