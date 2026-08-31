# ReCircuit API Documentation

## Overview

The ReCircuit API provides RESTful endpoints for e-waste management operations including authentication, products, orders, recycling centers, pickups, and reviews.

**Base URL:** `http://localhost:3001/api`

**Authentication:** Bearer token (JWT) in Authorization header

---

## Authentication

### POST /api/auth/google

Authenticate with Google OAuth and receive a session token.

**Request:**
```json
{
  "token": "google_oauth_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_session_token",
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://lh3.googleusercontent.com/..."
    }
  }
}
```

### GET /api/auth/profile

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://lh3.googleusercontent.com/...",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### PUT /api/auth/profile

Update the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "name": "John Updated",
  "avatar": "new_avatar_url"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "name": "John Updated",
    "avatar": "new_avatar_url"
  }
}
```

---

## Products

### GET /api/products

List all products with filtering, search, and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `search` | string | - | Search by name/description |
| `category` | string | - | Filter by category |
| `condition` | string | - | Filter by condition |
| `minPrice` | number | - | Minimum price (in paise) |
| `maxPrice` | number | - | Maximum price (in paise) |
| `sort` | string | "createdAt" | Sort field |
| `order` | string | "desc" | Sort order (asc/desc) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "name": "iPhone 13 Pro",
      "description": "Refurbished iPhone 13 Pro with 6-month warranty",
      "price": 6999900,
      "category": "Smartphones",
      "condition": "refurbished",
      "imageUrl": "/images/products/iphone13.jpg",
      "stock": 15,
      "rating": 4.5,
      "brand": "Apple",
      "source": "local"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### GET /api/products/:id

Get a single product by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "name": "iPhone 13 Pro",
    "description": "Refurbished iPhone 13 Pro with 6-month warranty",
    "price": 6999900,
    "category": "Smartphones",
    "condition": "refurbished",
    "imageUrl": "/images/products/iphone13.jpg",
    "stock": 15,
    "rating": 4.5,
    "brand": "Apple",
    "source": "local",
    "reviews": [
      {
        "id": "clx9876543210",
        "rating": 5,
        "comment": "Excellent condition!",
        "user": {
          "name": "Jane Doe"
        }
      }
    ]
  }
}
```

### POST /api/products

Create a new product (admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "MacBook Air M2",
  "description": "Refurbished MacBook Air with M2 chip",
  "price": 8999900,
  "category": "Laptops",
  "condition": "refurbished",
  "imageUrl": "/images/products/macbook.jpg",
  "stock": 10,
  "brand": "Apple"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567891",
    "name": "MacBook Air M2",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### PUT /api/products/:id

Update a product (admin only).

**Request:** Same as POST

**Response:** Updated product object

### DELETE /api/products/:id

Delete a product (admin only).

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Orders

### POST /api/orders

Create a new order and initiate Stripe checkout.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "items": [
    {
      "productId": "clx1234567890",
      "quantity": 1
    },
    {
      "productId": "clx1234567891",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "phone": "9876543210"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "clx1234567892",
    "stripeSessionId": "cs_test_abc123",
    "checkoutUrl": "https://checkout.stripe.com/...",
    "total": 24999700
  }
}
```

### GET /api/orders

List all orders for the authenticated user.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `status` | string | - | Filter by status |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567892",
      "total": 24999700,
      "status": "completed",
      "stripeId": "pi_abc123",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "items": [
        {
          "product": {
            "name": "iPhone 13 Pro",
            "imageUrl": "/images/products/iphone13.jpg"
          },
          "quantity": 1,
          "price": 6999900
        }
      ]
    }
  ]
}
```

### GET /api/orders/:id

Get a single order by ID.

**Response:** Single order object with full details

### POST /api/orders/:id/pay

Process payment for an order (manual payment flow).

**Request:**
```json
{
  "paymentMethod": "card",
  "card": {
    "number": "4242424242424242",
    "expMonth": 12,
    "expYear": 2025,
    "cvc": "123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "clx1234567892",
    "status": "completed",
    "paymentId": "pi_abc123"
  }
}
```

---

## Centers

### GET /api/centers

List all recycling centers.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `lat` | number | - | User latitude |
| `lng` | number | - | User longitude |
| `radius` | number | 50 | Search radius in km |
| `services` | string | - | Comma-separated services |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567893",
      "name": "EcoRecycle Mumbai",
      "address": "Andheri East, Mumbai",
      "latitude": 19.1136,
      "longitude": 72.8697,
      "phone": "9876543211",
      "email": "info@ecorecycle.in",
      "hours": "Mon-Sat: 9AM-6PM",
      "services": ["recycling", "repair", "refurbishment"],
      "rating": 4.7,
      "distance": 2.3,
      "source": "local"
    }
  ]
}
```

### GET /api/centers/:id

Get a single center by ID.

**Response:** Single center object with reviews

### POST /api/centers

Create a new center (admin only).

**Request:**
```json
{
  "name": "GreenTech Solutions",
  "address": "Koramangala, Bangalore",
  "latitude": 12.9352,
  "longitude": 77.6245,
  "phone": "9876543212",
  "email": "contact@greentech.in",
  "hours": "Mon-Sat: 10AM-7PM",
  "services": ["recycling", "pickup"]
}
```

**Response:** Created center object

---

## Pickups

### POST /api/pickups

Schedule a pickup request.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "device": "Laptop",
  "brand": "Dell",
  "model": "XPS 15",
  "condition": "not working",
  "centerId": "clx1234567893",
  "preferredDate": "2024-01-20",
  "preferredTime": "10:00-12:00",
  "address": {
    "street": "456 Park Ave",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400002"
  },
  "notes": "Laptop has a cracked screen"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567894",
    "status": "pending",
    "device": "Laptop",
    "preferredDate": "2024-01-20",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /api/pickups

List all pickups for the authenticated user.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | - | Filter by status |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567894",
      "device": "Laptop",
      "brand": "Dell",
      "condition": "not working",
      "status": "scheduled",
      "preferredDate": "2024-01-20",
      "center": {
        "name": "EcoRecycle Mumbai"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### PUT /api/pickups/:id

Update pickup status (admin only).

**Request:**
```json
{
  "status": "completed",
  "notes": "Device collected successfully"
}
```

**Response:** Updated pickup object

---

## Reviews

### POST /api/reviews

Create a review for a product or center.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "productId": "clx1234567890",
  "rating": 5,
  "comment": "Excellent refurbished phone! Works like new."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567895",
    "rating": 5,
    "comment": "Excellent refurbished phone! Works like new.",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /api/reviews/product/:productId

Get all reviews for a product.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567895",
      "rating": 5,
      "comment": "Excellent refurbished phone!",
      "user": {
        "name": "Jane Doe",
        "avatar": "https://..."
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "averageRating": 4.5,
    "totalReviews": 12
  }
}
```

### GET /api/reviews/center/:centerId

Get all reviews for a recycling center.

**Response:** Similar to product reviews

---

## Webhooks

### POST /api/webhooks/stripe

Stripe webhook endpoint for payment events.

**Headers:**
```
Stripe-Signature: <webhook_signature>
```

**Events Handled:**
- `checkout.session.completed` → Update order status to "completed"
- `payment_intent.payment_failed` → Update order status to "failed"
- `charge.refunded` → Update order status to "refunded"

**Response:** `200 OK`

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "email": "Invalid email format",
      "price": "Price must be positive"
    }
  }
}
```

### Authentication Error
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### Not Found Error
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Product not found"
  }
}
```

### Rate Limit Error
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 15 minutes |
| Auth endpoints | 10 requests | 15 minutes |
| Order creation | 5 requests | 1 hour |

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Meta:**
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Sorting

**Query Parameters:**
- `sort`: Field to sort by (default: `createdAt`)
- `order`: Sort order (`asc` or `desc`, default: `desc`)

**Example:**
```
GET /api/products?sort=price&order=asc
```

---

## Filtering

**Query Parameters:**
- `category`: Filter by category
- `condition`: Filter by condition
- `minPrice`: Minimum price (in paise)
- `maxPrice`: Maximum price (in paise)
- `search`: Full-text search

**Example:**
```
GET /api/products?category=Smartphones&condition=refurbished&minPrice=1000000&maxPrice=5000000
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |

---

*Last updated: August 2024*
