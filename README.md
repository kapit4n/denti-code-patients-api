# denti-code-patients-api

Patient Registry & Payments microservice for the denti-code platform. Manages patient demographics and payment records, with event-driven patient creation via RabbitMQ.

## System Diagram

```
Auth Service ──user.registered──► RabbitMQ ──► consumer.js ──► SQLite3
                                                        (auto-create patient)

Frontend ──► API Gateway ──► /api/patients/* ──► Patient API ──► SQLite3
                 │                    (x-user-roles, x-user-email)
                 │
                 └──────── /api/payments/* ──► Payment API ──► SQLite3
```

## Key Features

- **Patient Registry** — CRUD for patient demographics, contact info, medical history
- **Self-Service Profiles** — `/me` endpoints allow patients to view/update their own profile
- **Payment Records** — record payments linked to patients and appointments
- **Event-Driven Creation** — automatically creates patient profiles from auth service registration events
- **Role-Based Access** — staff (ADMIN/DOCTOR) vs patient access via gateway headers
- **Dual Database Setup** — raw SQLite3 at runtime, Prisma for schema management and seeding

## Getting Started

```bash
npm install
npm run dev
```

Server starts on `http://0.0.0.0:3001`. Consumer starts alongside (requires RabbitMQ on localhost:5672).

## Docs

- [Architecture](./ARCHITECTURE.md)
- [Tech Stack](./TECH_STACK.md)
