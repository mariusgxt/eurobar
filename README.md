# Rspeedy Project

This is a ReactLynx project bootstrapped with `create-rspeedy`. It leverages **Bun** for fast JavaScript runtime and **Lynx** for building modern web applications.

## Prerequisites

Ensure you have the following installed:
- **Bun**: A fast JavaScript runtime. Install it from [bun.sh](https://bun.sh).
- **LynxExplorer App**: Required to scan QR codes and preview the app.

## Getting Started

Follow these steps to set up and run the project:

### 1. Install Dependencies

Use Bun to install the dependencies:

```bash
bun install
```

### 2. Start the Development Server

Run the development server with:

```bash
bun run dev
```

A QR code will appear in the terminal. Scan it using the **LynxExplorer App** to preview the application on your device.

### 3. Edit and Customize

You can start editing the application by modifying the `src/App.tsx` file. The page will automatically update as you save your changes.

## Build for Production

To build the project for production, use:

```bash
bun run build
```

The optimized output will be available in the `dist/` directory.

## Preview the Production Build

To preview the production build locally, run:

```bash
bun run preview
```

## Backend Integration

This project includes a Spring Boot backend located in the `backend/eurobar` directory. To run the backend:

1. Navigate to the backend directory:
   ```bash
   cd backend/eurobar
   ```

2. Use Maven Wrapper to start the backend:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will start on `http://localhost:8080`.

## Project Structure

Here’s an overview of the project structure:

```
.
├── src/                # Frontend source code
│   ├── App.tsx         # Main application component
│   ├── index.tsx       # Entry point
│   ├── assets/         # Static assets (images, etc.)
│   └── App.css         # Styling for the app
├── backend/            # Backend source code
│   └── eurobar/        # Spring Boot backend
├── lynx.config.ts      # Lynx configuration
├── package.json        # Project metadata and scripts
└── tsconfig.json       # TypeScript configuration
```

## License

Unfinished.

---

Happy coding!
