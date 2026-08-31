# ReCircuit Setup Guide

This guide walks you through setting up the ReCircuit development environment from scratch.

---

## Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | 18.0+ | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0+ | Included with Node.js |
| **Git** | 2.0+ | [git-scm.com](https://git-scm.com/) |

### Optional Software

| Software | Purpose | Download |
|----------|---------|----------|
| **VS Code** | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Postman** | API testing | [postman.com](https://www.postman.com/) |
| **Prisma Studio** | Database GUI | Included with Prisma |

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/recircuit/recircuit.git

# Navigate to the project
cd recircuit
```

---

## Step 2: Frontend Setup

### 2.1 Navigate to Frontend Directory

```bash
cd Code
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your values:

```env
# Google OAuth (required for login)
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Backend API URL
VITE_API_URL=http://localhost:3001/api

# Stripe (optional, for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 2.4 Start Development Server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**

---

## Step 3: Backend Setup

### 3.1 Navigate to Backend Directory

```bash
cd ../Code/server
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your values:

```env
# Google OAuth (same client ID as frontend)
GOOGLE_CLIENT_ID=your_google_client_id

# Database
DATABASE_URL="file:./dev.db"

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 3.4 Initialize Database

```bash
# Push schema to database
npx prisma db push

# Seed with sample data
node src/utils/seed.js
```

### 3.5 Start Backend Server

```bash
npm run dev
```

The backend will be available at: **http://localhost:3001**

---

## Step 4: Verify Setup

### 4.1 Check Frontend

Open **http://localhost:5173** in your browser. You should see the ReCircuit homepage.

### 4.2 Check Backend

```bash
# Test the API
curl http://localhost:3001/api/products
```

You should see a JSON response with products.

### 4.3 Check Database

```bash
# Open Prisma Studio (database GUI)
npx prisma studio
```

This opens a web interface at **http://localhost:5555** to view/edit database records.

---

## Environment Variables Reference

### Frontend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Yes | Google OAuth Client ID |
| `VITE_API_URL` | No | Backend API URL (default: `http://localhost:3001/api`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key for payments |

### Backend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth Client ID (same as frontend) |
| `DATABASE_URL` | Yes | SQLite database path (default: `file:./dev.db`) |
| `STRIPE_SECRET_KEY` | No | Stripe secret key for payments |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |

---

## Getting API Keys

### Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add authorized origins:
   - `http://localhost:5173` (development)
   - `https://your-domain.vercel.app` (production)
7. Copy the **Client ID**

### Stripe Keys (Optional)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy:
   - **Publishable key** (frontend)
   - **Secret key** (backend)
4. For webhooks:
   - Go to **Developers** → **Webhooks**
   - Add endpoint: `http://localhost:3001/api/webhooks/stripe`
   - Copy the **Signing secret**

---

## Development Workflow

### Running Both Servers

**Terminal 1 (Frontend):**
```bash
cd Code
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd Code/server
npm run dev
```

### Database Commands

```bash
# Push schema changes
npx prisma db push

# Regenerate Prisma client
npx prisma generate

# Open database GUI
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Seed database
node src/utils/seed.js
```

### Build Commands

```bash
# Frontend
cd Code
npm run build        # Production build
npm run preview      # Preview production build

# Backend
cd Code/server
npm start            # Production start
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Database Issues

```bash
# Reset database completely
rm -f Code/server/prisma/dev.db
npx prisma db push
node src/utils/seed.js
```

### Google OAuth Not Working

1. Verify `VITE_GOOGLE_CLIENT_ID` matches `GOOGLE_CLIENT_ID`
2. Check authorized origins in Google Cloud Console
3. Ensure `http://localhost:5173` is in the list

### Stripe Not Working

1. Verify you're using test keys (start with `pk_test_` and `sk_test_`)
2. Check webhook endpoint is correct
3. Use Stripe CLI for local webhook testing:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

---

## VS Code Configuration

### Recommended Extensions

- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Prisma** - Prisma syntax highlighting
- **ESLint** - Code linting
- **Prettier** - Code formatting

### settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.classAttributes": ["class", "className"],
  "tailwindCSS.emmetCompletions": true
}
```

---

## Production Deployment

### Vercel (Frontend)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com/)
3. Import repository
4. Set environment variables
5. Deploy

### Railway (Backend)

1. Push to GitHub
2. Go to [railway.app](https://railway.app/)
3. Create new project
4. Add service → GitHub repo
5. Set environment variables
6. Deploy

---

## Quick Reference

### Frontend

```bash
cd Code
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run linter
```

### Backend

```bash
cd Code/server
npm install          # Install dependencies
npm run dev          # Start dev server
npx prisma db push   # Update database
npx prisma studio    # Open database GUI
```

---

*Last updated: August 2024*
