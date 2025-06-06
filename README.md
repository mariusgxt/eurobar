# Eurobar

Eurobar is a web app for scanning products to get their origin. It consists of a React + TypeScript + Vite frontend and a Spring Boot backend, with a PostgreSQL database running in Docker.

## Prerequisites
- Docker Desktop (for the database)
- Node.js (for the frontend)
- Java 17+ (for the backend)

## Starting the Database
1. Open a terminal and navigate to the `database` folder:
   ```powershell
   cd database
   ```
2. Start the database with Docker Compose:
   ```powershell
   docker compose up -d
   ```

## Starting the Backend (Spring Boot)
1. Open a terminal and navigate to the `eurobar_backend` folder:
   ```powershell
   cd eurobar_backend
   ```
2. Build and start the backend:
   ```powershell
   .\gradlew bootRun
   ```
   The backend will run on [http://localhost:8080](http://localhost:8080).

## Starting the Frontend (Vite + React)
1. Open a terminal and navigate to the `eurobar_frontend` folder:
   ```powershell
   cd eurobar_frontend
   ```
2. Install dependencies (first time only):
   ```powershell
   npm install
   ```
3. Start the frontend development server:
   ```powershell
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173).

## Usage
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Scan a product barcode to see its origin and brand information.

## Notes
- The backend connects to the PostgreSQL database started via Docker Compose.
- The frontend expects the backend to be running on port 8080.
- You can configure CORS and other settings in the backend's `application.properties`.

---

Feel free to update this README with more details as your project evolves.
