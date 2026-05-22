# 📦 Delivery Appointment System

[![Django](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django_REST_Framework-3.17-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A production-ready fullstack web application for managing delivery appointments in a textile retail company. Built with Django REST Framework, Next.js App Router, PostgreSQL, and Docker.

> 👤 **Author:** [David Pedroza Sánchez](https://www.linkedin.com/in/david-pedroza-sanchez-9525b0346)

---

## ✨ Features

### 📋 Appointment Management
- Full CRUD with business rule validations
- Status state machine: Scheduled → In Progress → Delivered / Cancelled
- Invalid transitions rejected at the API level
- Soft cancellation — no physical deletion
- Filters by status, supplier, product line, and date range
- Server-side pagination

### 📊 Real-Time Report
- Average delivery time grouped by product line
- Powered by raw SQL for maximum query efficiency
- Bar chart visualization with Recharts
- Configurable date range filter

### 🔐 Authentication
- JWT with access + refresh tokens via `djangorestframework-simplejwt`
- Token blacklist on logout
- All API routes protected by authentication guards
- Frontend route protection via layout-level session check

### 🎨 Frontend
- Mobile-first responsive design
- Clean, minimal Apple-inspired UI
- Loading states and visible error handling on all screens
- Dashboard with live delivery overview and progress bars

---

## 🚀 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Backend | Django + Django REST Framework | 6.0 / 3.17 |
| Language | Python | 3.13 |
| Authentication | djangorestframework-simplejwt | 5.5 |
| API Docs | drf-spectacular (Swagger/OpenAPI) | 0.29 |
| Database | PostgreSQL | 16 |
| ORM | Django ORM + raw SQL for reports | — |
| Frontend | Next.js App Router | 16 |
| UI Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| Charts | Recharts | 2 |
| Containers | Docker + Docker Compose | — |
| CI/CD | GitHub Actions | — |
| Linting | Flake8 (backend) + ESLint (frontend) | — |

---

## 🏗️ Architecture
┌─────────────────────────────────────────┐
│         Browser / Mobile Client         │
└────────────────┬────────────────────────┘
│ HTTP
┌────────────────▼────────────────────────┐
│         Next.js Frontend :3000          │
│                                         │
│  app/                                   │
│  ├── (dashboard)/   ← Protected routes  │
│  │   ├── dashboard/                     │
│  │   ├── appointments/                  │
│  │   └── reports/                       │
│  └── login/         ← Public route      │
│                                         │
│  features/          ← Feature-based     │
│  ├── auth/          ← Auth domain       │
│  ├── appointments/  ← Appt domain       │
│  └── reports/       ← Reports domain    │
└────────────────┬────────────────────────┘
│ REST API / JSON
┌────────────────▼────────────────────────┐
│         Django REST Framework :8000     │
│                                         │
│  config/            ← Settings, URLs    │
│  apps/                                  │
│  ├── authentication/ ← JWT, login       │
│  └── appointments/   ← CRUD, reports    │
│      ├── models.py   ← Appointment ORM  │
│      ├── serializers.py ← Validation    │
│      ├── views.py    ← ViewSet          │
│      ├── filters.py  ← Query filters    │
│      └── reports.py  ← Raw SQL          │
└────────────────┬────────────────────────┘
│ psycopg2
┌────────────────▼────────────────────────┐
│            PostgreSQL :5432             │
│                                         │
│  appointments_appointment               │
│  auth_user                              │
│  token_blacklist_*                      │
└─────────────────────────────────────────┘

---

## 🗄️ Entity Relationship Diagram
┌──────────────────────────────────────────┐
│              auth_user                   │
├──────────────────────────────────────────┤
│ id            INTEGER (PK)               │
│ username      VARCHAR(150)               │
│ email         VARCHAR(254)               │
│ password      VARCHAR(128)               │
│ is_staff      BOOLEAN                    │
│ is_active     BOOLEAN                    │
│ date_joined   TIMESTAMP WITH TIME ZONE   │
└──────────────────┬───────────────────────┘
│ FK (PROTECT)
│ created_by
┌──────────────────▼───────────────────────┐
│          appointments_appointment         │
├──────────────────────────────────────────┤
│ id            UUID (PK)                  │
│ scheduled_at  TIMESTAMP WITH TIME ZONE   │  ← INDEX
│ supplier      VARCHAR(1)                 │  ← INDEX  [A, B, C]
│ product_line  VARCHAR(20)                │  ← INDEX  [Camisetas, Pantalones,
│ status        VARCHAR(20)                │  ← INDEX   Zapatos, Accesorios]
│ delivered_at  TIMESTAMP (nullable)       │  status: [Programada, En proceso,
│ observations  TEXT                       │           Entregada, Cancelada]
│ created_by_id INTEGER (FK)               │  ← INDEX
│ created_at    TIMESTAMP WITH TIME ZONE   │
│ updated_at    TIMESTAMP WITH TIME ZONE   │
└──────────────────────────────────────────┘

---

## 📂 Project Structure
appointment-system/
├── backend/
│   ├── apps/
│   │   ├── authentication/
│   │   │   ├── serializers.py   # Login, User serializers
│   │   │   ├── views.py         # LoginView, LogoutView, MeView
│   │   │   └── urls.py          # /api/auth/*
│   │   └── appointments/
│   │       ├── models.py        # Appointment model + state machine
│   │       ├── serializers.py   # Validation + business rules
│   │       ├── views.py         # AppointmentViewSet + report/dashboard
│   │       ├── filters.py       # Status, supplier, product_line, date
│   │       ├── reports.py       # Raw SQL report query
│   │       ├── urls.py          # Router registration
│   │       └── tests/
│   │           └── test_models.py  # 6 unit tests
│   ├── config/
│   │   ├── settings.py          # Django settings
│   │   └── urls.py              # Root URL conf + Swagger
│   ├── fixtures/
│   │   └── seed.py              # 3 users + 20 appointments
│   ├── conftest.py              # pytest fixtures
│   ├── pytest.ini               # pytest config
│   ├── .flake8                  # Flake8 config
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   └── src/
│       ├── app/                 # Next.js App Router (routing only)
│       │   ├── (dashboard)/     # Protected route group
│       │   │   ├── layout.tsx   # Nav, auth guard, logout
│       │   │   ├── dashboard/
│       │   │   ├── appointments/
│       │   │   └── reports/
│       │   └── login/
│       ├── features/            # Feature-based domain logic
│       │   ├── auth/            # Login API, useAuth hook, LoginForm
│       │   ├── appointments/    # Appointments API, hooks, components
│       │   └── reports/         # Report hook
│       └── shared/              # Types, constants, reusable UI
│
├── .github/
│   └── workflows/
│       └── ci.yml               # Flake8 + ESLint pipeline
├── docker-compose.yml
├── .env.example
└── README.md

---

## ⚡ Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) running
- Git

### Launch with one command

```bash
git clone https://github.com/DPS1031/appointment-system.git
cd appointment-system
cp .env.example .env
docker compose up --build
```

Docker Compose starts services in the correct dependency order:

1. **PostgreSQL** — waits until healthy (healthcheck)
2. **Django backend** — runs migrations, seeds data, starts server
3. **Next.js frontend** — installs deps, starts dev server

| Service | URL |
|---|---|
| 🎨 Frontend | http://localhost:3000 |
| 📡 Backend API | http://localhost:8000 |
| 📖 Swagger UI | http://localhost:8000/api/docs/ |
| 🔧 Django Admin | http://localhost:8000/admin/ |

---

## 🔑 Test Credentials

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Superuser |
| `warehouse_manager` | `manager123` | Staff |
| `logistics_coordinator` | `coordinator123` | Staff |

> ⚠️ These credentials are for development only. Change them before any public deployment.

---

## 🔧 Local Development (Without Docker)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt

# Set POSTGRES_HOST=localhost in your .env
python manage.py migrate
python manage.py shell < fixtures/seed.py
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```env
# PostgreSQL
POSTGRES_DB=appointment_db
POSTGRES_USER=appointment_user
POSTGRES_PASSWORD=appointment_pass
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django
DJANGO_SECRET_KEY=your-secret-key-change-this-in-production
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# JWT
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

> ⚠️ Never commit your real `.env` file. It is listed in `.gitignore`.

---

## 📡 API Reference

Full interactive documentation available at **http://localhost:8000/api/docs/**

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login/` | Public | Login — returns access + refresh tokens |
| `POST` | `/api/auth/logout/` | Required | Blacklist refresh token |
| `POST` | `/api/auth/refresh/` | Public | Rotate access token |
| `GET` | `/api/auth/me/` | Required | Authenticated user data |

### Appointments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/appointments/` | Required | List with filters + pagination |
| `POST` | `/api/appointments/` | Required | Create appointment |
| `GET` | `/api/appointments/{id}/` | Required | Retrieve single appointment |
| `PATCH` | `/api/appointments/{id}/` | Required | Update appointment |
| `DELETE` | `/api/appointments/{id}/` | Required | Cancel appointment (no physical delete) |
| `GET` | `/api/appointments/dashboard/` | Required | Status counts + today's total |
| `GET` | `/api/appointments/report/` | Required | Raw SQL report by product line |

### Query Parameters — List endpoint

| Parameter | Type | Example |
|---|---|---|
| `status` | string | `Programada` |
| `supplier` | string | `A` |
| `product_line` | string | `Camisetas` |
| `scheduled_at_after` | datetime | `2026-01-01T00:00:00` |
| `scheduled_at_before` | datetime | `2026-12-31T23:59:59` |
| `page` | integer | `2` |

---

## 🧪 Running Tests

```bash
docker compose exec backend pytest apps/ -v
```

Expected output:
PASSED apps/appointments/tests/test_models.py::test_appointment_cannot_be_created_with_past_date
PASSED apps/appointments/tests/test_models.py::test_delivered_status_requires_delivered_at
PASSED apps/appointments/tests/test_models.py::test_invalid_status_transition_delivered_to_scheduled
PASSED apps/appointments/tests/test_models.py::test_unauthenticated_request_returns_401
PASSED apps/appointments/tests/test_models.py::test_report_endpoint_returns_expected_fields
PASSED apps/appointments/tests/test_models.py::test_cancel_transition_from_scheduled
6 passed

### Test coverage

| Test | What it validates |
|---|---|
| `test_appointment_cannot_be_created_with_past_date` | `scheduled_at` must be in the future |
| `test_delivered_status_requires_delivered_at` | `delivered_at` required when status is Delivered |
| `test_invalid_status_transition_delivered_to_scheduled` | Terminal states reject all transitions |
| `test_unauthenticated_request_returns_401` | Auth middleware blocks unauthenticated requests |
| `test_report_endpoint_returns_expected_fields` | Report returns `product_line`, `total_deliveries`, `avg_hours` |
| `test_cancel_transition_from_scheduled` | Valid and invalid transitions from Scheduled |

---

## 🔄 CI/CD Pipeline

Every push to `main` or `develop` triggers two parallel jobs on GitHub Actions:

```yaml
Backend Lint (Flake8)    ← max-line-length 88, excludes venv/migrations
Frontend Lint (ESLint)   ← Next.js ESLint config
```

Both jobs must pass before merging to `main`.

---

## 🔐 Technical Decisions

### Why JWT over Session Auth?
JWT was chosen because the architecture fully decouples the frontend (Next.js on port 3000) from the backend (Django on port 8000). Sessions require cookie sharing across origins, which introduces CORS complexity. JWT tokens travel in the `Authorization` header, making cross-origin requests straightforward. `simplejwt` provides refresh token rotation and blacklisting for logout support.

### Why Next.js App Router over Angular?
The technical spec explicitly lists Next.js as the preferred framework. App Router provides native route groups (the `(dashboard)` convention), built-in TypeScript support, and first-class Tailwind CSS integration — all reducing configuration overhead. Route protection is handled at the layout level, keeping pages clean.

### Why Feature-based architecture?
The frontend is organized by domain (`features/auth`, `features/appointments`, `features/reports`) rather than by type (`components`, `hooks`, `services`). This keeps all code related to a feature co-located, making it easy to understand, test, and scale independently. Pages in `app/` are intentionally thin — they import from features, never the reverse.

### Why raw SQL for the report?
The technical spec explicitly requires it. Beyond compliance, the report query uses `EXTRACT(EPOCH FROM ...)` and `AVG()` with grouping — operations that are more explicit and controllable in raw SQL than through the Django ORM. The query is isolated in `reports.py`, keeping the boundary between ORM and raw SQL clear.

### Why `on_delete=PROTECT` on created_by?
Deleting a user who has appointments would orphan historical delivery records. `PROTECT` raises a database-level error, forcing a conscious decision before any user deletion. This preserves audit integrity, which is critical in a logistics context.

### Why indexes on status, supplier, product_line, scheduled_at?
These are the four fields used in every filter query. Without indexes, each filter performs a full table scan. With indexes, PostgreSQL builds a B-tree structure per column allowing O(log n) lookups. The tradeoff is slightly more disk space and slower inserts — acceptable given that reads vastly outnumber writes in this domain.

---

## 📋 Assumptions

- Timezone is set to `America/Bogota` (UTC-5) in Django settings
- `scheduled_at` must always be in the future at creation time
- Status transitions are one-directional and terminal states (`Entregada`, `Cancelada`) cannot be reversed
- The seed script is idempotent — running it multiple times clears and repopulates data
- `delivered_at` is only required when transitioning to `Entregada` status
- The report groups only appointments with status `Entregada`

---

## 🤝 Contributing

Issues and pull requests are welcome. Please follow the existing code style — Flake8 for Python, ESLint for TypeScript.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://www.linkedin.com/in/david-pedroza-sanchez-9525b0346">David Pedroza Sánchez</a>
</p>
