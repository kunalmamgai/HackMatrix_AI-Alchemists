# ReCircuit Folder Structure

## Overview

This document details the complete folder structure of the ReCircuit project, explaining the purpose of each directory and file.

---

## Root Structure

```
recircuit/
├── 📄 README.md                    # Main project documentation
├── 📄 CONTRIBUTING.md              # Contribution guidelines
├── 📄 LICENSE                      # MIT License
├── 📄 .gitignore                   # Git ignore rules
│
├── 📁 Code/                        # Frontend application
├── 📁 Backend/                     # Legacy Python backend (deprecated)
├── 📁 docs/                        # Documentation
└── 📁 .freebuff/                   # Development session files
```

---

## Frontend (`Code/`)

```
Code/
├── 📄 index.html                   # HTML entry point
├── 📄 package.json                 # Dependencies and scripts
├── 📄 vite.config.js               # Vite configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 .env                         # Environment variables
├── 📄 .env.example                 # Environment template
│
├── 📁 public/                      # Static assets
│   ├── 🖼️ favicon.svg              # Site favicon
│   ├── 🖼️ icons.svg                # SVG icon sprite
│   └── 📁 images/                  # Image assets
│       └── 📁 devices/             # Device photos
│           ├── smartphone.jpg
│           ├── laptop.jpg
│           ├── tablet.jpg
│           └── ...
│
├── 📁 src/                         # Source code
│   ├── 📄 App.jsx                  # Root component
│   ├── 📄 index.css                # Global styles
│   ├── 📄 main.jsx                 # Entry point
│   │
│   ├── 📁 components/              # Reusable UI components
│   │   ├── 📁 common/              # Shared components
│   │   ├── 📁 layout/              # Layout components
│   │   └── 📁 features/            # Feature-specific components
│   │
│   ├── 📁 pages/                   # Route components
│   │
│   ├── 📁 context/                 # React Context providers
│   │
│   ├── 📁 hooks/                   # Custom React hooks
│   │
│   ├── 📁 api/                     # API client functions
│   │
│   ├── 📁 data/                    # Static data files
│   │
│   ├── 📁 assets/                  # Images and media
│   │
│   └── 📁 utils/                   # Utility functions
│
└── 📁 server/                      # Backend API server
```

---

## Components (`Code/src/components/`)

```
components/
├── 📁 layout/                      # Layout components
│   ├── 📄 Navbar.jsx               # Navigation bar
│   ├── 📄 Footer.jsx               # Site footer
│   └── 📄 Breadcrumbs.jsx          # Breadcrumb navigation
│
├── 📁 common/                      # Shared components
│   ├── 📄 DeviceImage.jsx          # Device image with fallback
│   ├── 📄 Button.jsx               # Reusable button
│   ├── 📄 Card.jsx                 # Card container
│   ├── 📄 Modal.jsx                # Modal dialog
│   ├── 📄 Toast.jsx                # Toast notifications
│   └── 📄 Loading.jsx              # Loading spinner
│
├── 📁 home/                        # Homepage sections
│   ├── 📄 Hero.jsx                 # Hero section with WebGL
│   ├── 📄 HomeFeatures.jsx         # Feature cards
│   ├── 📄 ImpactStats.jsx          # Animated counters
│   ├── 📄 DrawerEstimator.jsx      # Device value estimator
│   ├── 📄 NearbyLocations.jsx      # Map preview
│   ├── 📄 DisposablesBar.jsx       # Marketplace preview
│   └── 📄 HomeCta.jsx              # Call to action
│
├── 📁 devices/                     # Device guide components
│   ├── 📄 DeviceSearch.jsx         # Search and filter
│   ├── 📄 DeviceGuide.jsx          # Step-by-step guide
│   └── 📄 DeviceCard.jsx           # Device card
│
├── 📁 map/                         # Map components
│   ├── 📄 MapComponent.jsx         # Leaflet map
│   ├── 📄 CenterMarker.jsx         # Custom marker
│   └── 📄 CenterCard.jsx           # Center info card
│
├── 📁 marketplace/                 # Marketplace components
│   ├── 📄 ProductGrid.jsx          # Product listing
│   ├── 📄 ProductCard.jsx          # Product card
│   └── 📄 ProductModal.jsx         # Product details
│
├── 📁 checkout/                    # Checkout components
│   ├── 📄 CheckoutForm.jsx         # Payment form
│   └── 📄 OrderSummary.jsx         # Order summary
│
└── 📁 chatbot/                     # Chatbot components
    └── 📄 FloatingChatbot.jsx      # AI chatbot
```

---

## Pages (`Code/src/pages/`)

```
pages/
├── 📄 Home.jsx                     # Homepage
├── 📄 DeviceSearchPage.jsx         # Device search and guide
├── 📄 NearbyLocationsPage.jsx      # Recycling centers map
├── 📄 DisposablesPage.jsx          # Marketplace
├── 📄 CheckoutPage.jsx             # Checkout flow
├── 📄 LoginPage.jsx                # Authentication
├── 📄 AboutPage.jsx                # About us
└── 📄 NotFoundPage.jsx             # 404 page
```

---

## Context (`Code/src/context/`)

```
context/
├── 📄 CartContext.jsx               # Shopping cart state
└── 📄 NotificationContext.jsx       # Toast notifications
```

---

## API (`Code/src/api/`)

```
api/
├── 📄 client.js                    # Base API client
├── 📄 external.js                  # External API integrations
└── 📄 products.js                  # Product API functions
```

---

## Data (`Code/src/data/`)

```
data/
├── 📄 devices.js                   # Device definitions
├── 📄 products.js                  # Seed product data
└── 📄 centers.js                   # Seed center data
```

---

## Assets (`Code/src/assets/`)

```
assets/
├── 🖼️ page.png                     # Homepage screenshot
├── 🖼️ hero.png                     # Hero image
├── 🖼️ devices.png                  # Device guide screenshot
├── 🖼️ map.png                      # Map screenshot
├── 🖼️ marketplace.png              # Marketplace screenshot
└── 📁 icons/                       # Icon assets
```

---

## Backend (`Code/server/`)

```
server/
├── 📄 package.json                 # Dependencies
├── 📄 .env                         # Environment variables
│
├── 📁 prisma/                      # Database schema
│   ├── 📄 schema.prisma            # Prisma schema
│   └── 📄 dev.db                   # SQLite database
│
├── 📁 src/                         # Source code
│   ├── 📄 index.js                 # Express app setup
│   │
│   ├── 📁 routes/                  # API routes
│   │   ├── 📄 auth.js              # Authentication routes
│   │   ├── 📄 products.js          # Product routes
│   │   ├── 📄 orders.js            # Order routes
│   │   ├── 📄 centers.js           # Center routes
│   │   ├── 📄 pickups.js           # Pickup routes
│   │   ├── 📄 reviews.js           # Review routes
│   │   └── 📄 webhooks.js          # Stripe webhooks
│   │
│   ├── 📁 middleware/              # Express middleware
│   │   ├── 📄 auth.js              # JWT verification
│   │   ├── 📄 validate.js          # Request validation
│   │   └── 📄 errorHandler.js      # Error handling
│   │
│   ├── 📁 utils/                   # Utility functions
│   │   ├── 📄 seed.js              # Database seeding
│   │   └── 📄 helpers.js           # Helper functions
│   │
│   └── 📁 services/                # External services
│       ├── 📄 stripe.js            # Stripe integration
│       └── 📄 google.js            # Google OAuth
│
└── 📁 .env.example                 # Environment template
```

---

## Documentation (`docs/`)

```
docs/
├── 📄 ARCHITECTURE.md              # System architecture
├── 📄 API.md                       # API documentation
├── 📄 SETUP.md                     # Development setup
├── 📄 FOLDER_STRUCTURE.md          # This file
└── 📄 DEPLOYMENT.md                # Deployment guide
```

---

## Key Files Explained

### Entry Points

| File | Purpose |
|------|---------|
| `Code/index.html` | HTML shell, loads React |
| `Code/src/main.jsx` | React entry, renders App |
| `Code/src/App.jsx` | Root component, routing |
| `Code/server/src/index.js` | Express server setup |

### Configuration Files

| File | Purpose |
|------|---------|
| `Code/vite.config.js` | Vite build config |
| `Code/tailwind.config.js` | Tailwind theme, fonts, colors |
| `Code/postcss.config.js` | PostCSS plugins |
| `Code/server/prisma/schema.prisma` | Database schema |

### State Management

| File | Purpose |
|------|---------|
| `Code/src/context/CartContext.jsx` | Cart items, totals, actions |
| `Code/src/context/NotificationContext.jsx` | Toast notifications |

### API Layer

| File | Purpose |
|------|---------|
| `Code/src/api/client.js` | Base fetch with auth headers |
| `Code/src/api/external.js` | Overpass, DummyJSON, FakeStore |
| `Code/src/api/products.js` | Product search functions |

---

## File Naming Conventions

### Components
- **PascalCase**: `DeviceSearch.jsx`, `ProductCard.jsx`
- **Descriptive**: Name describes what it renders

### Pages
- **PascalCase + Page**: `HomePage.jsx`, `DeviceSearchPage.jsx`

### Utilities
- **camelCase**: `formatPrice.js`, `validateEmail.js`

### Data
- **camelCase**: `devices.js`, `products.js`, `centers.js`

### Styles
- **kebab-case**: `index.css`, `components.css`

---

## Import Conventions

### Absolute Imports (Recommended)
```javascript
import Navbar from '@/components/layout/Navbar';
import CartContext from '@/context/CartContext';
import { fetchProducts } from '@/api/products';
```

### Relative Imports
```javascript
import Navbar from '../components/layout/Navbar';
import CartContext from '../context/CartContext';
```

---

## File Size Guidelines

| File Type | Recommended Max | Action if Exceeded |
|-----------|-----------------|-------------------|
| Component | 300 lines | Split into sub-components |
| Page | 200 lines | Extract sections to components |
| Utility | 100 lines | Split into multiple utilities |
| Data | 500 lines | Use JSON files or database |

---

## Adding New Files

### New Component
```bash
# Create component file
touch Code/src/components/feature/MyComponent.jsx

# Create test file (optional)
touch Code/src/components/feature/__tests__/MyComponent.test.jsx

# Create styles (optional)
touch Code/src/components/feature/MyComponent.module.css
```

### New Page
```bash
# Create page file
touch Code/src/pages/MyPage.jsx

# Add route in App.jsx
# Add nav link in Navbar.jsx
```

### New API Endpoint
```bash
# Create route file
touch Code/server/src/routes/myroute.js

# Register in index.js
# Add Prisma model if needed
```

---

## Maintenance Tips

### Finding Files
```bash
# Find component by name
find Code/src -name "*Device*"

# Find all API files
find Code/src/api -name "*.js"

# Find all pages
find Code/src/pages -name "*.jsx"
```

### Checking File Sizes
```bash
# Find large files
find Code/src -name "*.jsx" -o -name "*.js" | xargs wc -l | sort -rn | head -20
```

### Git Tracking
```bash
# See recently changed files
git log --oneline --name-only -10
```

---

*Last updated: August 2024*
