![ReCircuit Home Preview](Code/src/assets/page.png)

# ReCircuit

ReCircuit is a full-stack e-waste management platform that helps users:

- find safe disposal guidance for common electronic devices,
- discover verified recycling centers on an interactive map,
- schedule pickup and reuse workflows,
- and buy refurbished disposables through a guarded checkout flow.

The project combines a modern React frontend with a FastAPI backend and MongoDB data storage.

## Product Preview

![ReCircuit Home Preview](Code/src/assets/page.png)

## Why This Project Exists

E-waste is one of the fastest-growing waste streams globally. Most users still do not know:

- how to dispose of devices safely,
- where certified recycling centers exist,
- and what alternatives to disposal (repair, refurbish, reuse) are available.

ReCircuit addresses this gap with one integrated user experience from awareness to action.

## Core Objectives

1. Make e-waste disposal practical and understandable.
2. Increase visibility of responsible recycling options.
3. Encourage circular economy behavior (reduce, reuse, recycle).
4. Support reuse through a refurbished device marketplace.

## Current Feature Set

### 1. Home Experience

- Hero section with the campaign message:
	- Reuse. Recycle. ReCircuit.
- Quick action entry points for searching devices and scheduling pickup.
- Animated impact counters and modern visual design.

### 2. Device Disposal Guide

- Searchable list of device types with **category filter chips** (Recycle / Hazardous / Reuse) and **alias matching** ("mobile", "iphone", "macbook" all resolve).
- Step-by-step disposal instructions rendered as an **interactive checklist** with a live progress bar per device.
- Safety warnings for hazardous items.
- **Value band** per device: recovery value (₹), CO₂ avoided (kg), and materials recovered.
- Related-device suggestions and a print-friendly guide view.
- URL-synced selection so guides can be deep-linked (`?device=battery`).
- Device photos are bundled locally (`public/images/devices/`) with a branded gradient fallback via the shared `DeviceImage` component.
- "Sell a device" flow separated into a modal that adds custom disposables to the marketplace.

### 3. Nearby Recycling Centers

- Interactive Leaflet map with custom recycle-glyph markers.
- **Auto-fitting viewport** — the camera fits the current marker set on load and whenever filters change.
- **Zoom-to-selected** — picking a center from the list or map zooms in on it.
- Map controls: **recenter** button, live **zoom-level indicator**, and **geolocation** to center on the user's actual position with a pulsing "You are here" marker.
- Corrected, locality-accurate coordinates for all centers.
- Location cards with ratings, services, contact details, and timings.
- Filter and sort options.

### 4. Pickup and Reuse Network

- Structured flow for pickup and reuse actions.
- Recycler/reuse pathway support.
- Form-driven UX with progress-oriented presentation.

### 5. Circular Economy Section

- Reduce -> Reuse -> Recycle educational flow.
- Impact-oriented presentation.
- CTA wired back to the home page.

### 6. Disposables Marketplace

- Refurbished electronics shown in responsive cards.
- Live data from DummyJSON and FakeStore APIs (electronics only).
- Current layout: 3 cards per row on large screens.
- Wishlist-style interaction and product details.

### 7. Cart and Checkout

- Global cart state via context.
- Add to cart, remove, quantity updates, total calculation.
- Checkout screen with Stripe integration and payment input flow.

### 8. Login-Gated Purchase Rules

- Users must be logged in to buy.
- Google Sign-In authentication.
- Guest users clicking Buy are redirected to login.
- Checkout route is protected and shows login-required handling.

### 9. UI and Experience

- Light botanical theme (forest / sage / cream / ink / gold design tokens, Poppins display over Manrope body), with a named type scale and semantic color tokens used across all surfaces.
- Lucide icons throughout — no raw emoji or text glyphs in UI chrome.
- Chatbot renders response emphasis as real bold text (no literal markdown asterisks).
- Toast notifications for feedback.
- Floating chatbot for quick user assistance.
- Mobile-responsive navigation and section layouts.
- Breadcrumb navigation on all inner pages.
- Error boundaries around all routes.
- Form validation with Zod schemas.

## Tech Stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS 3
- Framer Motion
- React Router DOM
- React Leaflet + Leaflet
- Lucide React icons
- Zod (form validation)
- Stripe.js (payment processing)

### Backend

- Express.js
- Prisma ORM
- SQLite
- Google JWT authentication
- Stripe API integration

## Repository Structure

```
HackMatrix_AI-Alchemists/
|- Backend/
|  |- Main.py
|  |- Configrations/
|  |- config/
|  |- Models/
|  |- Routes/
|  |- Services/
|  |- schemas/
|  |- Schemes/
|
|- Code/
|  |- index.html
|  |- package.json
|  |- public/
|  |  |- favicon.svg
|  |  |- icons.svg
|  |  |- images/devices/   (locally bundled device photos)
|  |- src/
|     |- App.jsx
|     |- context/CartContext.jsx
|     |- context/NotificationContext.jsx
|     |- components/
|     |- pages/
|     |- api/
```

## Frontend Architecture Summary

- App-level route orchestration lives in `Code/src/App.jsx`.
- Global cart state is provided via `CartProvider`.
- Notification system uses `NotificationContext`.
- Pages are route-level wrappers.
- Reusable feature modules are organized under `src/components`.
- Local browser storage is used for lightweight persistence.

### LocalStorage Keys Used

- `isLoggedIn`
- `cartItems`
- `customDisposables` (custom disposables added via the sell-a-device flow)

## Backend Architecture Summary

### Layering

- `server/src/routes/` exposes API endpoints.
- `server/src/middleware/` handles authentication.
- `server/prisma/` defines database schema.

### API Routes

- `/api/auth` - Google authentication, profile management
- `/api/products` - Product CRUD with search and filtering
- `/api/orders` - Order management with Stripe integration
- `/api/centers` - Recycling center management
- `/api/pickups` - Pickup request scheduling
- `/api/reviews` - Product and center reviews

## Setup Guide

### Prerequisites

- Node.js 18+
- npm 9+

### Frontend Setup

```bash
cd Code
npm install
npm run dev
```

Vite will print the URL in terminal (typically `http://localhost:5173` or `http://localhost:5174`).

### Backend Setup

```bash
cd Code/server
npm install
npx prisma db push
node src/utils/seed.js
npm run dev
```

Backend will run at `http://localhost:3001`.

### Environment Variables

**Frontend** (`Code/.env`):
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key  # optional
```

**Backend** (`Code/server/.env`):
```
GOOGLE_CLIENT_ID=your_google_client_id
STRIPE_SECRET_KEY=your_stripe_secret  # optional
DATABASE_URL="file:./dev.db"
```

## Run Both Together

1. Start backend server (`cd Code/server && npm run dev`).
2. Start frontend dev server (`cd Code`).
3. Open frontend URL and use the UI.

## End-to-End User Flow

1. User opens home page.
2. Searches for a device and reads disposal guidance.
3. Checks nearby recycling centers on map (live data from OpenStreetMap).
4. Optionally schedules pickup.
5. Browses disposables marketplace (live electronics from DummyJSON/FakeStore).
6. If not logged in, buy action redirects to login.
7. Logged-in user adds items to cart and proceeds to checkout with Stripe.

## Branding and Assets

- Product name: ReCircuit
- Tagline: Reuse. Recycle. ReCircuit.
- Favicon: SVG in `Code/public/favicon.svg`
- Hero preview image used in this README: `Code/src/assets/hero.png`

## Known Notes

- Frontend currently keeps user auth state in local storage for demo flow.
- Backend uses SQLite via Prisma for lightweight persistence.

## Quick Commands

Frontend:

```bash
cd Code
npm run dev
npm run build
npm run preview
```

Backend:

```bash
cd Code/server
npm run dev
```

---

Built with a focus on practical sustainability and circular economy adoption.
