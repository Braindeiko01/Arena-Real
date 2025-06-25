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

