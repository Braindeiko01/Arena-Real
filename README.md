# Arena Real


This repository contains a Spring Boot backend and a Next.js frontend.

## Setup

1. Copy `front/.env.example` to `front/.env.local` and fill in your Firebase and API credentials.
   These variables are required for the chat to work correctly.
2. Install dependencies and run the frontend:

```bash
cd front
npm install
npm run dev
```

The backend uses Maven (Java 17):

```bash
cd back
mvn spring-boot:run
```

If Maven cannot resolve `co.com.arena.shared:shared-core:1.0.0`, build and
install the shared library first:

```bash
cd shared-core
mvn install
```

Before starting the backend, set the path to your Firebase service account
credentials using either the custom `FIREBASE_SERVICE_ACCOUNT_FILE` variable or
the standard `GOOGLE_APPLICATION_CREDENTIALS`:

```bash
export FIREBASE_SERVICE_ACCOUNT_FILE=/path/to/serviceAccountKey.json
# or
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
```


If neither variable is set, the backend won't start because Firebase cannot
locate credentials.

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
ADMIN_SECURITY_JWT_SECRET=changeMe
ADMIN_CREDENTIALS_USER=admin
ADMIN_CREDENTIALS_PASSWORD=admin
```
The application reads this `.env` file automatically at startup thanks to the
`dotenv-spring-boot` dependency, so no manual `export` is required. Set
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
