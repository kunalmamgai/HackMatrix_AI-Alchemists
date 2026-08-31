# ReCircuit Deployment Guide

This guide covers deploying ReCircuit to production environments.

---

## Deployment Overview

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | recircuit.vercel.app |
| Backend | Railway | recircuit-api.up.railway.app |
| Database | SQLite | File-based (server storage) |

---

## Frontend Deployment (Vercel)

### Prerequisites

- Vercel account ([vercel.com](https://vercel.com/))
- GitHub repository connected

### Step-by-Step

#### 1. Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select the `Code` directory as root
4. Click **Deploy**

#### 2. Configure Build Settings

**Framework Preset:** Vite

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Install Command:**
```bash
npm install
```

#### 3. Set Environment Variables

Go to **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | Production |
| `VITE_API_URL` | `https://recircuit-api.up.railway.app/api` | Production |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Production |

#### 4. Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Visit the deployment URL

#### 5. Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. SSL is automatic

---

## Backend Deployment (Railway)

### Prerequisites

- Railway account ([railway.app](https://railway.app/))
- GitHub repository connected

### Step-by-Step

#### 1. Create New Project

1. Go to [railway.app/dashboard](https://railway.app/dashboard)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Select your repository
5. Select the `Code/server` directory

#### 2. Configure Build

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

#### 3. Set Environment Variables

Go to **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `DATABASE_URL` | `file:./prod.db` |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `NODE_ENV` | `production` |

#### 4. Add Volume for Database

Since SQLite uses a file, you need persistent storage:

1. Go to **Settings** → **Volumes**
2. Add a volume mount at `/app/prisma`
3. This persists the database across deployments

#### 5. Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Note the deployment URL (e.g., `recircuit-api.up.railway.app`)

#### 6. Run Database Migrations

After first deployment:

1. Go to **Settings** → **Shell**
2. Run:
   ```bash
   npx prisma db push
   node src/utils/seed.js
   ```

---

## Database Setup

### Initial Setup

After deploying backend, run these commands in Railway shell:

```bash
# Push schema to database
npx prisma db push

# Seed with sample data
node src/utils/seed.js
```

### Backup Strategy

Since SQLite is file-based:

1. **Automatic:** Railway volumes persist data
2. **Manual:** Download `dev.db` periodically
3. **Migration:** Consider PostgreSQL for production

### Migration to PostgreSQL (Optional)

For production, consider migrating to PostgreSQL:

```bash
# 1. Update schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 2. Update DATABASE_URL
DATABASE_URL="postgresql://user:pass@host:5432/db"

# 3. Push schema
npx prisma db push
```

---

## Google OAuth Setup for Production

### 1. Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click **Create Credentials** → **OAuth client ID**
4. Select **Web application**

### 2. Configure Authorized Origins

Add these to **Authorized JavaScript origins**:

```
https://recircuit.vercel.app
http://localhost:5173
```

### 3. Configure Redirect URIs

Add these to **Authorized redirect URIs**:

```
https://recircuit.vercel.app
http://localhost:5173
```

### 4. Copy Client ID

Copy the **Client ID** and add to both:
- Vercel: `VITE_GOOGLE_CLIENT_ID`
- Railway: `GOOGLE_CLIENT_ID`

---

## Stripe Setup for Production

### 1. Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

### 2. Set Up Webhooks

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://recircuit-api.up.railway.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret**

### 3. Configure Environment Variables

**Vercel:**
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**Railway:**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Environment Variables Summary

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789.apps.googleusercontent.com` |
| `VITE_API_URL` | Backend API URL | `https://recircuit-api.up.railway.app/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` |

### Backend (Railway)

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789.apps.googleusercontent.com` |
| `DATABASE_URL` | Database connection | `file:./prod.db` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `NODE_ENV` | Environment | `production` |

---

## Post-Deployment Checklist

### Frontend

- [ ] Site loads without errors
- [ ] Google login works
- [ ] Device search works
- [ ] Map loads and shows centers
- [ ] Marketplace shows products
- [ ] Checkout flow works
- [ ] Mobile responsive

### Backend

- [ ] API responds to requests
- [ ] Authentication works
- [ ] Database queries work
- [ ] Stripe payments work
- [ ] Webhooks receive events

### Database

- [ ] Schema is up to date
- [ ] Seed data is loaded
- [ ] Can create/read/update/delete records

---

## Monitoring

### Vercel Analytics

1. Go to your Vercel project
2. Navigate to **Analytics**
3. Enable **Web Vitals** tracking

### Railway Metrics

1. Go to your Railway project
2. View **Metrics** tab
3. Monitor CPU, memory, and network

### Error Tracking

Consider adding Sentry:

```javascript
// Frontend
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
});
```

---

## Troubleshooting

### Frontend Not Loading

1. Check Vercel build logs
2. Verify environment variables
3. Check browser console for errors

### Backend Not Responding

1. Check Railway logs
2. Verify database connection
3. Check environment variables

### Google Login Fails

1. Verify `CLIENT_ID` matches in both environments
2. Check authorized origins in Google Console
3. Ensure redirect URIs are correct

### Stripe Payments Fail

1. Verify using live keys (not test)
2. Check webhook endpoint is correct
3. Review Stripe dashboard for errors

### Database Issues

1. Check volume is mounted correctly
2. Run `npx prisma db push` in Railway shell
3. Verify `DATABASE_URL` is correct

---

## Rollback Procedure

### Frontend (Vercel)

1. Go to **Deployments**
2. Find previous working deployment
3. Click **Promote to Production**

### Backend (Railway)

1. Go to **Deployments**
2. Find previous working deployment
3. Click **Redeploy**

### Database

1. Download backup of `dev.db`
2. Upload to Railway volume
3. Restart service

---

## Cost Estimation

### Vercel (Hobby Plan - Free)

- 100GB bandwidth/month
- 1000 build minutes/month
- Unlimited deployments

### Railway (Hobby Plan - $5/month)

- 500 hours/month
- 1GB RAM
- 1GB storage

### Total Monthly Cost

| Service | Cost |
|---------|------|
| Vercel | $0 |
| Railway | $5 |
| Domain (optional) | $10-15 |
| **Total** | **$5-20/month** |

---

## Production Optimizations

### Frontend

```bash
# Analyze bundle
npm run build -- --analyze

# Enable compression in vite.config.js
import { compression } from 'vite-plugin-compression';

export default {
  plugins: [compression()]
};
```

### Backend

```bash
# Enable production mode
NODE_ENV=production

# Add rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

### Database

```bash
# Add indexes for frequently queried fields
# In schema.prisma:
model Product {
  // ...
  @@index([category])
  @@index([price])
}
```

---

*Last updated: August 2024*
