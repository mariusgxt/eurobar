# Eurobar

Scan any product barcode to discover where it comes from and who makes it.

Built with **React 19 + TypeScript + Vite** (frontend), **Spring Boot 3** (backend), and **PostgreSQL 15** (database via Docker).

Supports **English** and **German** (i18n) with automatic browser language detection.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) 18+
- [Java 21+](https://adoptium.net/)

## Quick Start

Install once:

```sh
npm install
npm run install:frontend
```

Then start everything with a single command:

```sh
npm start
```

This launches the database, backend, and frontend concurrently. Open [http://localhost:5173](http://localhost:5173) when it's ready.

## Starting Services Individually

```sh
npm run start:db        # PostgreSQL (Docker)
npm run start:backend   # Spring Boot on :8080
npm run start:frontend  # Vite dev server on :5173
npm run stop:db         # Stop the database container
```

## Project Structure

```
eurobar/
├── database/           # Docker Compose + init SQL
├── eurobar_backend/    # Spring Boot REST API (Java 21, Gradle)
├── eurobar_frontend/   # React + Vite SPA
│   ├── src/
│   │   ├── locales/    # i18n translations (en, de)
│   │   ├── App.tsx     # Main app shell
│   │   ├── Header.tsx  # Shared header + language switcher
│   │   ├── Scanner.tsx # Camera / manual barcode input
│   │   └── ScannedResult.tsx  # Result display + contribute form
│   └── ...
├── package.json        # Root scripts (npm start)
└── README.md
```

## How It Works

1. Scan a barcode with your camera or type it in manually.
2. The backend checks the local database first, then falls back to the [Open Food Facts API](https://world.openfoodfacts.org/).
3. Results show the product's country of origin (with flag) and brand (with logo).
4. If a product isn't found, you can contribute the missing data directly from the app.

## API Documentation

With the backend running, visit [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) for the interactive Swagger UI.

## Configuration

| Setting | File | Default |
|---|---|---|
| Database connection | `eurobar_backend/src/main/resources/application.properties` | `localhost:5432/mydb` |
| CORS origins | same file | `http://localhost:5173` |
| Docker DB credentials | `database/docker-compose.yml` | `postgres / postgres` |