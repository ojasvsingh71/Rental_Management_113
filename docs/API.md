# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "role": "CUSTOMER",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
}
```

#### POST /auth/signin
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Get current user information (Protected).

### Products

#### GET /product
Get all products with optional pagination.

**Query Parameters:**
- `skip`: Number of items to skip (default: 0)
- `take`: Number of items to take (default: 20)

#### POST /product
Create a new product (Admin only).

**Request Body:**
```json
{
  "name": "Power Drill Pro",
  "description": "Professional grade power drill",
  "category": "Power Tools",
  "unitType": "piece",
  "basePrice": 50.00,
  "stock": 10
}
```

#### PUT /product/:id
Update a product (Admin only).

#### DELETE /product/:id
Delete a product (Admin only).

### Rentals

#### GET /rental
Get all rentals (Admin only).

#### GET /rental/my
Get current user's rentals.

#### POST /rental
Create a new rental.

**Request Body:**
```json
{
  "productId": "product-id",
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-20T10:00:00Z"
}
```

#### PUT /rental/:id/status
Update rental status.

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

### Dashboard

#### GET /admin/dashboard
Get dashboard statistics (Admin only).

**Response:**
```json
{
  "totalUsers": 150,
  "totalProducts": 45,
  "totalRentals": 230,
  "totalRevenue": 15000
}
```

### Notifications

#### GET /notification
Get user's notifications.

#### POST /notification
Create a notification (Admin only).

#### PUT /notification/:id/read
Mark notification as read/unread.

### Payments

#### GET /payment/my
Get user's payments.

#### POST /payment
Create a payment record.

### Error Responses

All endpoints may return these error responses:

#### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": ["Field 'email' is required"]
}
```

#### 401 Unauthorized
```json
{
  "message": "Invalid token"
}
```

#### 403 Forbidden
```json
{
  "message": "Access denied. Admins only."
}
```

#### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- Admin endpoints: 200 requests per minute

## Pagination

List endpoints support pagination with these query parameters:
- `skip`: Number of items to skip
- `take`: Number of items to return (max 100)

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "skip": 0,
    "take": 20,
    "total": 150
  }
}
```