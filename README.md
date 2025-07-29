# Arena Real


This repository contains a Spring Boot backend and a Next.js frontend.

## Setup

1. Copy `front/.env.example` to `front/.env.local` and fill in your Firebase and
   API credentials. Set `NEXT_PUBLIC_BACKEND_API_URL` to the base URL of the main
   backend (e.g. `http://localhost:8080`).
2. Copy `back/.env.example` to `back/.env` and configure the backend variables.
3. Install dependencies and run the frontend:

```bash
cd front
npm install
npm run dev
```

4. The `/chat` page shows all your conversations. When a chat is active, both
   the top and bottom navigation bars include a chat icon that links directly to
   that conversation. The icon displays a small red badge while the chat is
   active.

The backend uses Maven (Java 17). A root `pom.xml` aggregates all Java modules:

```bash
cd back
mvn spring-boot:run
```


The backend exposes Server-Sent Event (SSE) endpoints for real-time
notifications.

## API overview

The following table lists the available REST and SSE endpoints, the required HTTP method, expected role and whether a JWT token is required. Public endpoints can be called without authentication. ADMIN routes expect an `Authorization` header with a valid token and all other `/api` routes now require a token granting the `USER` role.

| Route | Method | Role | JWT required |
|-------|--------|------|--------------|
| `/api/register` | POST | Public | No |
| `/api/referrals/earnings/{userId}` | GET | User | Yes |
| `/api/push/register` | POST | Public | No |
| `/api/jugadores` | PUT | Public | No |
| `/api/jugadores/{id}` | GET | Public | No |
| `/api/jugadores/{id}/saldo` | GET | Public | No |
| `/api/partidas/apuesta/{apuestaId}` | GET | User | Yes |
| `/api/partidas/chat/{chatId}` | GET | User | Yes |
| `/api/partidas/{id}/aceptar/{jugadorId}` | PUT | User | Yes |
| `/api/partidas/{id}/cancelar` | PUT | User | Yes |
| `/api/partidas/{id}/resultado` | PUT | User | Yes |
| `/api/partidas/jugador/{jugadorId}` | GET | User | Yes |
| `/api/matchmaking/ejecutar` | POST | User | Yes |
| `/api/matchmaking/cancelar` | POST | User | Yes |
| `/api/matchmaking/declinar` | POST | User | Yes |
| `/api/transacciones` | POST | User | Yes |
| `/api/transacciones/jugador/{id}` | GET | User | Yes |
| `/api/transacciones/stream/{jugadorId}` | GET (SSE) | User/Admin | Yes |
| `/sse/transacciones/{jugadorId}` | GET (SSE) | User/Admin | Yes |
| `/sse/matchmaking/{jugadorId}` | GET (SSE) | User/Admin | Yes |
| `/sse/match` | GET (SSE) | User/Admin | Yes |
| `/api/chats/between` | GET | User | Yes |
| `/api/chats/partida/{partidaId}` | GET | User | Yes |
| `/api/chats/{chatId}/start-message` | POST | User | Yes |
| `/api/chats/{chatId}/share-link` | POST | User | Yes |
| `/api/chats/{chatId}/result-message` | POST | User | Yes |
| `/api/internal/notify-transaction-approved` | POST | ADMIN | Yes |
| `/api/internal/notify-prize-distributed` | POST | ADMIN | Yes |
| `/api/admin/images` | GET | ADMIN | Yes |
| `/api/admin/images/{id}/approve` | POST | ADMIN | Yes |
| `/api/admin/transactions` | GET | ADMIN | Yes |
| `/api/admin/transactions/{id}/status` | POST | ADMIN | Yes |
| `/api/admin/games/results` | GET | ADMIN | Yes |
| `/api/admin/games/{id}/distribute` | POST | ADMIN | Yes |
| `/api/admin/games/{id}/winner/{playerId}` | POST | ADMIN | Yes |
| `/api/admin/bets/{id}/state` | POST | ADMIN | Yes |
| `/api/admin/auth/login` | POST | Public | No |

Build all Java modules in one step:

```bash
mvn install
```

This installs `shared-core`, the main backend and `admin-back` into your local
Maven repository. If the admin backend fails with errors like `package
co.com.arena.real.application.service does not exist`, verify that the install
command completed successfully.

If the admin backend fails with errors like `package co.com.arena.real.application.service does not exist`,
verify that the main backend was installed locally:

```bash
cd back
mvn install -DskipTests
```

Before starting the backend, set the path to your Firebase service account
credentials using either the custom `FIREBASE_SERVICE_ACCOUNT_FILE` variable or
the standard `GOOGLE_APPLICATION_CREDENTIALS`:

```bash
export FIREBASE_SERVICE_ACCOUNT_FILE=/path/to/serviceAccountKey.json
# or
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
```

These variables can also be defined in a `.env` file because the backend loads
environment entries via `spring-dotenv` when `dotenv.enabled=true`.

By default the backend ships with Firebase disabled. If you want to use chat and
push features, enable it by setting `firebase.enabled=true` and providing the
credentials file. Otherwise keep it disabled (via `FIREBASE_ENABLED=false`), in
which case chat features and push notifications will skip all Firebase operations
and the push token endpoint will not be available.

Este proyecto usa Firebase en el front-end. Las credenciales deben declararse en un archivo `.env.local` en la carpeta `front`.

Ejemplo de archivo `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tuApiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

Recuerda reiniciar el servidor de desarrollo después de modificar este archivo.


## Admin console

Two new applications provide an isolated admin panel:

- `admin-back` – Spring Boot backend exposing admin endpoints on port `8081`.
- `admin` – Next.js frontend located in the `admin/` folder.

Run the admin backend:

```bash
cd admin-back
mvn spring-boot:run
```


Before running, configure a database connection. Create `admin-back/.env` (you can copy from `.env.example`) and set:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/arena_real
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
# Use a 256‑bit value (at least 32 characters)
SECURITY_JWT_SECRET=5e8f0bc1f6c34fdfadcb5c1249eb4d77b91c8f2d0316fabbf90c1aaaf7b39cdd
# Generate your own secret with:
# openssl rand -hex 32
ADMIN_CREDENTIALS_USER=admin
ADMIN_CREDENTIALS_PASSWORD=admin
```
The application reads this `.env` file automatically at startup thanks to the
`spring-dotenv` dependency, so no manual `export` is required. Set
`dotenv.enabled=true` in your configuration to activate it. Administrative
operations like approving transactions or validating game results are no longer
available in the main backend. Use the admin API instead.
Default values are provided in `admin-back/src/main/resources/application.properties`.

You can obtain a JWT with:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' \
  http://localhost:8081/api/admin/auth/login
```

Run the admin frontend:

```bash
cd admin
npm install
npm run dev
```

Copy `admin/.env.example` to `admin/.env.local` and set the API URL:

```env
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:8081
```

### Troubleshooting 401 errors

If you receive `401` responses from the admin API after logging in, verify:

1. Ensure the values in `admin-back/.env` are correct. The backend loads this
   file automatically when starting.

2. The login request returns a token and it is stored as `adminToken` in
   `localStorage`. Use the browser dev tools to inspect this value.
3. Subsequent requests must include `Authorization: Bearer <token>` in the
   headers. If the token is missing or expired, remove it with
   `localStorage.removeItem('adminToken')` and log in again.

## Maven troubleshooting

If Maven reports errors resolving plugins or dependencies, run with the `-U`
flag to update local metadata:

```bash
mvn -U clean install
```

If your environment lacks internet access, configure a mirror in `settings.xml`
that points to an accessible Maven repository.


## Transaction approval flow

When an admin marks a transaction as **ENTREGADA** in the admin console:

1. `AdminService` calls `TransaccionService.aprobarTransaccion` in the admin backend.
2. The admin backend sends two requests to the main backend:
   - The backend now emits a `saldo-actualizar` SSE event automatically whenever a player's balance changes.
   - `/api/internal/notify-transaction-approved` emits both `transaccion-aprobada` and `saldo-actualizar` SSE events.
3. The user client now uses `useTransactionUpdates` to receive these notifications in real time.
   If the connection was lost, the hook refreshes data when the page becomes visible or after reconnecting.

## Prize distribution

When an admin distributes a prize from the admin panel:

1. `AdminService` calls `PartidaService.marcarComoValidada` in the admin backend.
2. The created `TransaccionResponse` is sent to the main backend via `/api/internal/notify-prize-distributed`.
3. That endpoint emits `transaccion-aprobada` and `saldo-actualizar` SSE events so the winner's balance updates in real time.

## Referral system

Two new endpoints implement a simple referral program:

```http
POST /api/register
GET  /api/referrals/earnings/{userId}
```

Registering accepts an optional `referralCode`. When a referred player finishes a duel,
the inviter automatically earns COP 1000. Rewards are credited after the admin
backend validates the duel. The frontend includes a **Referidos** page at `/referrals` showing your code and total earned.
## Firestore chat migration

Some early deployments stored chats under `chats/{chatId}/chats/{subId}`. The frontend only looks at the `chats/` collection, so these documents need to be copied to the root collection. A helper script is available in `front/scripts/migrateChats.ts`.

Run it once with your Firebase service account credentials:

```bash
cd front
npm install
FIREBASE_SERVICE_ACCOUNT_FILE=/path/to/serviceAccount.json npx ts-node scripts/migrateChats.ts
```

It will replicate all nested chat documents and their messages at `chats/` and print each migrated path.
