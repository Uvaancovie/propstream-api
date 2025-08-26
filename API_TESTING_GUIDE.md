# Propstream API Testing Guide

This file contains examples of how to test all API endpoints with sample requests and expected responses.

## Getting Started

1. Start the server: `npm run dev`
2. API will be available at: http://localhost:4000
3. Visit http://localhost:4000 for full endpoint documentation

## Testing Authentication

### 1. Register a new user
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Expected Response:
```json
{
  "message": "✅ Registration successful! Welcome to Propstream!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  },
  "nextSteps": [
    "Save your token for authenticated requests",
    "Create your first property: POST /api/properties",
    "Set up calendar integrations for bookings"
  ]
}
```

### 2. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Get current user profile (requires auth)
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing Properties

### 1. Create a property
```bash
curl -X POST http://localhost:4000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Beach House Villa",
    "address": "123 Ocean Drive, Cape Town",
    "description": "Beautiful beachfront property with stunning ocean views",
    "amenities": ["WiFi", "Pool", "Kitchen", "Air Conditioning", "Parking"]
  }'
```

### 2. List all properties
```bash
curl -X GET http://localhost:4000/api/properties \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get specific property
```bash
curl -X GET http://localhost:4000/api/properties/PROPERTY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Update property calendar URLs
```bash
curl -X PATCH http://localhost:4000/api/properties/PROPERTY_ID/calendars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "airbnbImportUrl": "https://calendar.airbnb.com/calendar/ical/12345.ics",
    "vrboImportUrl": "https://www.vrbo.com/calendar/ical/67890.ics"
  }'
```

## Testing Bookings

### 1. Create a manual booking
```bash
curl -X POST http://localhost:4000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "propertyId": "YOUR_PROPERTY_ID",
    "start": "2024-01-15T15:00:00Z",
    "end": "2024-01-22T11:00:00Z",
    "guestName": "John Smith",
    "guestEmail": "john.smith@example.com",
    "notes": "Honeymoon vacation - late checkout requested"
  }'
```

### 2. List all bookings
```bash
curl -X GET http://localhost:4000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. List bookings for specific property
```bash
curl -X GET "http://localhost:4000/api/bookings?propertyId=YOUR_PROPERTY_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Cancel a booking
```bash
curl -X POST http://localhost:4000/api/bookings/BOOKING_ID/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing Calendar Integration

### 1. Get secure iCal export URL
```bash
curl -X GET http://localhost:4000/api/platforms/PROPERTY_ID/ics-export \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Import calendar from external platform
```bash
curl -X POST http://localhost:4000/api/calendar/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "propertyId": "YOUR_PROPERTY_ID",
    "url": "https://calendar.airbnb.com/calendar/ical/12345.ics",
    "platform": "airbnb"
  }'
```

### 3. Access public iCal feed (no auth required)
```bash
curl -X GET "http://localhost:4000/api/calendar/PROPERTY_ID.ics?key=YOUR_ICAL_SECRET"
```

## Testing Message Templates

### 1. Create a message template
```bash
curl -X POST http://localhost:4000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Welcome Message",
    "subject": "Welcome to {{propertyTitle}}",
    "body": "Dear {{guestName}},\n\nWelcome to your stay at {{propertyTitle}}! Your check-in is on {{checkIn}}.\n\nEnjoy your stay!",
    "variables": ["guestName", "propertyTitle", "checkIn"]
  }'
```

### 2. List message templates
```bash
curl -X GET http://localhost:4000/api/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing Billing (Payfast)

### 1. Create payment session
```bash
curl -X POST http://localhost:4000/api/billing/payfast/session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": "199.00",
    "item_name": "Propstream Starter Plan"
  }'
```

### 2. Check subscription status
```bash
curl -X GET http://localhost:4000/api/billing/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing Webhooks

### 1. Make.com/Zapier webhook
```bash
curl -X POST http://localhost:4000/api/integrations/make \
  -H "Content-Type: application/json" \
  -d '{
    "event": "booking_created",
    "data": {
      "propertyId": "123",
      "guestEmail": "test@example.com"
    }
  }'
```

## Health Check

```bash
curl -X GET http://localhost:4000/health
```

## Common Testing Scenarios

### Full Workflow Test:
1. Register/Login → Get JWT token
2. Create property → Get property ID
3. Create booking for that property
4. Get iCal export URL
5. List all bookings
6. Create message template
7. Check billing status

### Error Testing:
- Try endpoints without auth token
- Try invalid property IDs
- Try invalid date formats
- Try missing required fields

## Notes for Frontend Integration

- All authenticated endpoints require `Authorization: Bearer <token>` header
- Tokens expire in 7 days
- Property iCal secrets should be kept secure
- Calendar sync is manual for now (can be automated later)
- Payfast integration requires sandbox/live credentials in .env file

## Environment Variables Required

Make sure your `.env` file has:
```
MONGODB_URI=mongodb://localhost:27017/propstream
JWT_SECRET=your-super-secret-key
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
# ... other Payfast settings
```
