# PropStream Calendar Demo Setup

This guide helps you quickly set up and demo the calendar sync functionality for realtors.

## Quick Start

### 1. Seed the Database
```bash
npm run seed
```
This creates:
- 3 demo users (realtors + admin)
- 4 sample properties in different locations
- 13 bookings (past, current, future + blocked dates)

### 2. Start the Server
```bash
npm run dev
```
Server will run on http://localhost:4000

### 3. Run API Demo
```bash
npm run demo
```
This demonstrates:
- User authentication
- Property & booking management
- Calendar export (.ics files)
- Platform integration setup
- Manual booking creation

## Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Realtor 1 | john.doe@realtor.com | password123 |
| Realtor 2 | jane.smith@realtor.com | password123 |
| Admin | admin@propstream.com | password123 |

## Sample Properties Created

1. **Luxury Beach House - Cape Town**
   - Ocean views, pool, beach access
   - Connected to Airbnb

2. **Modern City Apartment - Johannesburg**
   - Business district, security, gym
   - Connected to Booking.com

3. **Wine Estate Cottage - Stellenbosch**
   - Vineyard views, wine tasting
   - Connected to VRBO

4. **Safari Lodge Room - Kruger Area**
   - Wildlife viewing, safari tours
   - Multiple platform connections

## Calendar Sync Features to Demo

### 📤 Export Calendar
- Generate .ics files for each property
- Upload to booking platforms
- Prevent double bookings

### 📥 Import Bookings
- Connect Airbnb, Booking.com, VRBO calendars
- Automatic daily sync
- Real-time availability updates

### 📅 Booking Management
- View all bookings in one calendar
- Manual booking creation
- Blocked dates for maintenance
- Guest information tracking

## Demo Flow for Realtors

1. **Login** - Use demo credentials
2. **View Properties** - See all managed properties
3. **Check Calendar** - View bookings across properties
4. **Export Calendar** - Download .ics file
5. **Platform Setup** - Add calendar sync URLs
6. **Create Booking** - Add manual reservations
7. **Sync Demo** - Show automatic imports

## API Endpoints for Testing

```bash
# Authentication
POST /api/auth/login
POST /api/auth/register

# Properties
GET /api/properties
POST /api/properties
PUT /api/properties/:id
DELETE /api/properties/:id

# Bookings
GET /api/bookings
POST /api/bookings
PUT /api/bookings/:id
DELETE /api/bookings/:id

# Calendar
GET /api/calendar/export/:propertyId
POST /api/calendar/import

# Platform Links
GET /api/platforms/links
POST /api/platforms/links
DELETE /api/platforms/links/:id
```

## Files Generated for Demo

- `property_[id]_calendar.ics` - Exported calendar files
- Demo logs in console with booking details
- Sample platform integration URLs

## Troubleshooting

### Database Connection Issues
- Ensure MongoDB URI is correct in `.env`
- Check network connectivity to MongoDB Atlas

### Authentication Errors
- Verify JWT_SECRET is set in `.env`
- Check user credentials match seeded data

### Calendar Export Issues
- Ensure property exists before export
- Check file permissions for .ics creation

## Reset Demo Data

To start fresh:
```bash
npm run seed
```
This will clear and recreate all demo data.
