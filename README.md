# Propstream Express Backend (Phase 2)

A comprehensive Express.js API for property management and booking systems, supporting Phase 1-2 of Propstream.

## Features

- **Authentication**: JWT-based auth with email/password
- **Properties CRUD**: Manage property listings
- **Bookings Management**: Handle reservations and calendar sync  
- **Calendar Integration**: iCal import/export for platforms (Airbnb, Vrbo, Booking.com)
- **Message Templates**: Automated guest communications
- **Billing**: Payfast integration with webhooks (Stripe-ready)
- **Automation**: Make.com/Zapier webhook support

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Validation**: Joi schema validation
- **Calendar**: iCal support with `ics` and `node-ical`
- **Payment**: Payfast (South African payment gateway)

## Project Structure

```
propstream-api/
├── package.json
├── .env.example
├── src/
│   ├── server.js              # Main server entry point
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Property.js        # Property schema
│   │   ├── Booking.js         # Booking schema
│   │   ├── PlatformLink.js    # Platform integration links
│   │   ├── MessageTemplate.js # Email templates
│   │   └── Subscription.js    # Billing subscriptions
│   ├── utils/
│   │   ├── ics.js             # iCal generation utilities
│   │   └── payfast.js         # Payfast payment utilities
│   └── routes/
│       ├── auth.js            # Authentication routes
│       ├── properties.js      # Property management
│       ├── bookings.js        # Booking management
│       ├── calendar.js        # Calendar sync and iCal
│       ├── platforms.js       # Platform integrations
│       ├── messages.js        # Message templates
│       ├── billing.js         # Payment processing
│       ├── integrations.js    # Webhook automations
│       └── index.js           # Route aggregator
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your credentials:
# - MongoDB connection string
# - JWT secret
# - Payfast credentials (for billing)
```

### 3. Configure Environment Variables

Edit `.env` file with your actual values:

```env
PORT=4000
MONGODB_URI=mongodb+srv://your-user:your-password@cluster0.mongodb.net/propstream
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173

# Payfast Configuration (South African payments)
PAYFAST_MERCHANT_ID=your-merchant-id
PAYFAST_MERCHANT_KEY=your-merchant-key
PAYFAST_PASSPHRASE=your-passphrase
PAYFAST_MODE=sandbox # or 'live' for production
PAYFAST_RETURN_URL=http://localhost:5173/billing/success
PAYFAST_CANCEL_URL=http://localhost:5173/billing/cancel
PAYFAST_NOTIFY_URL=http://localhost:4000/api/billing/payfast/itn
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Start Production Server
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Properties
- `GET /api/properties` - List user's properties
- `POST /api/properties` - Create new property
- `GET /api/properties/:id` - Get property details
- `PATCH /api/properties/:id/calendars` - Update calendar URLs
- `DELETE /api/properties/:id` - Delete property

### Bookings
- `GET /api/bookings` - List bookings (optionally by property)
- `POST /api/bookings` - Create manual booking
- `POST /api/bookings/:id/cancel` - Cancel booking

### Calendar Integration
- `GET /api/calendar/:propertyId.ics?key=SECRET` - Public iCal feed
- `POST /api/calendar/import` - Import from platform iCal URLs

### Platform Integration
- `GET /api/platforms/:propertyId/ics-export` - Get secure iCal export URL

### Message Templates
- `GET /api/messages` - List templates
- `POST /api/messages` - Create template
- `PATCH /api/messages/:id` - Update template
- `DELETE /api/messages/:id` - Delete template

### Billing (Payfast)
- `POST /api/billing/payfast/session` - Create payment session
- `POST /api/billing/payfast/itn` - Webhook for payment notifications
- `GET /api/billing/me` - Get subscription status

### Automations
- `POST /api/integrations/make` - Webhook for Make.com/Zapier

## Calendar Sync Workflow

### For Property Owners:
1. Create property in Propstream
2. Get secure iCal export URL from `/api/platforms/:propertyId/ics-export`
3. Add this URL to external platforms (Airbnb, Vrbo, etc.) as calendar import
4. Add platform iCal URLs to property via `/api/properties/:id/calendars`
5. Trigger import via `/api/calendar/import` to sync external bookings

### Platform Integration:
- **Export TO platforms**: Use the secure `.ics` URL from Propstream
- **Import FROM platforms**: Configure platform iCal URLs and trigger imports

## Development Notes

- **Authentication**: All property/booking endpoints require JWT authentication
- **Security**: iCal feeds are protected with secret keys
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Request validation using Joi schemas
- **Calendar**: Handles recurring events and timezone-aware bookings
- **Payments**: Payfast-first with webhook validation and IP filtering
- **Extensibility**: Ready for Stripe integration and additional platforms

## Frontend Integration

This API is designed to work with a Vite React frontend. Example frontend calls:

```javascript
// Register/Login
const { token } = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
}).then(r => r.json());

// Authenticated requests
const properties = await fetch('/api/properties', {
  headers: { Authorization: `Bearer ${token}` }
}).then(r => r.json());

// Create Payfast payment form
const paymentData = await fetch('/api/billing/payfast/session', {
  method: 'POST',
  headers: { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ amount: '199.00' })
}).then(r => r.json());

// Render payment form (React example)
<form action={paymentData.process_url} method="post">
  {Object.entries(paymentData).map(([key, value]) => 
    key !== 'process_url' && (
      <input type="hidden" name={key} value={value} key={key} />
    )
  )}
  <button type="submit">Subscribe</button>
</form>
```

## Deployment

### Environment Variables for Production:
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production MongoDB URI
- Set Payfast to `live` mode with production credentials
- Configure proper CORS origins

### Security Considerations:
- iCal feeds use secret keys for access control
- Payfast webhooks validate signatures and source IPs
- JWT tokens have 7-day expiration
- Rate limiting and security headers via Helmet

## License

Private - Propstream Project Phase 2
