# ReCircuit Architecture

## Overview

ReCircuit is a full-stack e-waste management platform built with modern web technologies. This document details the system architecture, data flows, and design decisions.

---

## System Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT TIER                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        React Application                              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│  │
│  │  │   Router    │  │   Context   │  │   Hooks     │  │ Components  ││  │
│  │  │   (Routes)  │  │   (State)   │  │   (Logic)   │  │   (UI)      ││  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API TIER                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        API Client Layer                                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │  │
│  │  │  client.js  │  │ external.js │  │ products.js │                  │  │
│  │  │ (Auth+CRUD) │  │ (Live APIs) │  │  (Search)   │                  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE TIER                                    │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ │
│  │    Backend API      │  │   External APIs     │  │   Third-Party       │ │
│  │    (Express.js)     │  │   (Free Services)   │  │   Services          │ │
│  │    :3001            │  │                     │  │                     │ │
│  │  ┌───────────────┐  │  │  ┌───────────────┐  │  │  ┌───────────────┐  │ │
│  │  │ Auth Service  │  │  │  │ Overpass API  │  │  │  │ Stripe.js     │  │ │
│  │  │ Product CRUD  │  │  │  │ DummyJSON     │  │  │  │ Google Auth   │  │ │
│  │  │ Order Mgmt    │  │  │  │ FakeStore     │  │  │  │               │  │ │
│  │  │ Center Mgmt   │  │  │  └───────────────┘  │  │  └───────────────┘  │ │
│  │  └───────────────┘  │  │                     │  │                     │ │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA TIER                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        SQLite Database                                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│  │
│  │  │    User     │  │   Product   │  │   Order     │  │   Center    ││  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### React Component Hierarchy

```
App.jsx
│
├── BrowserRouter
│   │
│   ├── CartProvider (Context)
│   │   │
│   │   └── NotificationProvider (Context)
│   │       │
│   │       ├── ErrorBoundary
│   │       │
│   │       ├── Navbar
│   │       │   ├── Logo + Brand
│   │       │   ├── Navigation Links
│   │       │   └── Auth Buttons
│   │       │
│   │       ├── Routes
│   │       │   │
│   │       │   ├── "/" → HomePage
│   │       │   │   ├── Hero
│   │       │   │   ├── HomeFeatures
│   │       │   │   ├── ImpactStats
│   │       │   │   ├── DrawerEstimator
│   │       │   │   ├── NearbyLocations
│   │       │   │   ├── DisposablesBar
│   │       │   │   └── HomeCta
│   │       │   │
│   │       │   ├── "/devices" → DeviceSearchPage
│   │       │   │   ├── DeviceSearch
│   │       │   │   └── DeviceGuide
│   │       │   │
│   │       │   ├── "/nearby" → NearbyLocationsPage
│   │       │   │   └── NearbyLocations
│   │       │   │
│   │       │   ├── "/disposables" → DisposablesPage
│   │       │   │   └── ProductGrid
│   │       │   │
│   │       │   ├── "/checkout" → CheckoutPage
│   │       │   │   └── CheckoutForm
│   │       │   │
│   │       │   ├── "/about" → AboutPage
│   │       │   │
│   │       │   └── "*" → NotFoundPage
│   │       │
│   │       ├── FloatingChatbot
│   │       └── Footer
```

### Component Responsibilities

| Component | Responsibility | State |
|-----------|---------------|-------|
| **Hero** | Landing hero with WebGL shader, search bar, stats | Local |
| **HomeFeatures** | Feature cards with icons and descriptions | Local |
| **ImpactStats** | Animated counters for environmental impact | Local |
| **DrawerEstimator** | Device picker for value estimation | Local |
| **NearbyLocations** | Map + list of recycling centers | External API |
| **DisposablesBar** | Marketplace preview cards | External API |
| **DeviceSearch** | Search/filter devices | Local + URL params |
| **DeviceGuide** | Step-by-step disposal instructions | Local + URL params |
| **ProductGrid** | Marketplace product listing | External API |
| **CheckoutForm** | Payment form with validation | Context (Cart) |
| **Navbar** | Navigation + auth state | Context (Auth) |

---

## Data Flow

### 1. Device Search Flow

```
User Input → DeviceSearch Component
    │
    ├──→ Local devices.js (fast, offline)
    │
    └──→ URL Sync (?device=battery)
            │
            └──→ DeviceGuide Component
                    │
                    ├──→ Step checklist (interactive)
                    ├──→ Safety warnings
                    ├──→ Value band (₹, CO₂, materials)
                    └──→ Print-friendly view
```

### 2. Recycling Center Flow

```
NearbyLocationsPage
    │
    ├──→ Local centers.js (seed data)
    │
    └──→ Overpass API (OpenStreetMap)
            │
            ├──→ Query: node["amenity"="recycling"]
            │
            └──→ Transform & merge
                    │
                    ├──→ Leaflet Map (custom markers)
                    └──→ Center List (cards with details)
```

### 3. Marketplace Flow

```
DisposablesPage
    │
    ├──→ DummyJSON API
    │    └──→ Categories: smartphones, laptops, tablets, mobile-accessories
    │
    ├──→ FakeStore API
    │    └──→ Category: electronics
    │
    └──→ Local products.js (seed data)
            │
            └──→ Merge & deduplicate
                    │
                    ├──→ Filter: electronics only
                    ├──→ Sort: by price, rating, name
                    └──→ Display: ProductGrid
```

### 4. Checkout Flow

```
User clicks "Buy"
    │
    ├──→ Auth check (Google JWT or localStorage)
    │    └──→ If not logged in → Redirect to /login
    │
    └──→ CheckoutPage
            │
            ├──→ Cart Context (items, totals)
            │
            └──→ CheckoutForm
                    │
                    ├──→ Zod validation
                    │    ├── Card number (Luhn check)
                    │    ├── Expiry (MM/YY format)
                    │    └── CVV (3-4 digits)
                    │
                    └──→ Stripe.js
                         │
                         ├──→ Create Payment Intent
                         ├──→ Confirm payment
                         └──→ POST /api/orders
                                │
                                └──→ Backend
                                     │
                                     ├──→ Create order in DB
                                     ├──→ Send confirmation email
                                     └──→ Return order ID
```

---

## API Architecture

### Backend API Structure

```
Code/server/
├── src/
│   ├── index.js          # Express app setup
│   ├── routes/
│   │   ├── auth.js       # /api/auth/*
│   │   ├── products.js   # /api/products/*
│   │   ├── orders.js     # /api/orders/*
│   │   ├── centers.js    # /api/centers/*
│   │   ├── pickups.js    # /api/pickups/*
│   │   ├── reviews.js    # /api/reviews/*
│   │   └── webhooks.js   # /api/webhooks/*
│   │
│   ├── middleware/
│   │   ├── auth.js       # JWT verification
│   │   ├── validate.js   # Request validation
│   │   └── errorHandler.js
│   │
│   ├── utils/
│   │   ├── seed.js       # Database seeding
│   │   └── helpers.js    # Utility functions
│   │
│   └── services/
│       ├── stripe.js     # Stripe integration
│       └── google.js     # Google OAuth
│
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── dev.db            # SQLite database
│
└── .env                  # Environment variables
```

### API Request/Response Pattern

```javascript
// Standard API response format
{
  "success": true,
  "data": { ... },           // Response data
  "meta": {                  // Pagination (if applicable)
    "page": 1,
    "limit": 10,
    "total": 100
  }
}

// Error response format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { ... }
  }
}
```

---

## State Management

### Context Providers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE ARCHITECTURE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

App
│
├── CartProvider
│   ├── State: cartItems[], total, itemCount
│   ├── Actions: addToCart, removeFromCart, updateQuantity, clearCart
│   └── Persistence: localStorage
│
└── NotificationProvider
    ├── State: notifications[]
    ├── Actions: addNotification, removeNotification
    └── UI: ToastContainer
```

### Local Storage Keys

| Key | Purpose | Format |
|-----|---------|--------|
| `isLoggedIn` | Auth state | `"true"` / `"false"` |
| `cartItems` | Shopping cart | JSON array |
| `customDisposables` | User-added products | JSON array |
| `selectedDevice` | Device guide state | Device ID string |

---

## External API Integration

### Overpass API (OpenStreetMap)

**Endpoint:** `https://overpass-api.de/api/interpreter`

**Query:**
```json
[out:json][timeout:25];
(
  node["amenity"="recycling"]["recycling:type"="e-waste"](bbox);
  node["amenity"="recycling"]["recycling:electronics"="yes"](bbox);
);
out body;
```

**Response Transformation:**
```javascript
{
  id: element.id,
  name: element.tags.name || "Recycling Center",
  address: element.tags["addr:street"] || "",
  latitude: element.lat,
  longitude: element.lon,
  phone: element.tags.phone || null,
  hours: element.tags.opening_hours || null,
  services: extractServices(element.tags),
  source: "overpass"
}
```

### DummyJSON

**Endpoint:** `https://dummyjson.com/products/category/{category}`

**Categories Used:**
- `smartphones`
- `laptops`
- `tablets`
- `mobile-accessories`

**Response Transformation:**
```javascript
{
  id: `dummy-${product.id}`,
  name: product.title,
  description: product.description,
  price: product.price * 100, // Convert to paise
  category: mapCategory(product.category),
  condition: "refurbished",
  imageUrl: product.thumbnail,
  stock: product.stock,
  rating: product.rating,
  brand: product.brand,
  source: "dummyjson"
}
```

### FakeStore API

**Endpoint:** `https://fakestoreapi.com/products/category/electronics`

**Response Transformation:**
```javascript
{
  id: `fake-${product.id}`,
  name: product.title,
  description: product.description,
  price: Math.round(product.price * 100), // Convert to paise
  category: "Electronics",
  condition: "refurbished",
  imageUrl: product.image,
  stock: Math.floor(Math.random() * 20) + 5,
  rating: product.rating?.rate || 4.0,
  brand: extractBrand(product.title),
  source: "fakestore"
}
```

---

## Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Google    │────►│  Google     │────►│  Backend    │
│   OAuth     │     │  Token      │     │  /auth/google│
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Verify JWT  │
                                        │ Extract ID  │
                                        └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Find/Create │
                                        │    User     │
                                        └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Generate    │
                                        │ Session JWT │
                                        └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Return to   │
                                        │   Client    │
                                        └─────────────┘
```

### API Security Layers

1. **Client-Side:** Zod validation, input sanitization
2. **API Gateway:** Helmet, CORS, rate limiting
3. **Authentication:** JWT verification middleware
4. **Database:** Prisma ORM (SQL injection prevention)
5. **Secrets:** Environment variables only

---

## Performance Optimization

### Code Splitting

```javascript
// App.jsx - Lazy load routes
const HomePage = lazy(() => import('./pages/Home'));
const DeviceSearchPage = lazy(() => import('./pages/DeviceSearchPage'));
const NearbyLocationsPage = lazy(() => import('./pages/NearbyLocationsPage'));
const DisposablesPage = lazy(() => import('./pages/DisposablesPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
```

### Caching Strategy

| Data Type | Cache Strategy | TTL |
|-----------|---------------|-----|
| Device data | Local only | Never (static) |
| Recycling centers | API + merge | 5 minutes |
| Products | API + merge | 5 minutes |
| User session | localStorage | Until logout |
| Cart items | localStorage | Persistent |

### Bundle Optimization

- **Tree shaking:** Enabled via Vite
- **Code splitting:** Route-based lazy loading
- **Asset optimization:** SVG icons, WebP images
- **CSS purge:** Tailwind removes unused classes

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      VERCEL DEPLOYMENT                                       │
└─────────────────────────────────────────────────────────────────────────────┘

GitHub Push → Vercel Build → Edge CDN → Global Users
                │
                ├──→ Build: vite build
                ├──→ Output: dist/
                └──→ Deploy: Edge Network
```

### Backend Deployment (Railway)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RAILWAY DEPLOYMENT                                      │
└─────────────────────────────────────────────────────────────────────────────┘

GitHub Push → Railway Build → Docker Container → Railway Infrastructure
                │
                ├──→ Build: npm install
                ├──→ Start: node src/index.js
                └──→ Database: SQLite (file-based)
```

---

## Future Architecture Considerations

### Scaling to Production

1. **Database:** Migrate SQLite → PostgreSQL
2. **Auth:** Add refresh tokens, session management
3. **Cache:** Add Redis for session/cache storage
4. **Queue:** Add Bull/BullMQ for background jobs
5. **Storage:** Add S3 for file uploads
6. **Monitoring:** Add Sentry for error tracking
7. **Analytics:** Add Mixpanel/Amplitude for user analytics

### Microservices Potential

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FUTURE MICROSERVICES                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Auth       │     │  Product    │     │  Order      │
│  Service    │     │  Service    │     │  Service    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────┴──────┐
                    │  API Gateway │
                    └─────────────┘
```

---

## Conclusion

ReCircuit's architecture is designed for:

1. **Rapid development** - Monolithic backend, simple database
2. **External data** - Free APIs for products and centers
3. **User experience** - Fast, responsive, accessible
4. **Security** - Multiple layers, JWT auth, validation
5. **Scalability** - Clear separation of concerns

The current architecture supports the MVP while leaving room for future enhancements.

---

*Last updated: August 2024*
