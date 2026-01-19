# API Usage Examples

## Authentication

### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123",
    "phone": "+628123456789"
  }'
```

Response:
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

## Transactions

### Create Transaction

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "550e8400-e29b-41d4-a716-446655440001",
    "title": "iPhone 14 Pro Max",
    "description": "Brand new iPhone 14 Pro Max 256GB",
    "amount": 15000000,
    "currency": "IDR"
  }'
```

### Get All Transactions

```bash
curl -X GET "http://localhost:3000/api/v1/transactions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Confirm Payment

```bash
curl -X POST http://localhost:3000/api/v1/transactions/TRANSACTION_ID/confirm-payment \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Release Funds

```bash
curl -X POST http://localhost:3000/api/v1/transactions/TRANSACTION_ID/release-funds \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Disputes

### Create Dispute

```bash
curl -X POST http://localhost:3000/api/v1/disputes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "550e8400-e29b-41d4-a716-446655440000",
    "reason": "Product not as described",
    "description": "The product received is different from the description"
  }'
```

### Get Dispute

```bash
curl -X GET http://localhost:3000/api/v1/disputes/DISPUTE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Notifications

### Get All Notifications

```bash
curl -X GET "http://localhost:3000/api/v1/notifications?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mark as Read

```bash
curl -X PUT http://localhost:3000/api/v1/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## User Profile

### Get Profile

```bash
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "phone": "+628123456789",
    "bio": "Updated bio"
  }'
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": {
    "email": "email must be an email",
    "password": "password must be longer than or equal to 8 characters"
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Invalid or expired token",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```
