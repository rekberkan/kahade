# Kahade API Documentation

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.kahade.com/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": {},
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## Endpoints

For detailed endpoint documentation, visit the Swagger UI at `/api/v1/docs`

## Rate Limiting

- Short: 3 requests per second
- Medium: 20 requests per 10 seconds
- Long: 100 requests per minute

## Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error
