# Architecture

## Overview

**denti-code-patients-api** is the Patient Registry & Payments microservice. It manages patient demographics, payment records, and listens for `user.registered` events to auto-create patient profiles.

```
┌────────────────────────────────────────────────────────────┐
│              denti-code-patients-api                       │
│              Express 5 · JavaScript · SQLite3              │
│              (port 3001)                                   │
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  /api/patients    │  │  /api/payments   │               │
│  │                   │  │                  │               │
│  │  POST /           │  │  GET /           │               │
│  │  GET /            │  │  POST /          │               │
│  │  GET /me          │  │                  │               │
│  │  PATCH /me        │  │                  │               │
│  │  GET /:id         │  │                  │               │
│  │  PUT /:id         │  │                  │               │
│  │  DELETE /:id      │  │                  │               │
│  └────────┬──────────┘  └────────┬─────────┘               │
│           │                      │                          │
│           ▼                      ▼                          │
│  ┌─────────────────────────────────────┐                   │
│  │  Models (raw SQLite via callback)   │                   │
│  │  patientModel.js · paymentModel.js  │                   │
│  └────────────────┬────────────────────┘                   │
│                   │                                        │
│                   ▼                                        │
│  ┌─────────────────────────────────────┐                   │
│  │  SQLite3 Database                    │                   │
│  │  patients.sqlite / .patients_dev.db │                   │
│  └─────────────────────────────────────┘                   │
└────────────────────────────────────────────────────────────┘
        │
        │  AMQP (RabbitMQ)
        ▼
┌─────────────────────────────────────┐
│  consumer.js                         │
│  Listens: user.registered events    │
│  Action: creates patient record     │
└─────────────────────────────────────┘
```

## Project Structure

```
src/
  app.js                        # Express app (routes, JSON, error handler)
  config/
    database.js                 # SQLite connection, table creation, column migrations
  controllers/
    patientController.js        # Patient CRUD request handlers
    paymentController.js        # Payment CRUD request handlers
  middleware/
    errorHandler.js             # Global Express error handler
    requestValidator.js         # express-validator chains
    roleValidator.js            # Role-based auth via x-user-roles header
  models/
    patientModel.js             # SQLite queries (callback-based)
    paymentModel.js             # SQLite queries (callback-based)
  routes/
    patientRoutes.js            # Route definitions for /api/patients
    paymentRoutes.js            # Route definitions for /api/payments
server.js                       # Entry point
consumer.js                     # AMQP consumer for user.registered
prisma/
  schema.prisma                 # Prisma schema (for migrations/seed only)
  seed.ts                       # Seed script
  migrations/
```

## Data Flow

```
HTTP Request
    │
    ▼
roleValidator ──► checks x-user-roles header (set by gateway)
    │
    ▼
requestValidator ──► express-validator (POST only)
    │
    ▼
Controllers ──► Models ──► SQLite3
    │
    ▼
Response (JSON)
```

## API Routes

### Patients — `/api/patients`
| Method | Path      | Auth Roles        | Description                       |
|--------|-----------|-------------------|-----------------------------------|
| POST   | `/`       | ADMIN, DOCTOR     | Create patient                    |
| GET    | `/`       | ADMIN, DOCTOR     | List all patients                 |
| GET    | `/me`     | Public            | Get own profile (via x-user-email)|
| PATCH  | `/me`     | Public            | Update own profile                |
| GET    | `/:id`    | ADMIN, DOCTOR     | Get patient by ID                 |
| PUT    | `/:id`    | ADMIN, DOCTOR     | Full update patient               |
| DELETE | `/:id`    | ADMIN             | Delete patient                    |

### Payments — `/api/payments`
| Method | Path      | Auth Roles        | Description                       |
|--------|-----------|-------------------|-----------------------------------|
| GET    | `/`       | ADMIN, DOCTOR     | List payments by patientId        |
| POST   | `/`       | ADMIN, DOCTOR     | Create payment record             |

## Event Consumer

The `consumer.js` connects to RabbitMQ and listens for `user.registered` events:
- Exchange: `denti_code_events` (topic)
- Queue: `patient_service_queue`
- Binding key: `user.registered`
- On receive: creates patient record with email + AuthUserID link
