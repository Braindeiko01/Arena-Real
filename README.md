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

Administrative operations like approving transactions or validating game results
are no longer available in the main backend. Use the admin API instead.
The admin backend expects a secret used to validate JWTs:

```bash
export ADMIN_JWT_SECRET=changeMe
export ADMIN_USER=admin
export ADMIN_PASSWORD=admin
```

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

Copy `admin/.env.example` to `admin/.env.local` with:

```env
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:8081
```
