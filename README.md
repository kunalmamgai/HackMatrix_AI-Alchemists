# 🌍 Smart E-Waste Disposal Platform (EcoWaste)

A modern, production-level React application designed to help users responsibly dispose of electronic waste through guidance, location discovery, and a pickup/reuse network.

## 🎯 Project Overview

EcoWaste is an award-winning UI/UX platform that simplifies e-waste disposal and promotes circular economy principles. Users can search for proper disposal methods, find nearby recycling centers, schedule pickups, and participate in our repair and reuse network.

## ✨ Key Features

### 1. **Landing Page (Hero Section)**
- Bold, engaging headline: "Dispose Smarter. Reuse Better. Save the Planet."
- Clean hero with gradients and glassmorphism effects
- Smooth animations and micro-interactions
- Call-to-action buttons with hover effects
- Animated statistics showing impact

### 2. **Device Search & Disposal Guide**
- Comprehensive database of 6+ device types (phones, laptops, batteries, etc.)
- Detailed disposal instructions with step-by-step guides
- Safety tips and hazard warnings
- Device categorization (Recycle/Reuse/Hazardous)
- Recent searches feature with local storage
- Real-time search filtering

### 3. **Nearby Drop-off Locations**
- Interactive map placeholder UI with location pins
- 6 mock recycling centers with real-time information
- Cards showing distance, ratings, hours, contact info, and services
- Sorting (by distance, rating, reviews)
- Service filtering

### 4. **Pickup & Reuse Network**
- Multi-step form (3-step wizard)
- Choose between Verified Recycler or Repair Enthusiast
- Step-by-step pickup scheduling
- Form validation and progress tracking
- Success confirmation with toast notifications

### 5. **Circular Economy Section**
- Visual Reduce → Reuse → Recycle flow
- Environmental impact statistics
- 5-step action guide for users
- Animated rotating icons and flows

### 6. **Navigation & Footer**
- Sticky navbar with logo and navigation
- Dark/Light mode toggle
- Mobile-responsive hamburger menu
- Rich footer with brand, links, and contact info

### 7. **User Experience Enhancements**
- ✅ Dark mode toggle (with localStorage persistence)
- ✅ Smooth animations (Framer Motion)
- ✅ Responsive design (mobile-first)
- ✅ Micro-interactions
- ✅ Toast notifications
- ✅ Accessibility optimized

## 🛠️ Tech Stack

- **React 18+** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS 3** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **npm** - Package manager

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Navigation with theme toggle
│   ├── Hero.jsx            # Landing page hero
│   ├── DeviceSearch.jsx    # Device search & guide
│   ├── NearbyLocations.jsx # Recycling centers
│   ├── PickupNetwork.jsx   # Pickup scheduling
│   ├── CircularEconomy.jsx # Circular economy info
│   ├── Footer.jsx          # Footer
│   └── Toast.jsx           # Notifications
├── App.jsx                  # Main app
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## 🚀 Getting Started

### Installation

```bash
npm install
npm run dev
```

Open `http://localhost:5174/` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🎨 Features Highlight

- **6+ Device Types** with detailed disposal guides
- **6 Mock Recycling Centers** with real information
- **3-Step Pickup Wizard** with validation
- **Interactive Map UI** with location pins
- **Recent Searches** with local storage
- **Dark/Light Mode** toggle
- **Fully Responsive** design
- **Smooth Animations** throughout
- **Accessibility Ready**

## 📱 Responsive Design

- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

## 🌙 Dark Mode

Press the sun/moon icon in the navbar to toggle dark mode. Your preference is saved in localStorage.

## 📊 Performance

- CSS: ~5.8 KB (gzip)
- JavaScript: ~115 KB (gzip)
- Total bundle: ~121 KB (gzip)

## 🎓 Key Learning Points

- Modern React hooks and functional components
- Tailwind CSS utility-first approach
- Framer Motion animations
- Component composition and reusability
- Responsive design patterns
- Form handling and validation
- LocalStorage integration
- Toast notifications
- Accessibility best practices

---

**Made with ❤️ for a sustainable future** 🌍♻️
