# AGENTS Instructions

This repository contains a Spring Boot backend and a Next.js frontend.

## Directory layout
- `back/` – Spring Boot backend
- `front/` – Next.js frontend

## Backend guidelines
- Follow the layered architecture (`application`, `domain`, `infrastructure`, `config`).
- Lower layers must not depend on higher layers.
- Use 4 spaces for indentation in Java sources.
- Prefer Lombok for boilerplate getters/setters.
- Build and run with Maven Java 17:
  ```bash
  cd back
  mvn spring-boot:run
  ```

## Frontend guidelines
- Next.js (TypeScript) lives in `front/` with source at `front/src`.
- Indent with 2 spaces and keep imports using the `@/` alias.
- Available scripts:
  - `npm run dev` – start development server
  - `npm run lint` – run ESLint
  - `npm run typecheck` – run TypeScript checks
- Consider adding ESLint + Prettier configuration for consistent style.
- Add tests with Jest and React Testing Library when possible.
- Organize components and hooks in feature‑based folders as the project grows.
- Store API base URLs and other secrets via environment variables.

## Testing
- There are currently no unit tests. If added:
  - Backend: use JUnit with Spring Boot testing utilities.
  - Frontend: use Jest + React Testing Library.

## Pull request guidelines
- Keep commit messages concise in the present tense.
- PR descriptions should summarise the main changes and list any tests executed (or note that no tests exist).
