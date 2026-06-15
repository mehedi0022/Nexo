# Nexo

Nexo is a full-stack e-commerce project built as a monorepo with a Next.js frontend and an Express.js TypeScript backend. The project is organized so the storefront, authentication pages, API routes, shared backend utilities, and email templates can grow cleanly as the application becomes more complete.

## Tech Stack

**Frontend**

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui-style component setup
- Radix UI
- next-themes
- Phosphor Icons

**Backend**

- Node.js
- Express.js 5
- TypeScript
- dotenv
- cors
- helmet
- express-rate-limit
- nodemailer
- bcryptjs
- slugify

## Project Structure

```text
Nexo/
  backend/
    src/
      app.ts
      server.ts
      config/
      controllers/
      middlewares/
      routes/
      templates/
      utils/
    .env.example
    nodemon.json
    package.json
    tsconfig.json

  frontend/
    app/
      (auth)/
      (website)/
    components/
      common/
      ui/
    hooks/
    lib/
    public/
    .env.example
    package.json
    tsconfig.json
```

## Current Features

- Monorepo structure with separate `frontend` and `backend` apps
- Express backend initialized with TypeScript
- Centralized backend app setup in `src/app.ts`
- Separate backend server entry in `src/server.ts`
- Security middleware: `helmet`, `cors`, and rate limiting
- JSON and URL-encoded request parsing
- Central error and not-found handlers
- API route modules prepared for auth, products, categories, orders, payments, users, reviews, and dashboard
- Email template utilities for verification, password reset, order confirmation, shipping, and low stock alerts
- Next.js frontend structure with website and auth route groups
- Shared frontend layout, header, footer, theme provider, and UI button component

## Prerequisites

Install these before running the project:

- Node.js 20 or newer
- npm
- Git

## Getting Started

Clone the repository:

```bash
git clone https://github.com/mehedi0022/Nexo.git
cd Nexo
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

Create environment files from the examples.

Backend:

```bash
cd backend
cp .env.example .env
```

Frontend:

```bash
cd frontend
cp .env.example .env
```

On Windows Command Prompt, use:

```cmd
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

### Backend Environment

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=*

SMTP_MAIL_HOST=smtp.example.com
SMTP_MAIL_PORT=587
SMTP_MAIL_USER=your-email@example.com
SMTP_MAIL_PASS=your-email-password
SMTP_MAIL_FROM_NAME=Nexo
MAIL_USER=your-email@example.com
```

### Frontend Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Do not commit real `.env` files. Only commit `.env.example`.

## Running The Project

Start the backend development server:

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend development server in another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

## Available Scripts

### Backend

Run from `backend/`:

```bash
npm run dev
```

Starts the Express API with Nodemon and ts-node.

```bash
npm run build
```

Compiles TypeScript into `dist/`.

```bash
npm run start
```

Runs the compiled backend from `dist/server.js`.

```bash
npm run typecheck
```

Checks TypeScript without emitting build files.

### Frontend

Run from `frontend/`:

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production Next.js app after building.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run typecheck
```

Checks TypeScript without emitting build files.

```bash
npm run format
```

Formats TypeScript and TSX files with Prettier.

## API Routes

The backend currently mounts these route groups:

```text
GET /                         Health check
/api/auth                     Authentication routes
/api/products                 Product routes
/api/categories               Category routes
/api/orders                   Order routes
/api/payments                 Payment routes
/api/users                    User routes
/api/reviews                  Review routes
/api/dashboard                Dashboard routes
```

Most route modules are currently prepared as empty routers and ready for implementation.

## Development Notes

- Keep backend code inside `backend/src`.
- Keep frontend app routes inside `frontend/app`.
- Keep reusable frontend UI inside `frontend/components`.
- Keep secrets in `.env` files only.
- Keep generated folders such as `node_modules`, `.next`, and `dist` out of Git.
- Use `.env.example` files to document required environment variables.

## Git Workflow

Check changes:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit changes:

```bash
git commit -m "your commit message"
```

Push to GitHub:

```bash
git push origin main
```

## License

This project is licensed under the terms of the [MIT License](LICENSE).
