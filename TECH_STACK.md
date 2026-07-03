# Tech Stack

| Layer              | Technology                              |
|--------------------|-----------------------------------------|
| Runtime            | Node.js                                 |
| Language           | JavaScript (CommonJS)                   |
| Web Framework      | Express v5.1.0                          |
| Database           | SQLite3 (via `sqlite3` npm package)     |
| ORM (schema only)  | Prisma v6 (migrations + seeding only)   |
| Validation         | express-validator v7.2.1                |
| Message Broker     | RabbitMQ (via amqplib)                  |
| Config             | dotenv                                  |
| Dev Runner         | nodemon + concurrently                  |

## Key Dependencies

| Package                    | Purpose                                 |
|----------------------------|-----------------------------------------|
| express v5.1.0             | Web framework                           |
| sqlite3 v5.1.7             | SQLite database driver                  |
| amqplib v0.10.8            | RabbitMQ / AMQP client                  |
| express-validator v7.2.1   | Request body validation                 |
| dotenv v16.5.0             | Environment variable loading            |
| @prisma/client v6          | Prisma client (seed only)               |
| prisma v6                  | Schema management, migrations           |
| concurrently v9.2.0        | Run server + consumer together          |
| nodemon v3.1.10            | Auto-restart in dev                     |

## Scripts

| Command               | Description                            |
|-----------------------|----------------------------------------|
| `npm start`           | Run production server                  |
| `npm run dev:server`  | Dev server with nodemon                |
| `npm run dev:consumer`| Run AMQP consumer standalone           |
| `npm run dev`         | Run server + consumer concurrently     |
| `npm run prisma.seed` | Seed database                          |

## Environment Variables

| Variable   | Default                 | Description              |
|------------|-------------------------|--------------------------|
| `PORT`     | `3001`                  | HTTP server port         |
| `DB_PATH`  | `patients.sqlite`       | SQLite database file     |

## External Dependencies

- **RabbitMQ** — required for consuming `user.registered` events from Auth Service
- **API Gateway** — sets `x-user-roles` and `x-user-email` headers for auth/identity
- **Auth Service** — publishes user registration events to the broker
