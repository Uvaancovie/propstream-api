import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectNeonDB } from './config/neon.js';
import api from './routes/index.js';

dotenv.config();

const app = express();
app.use(helmet());

// Configure CORS to allow multiple frontend ports during development
const allowedOrigins = [
  'http://localhost:3000', // Next.js app
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:3006',
  'http://localhost:5173', // Vite React app
  'http://localhost:5174',
  process.env.CLIENT_URL,
  // Production frontend URLs
  'https://propstream-frontend.vercel.app',
  'https://propstream-frontend-git-main-uvaancovies-projects.vercel.app',
  'https://propstream-frontend-*.vercel.app' // All Vercel preview deployments
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Check for exact match or Vercel domain pattern
    if (allowedOrigins.includes(origin) || 
        (origin && origin.includes('propstream-frontend') && origin.includes('vercel.app'))) {
      return callback(null, true);
    }
    
    // Log rejected origins for debugging
    console.log('CORS rejected origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Welcome route
app.get('/', (_req, res) => {
  res.json({
    message: "🚀 Welcome to Propstream API",
    version: "0.1.0",
    description: "Property management and booking system API",
    endpoints: {
      health: "GET /health - Check API health",
      auth: {
        register: "POST /api/auth/register - Register new user",
        login: "POST /api/auth/login - User login",
        me: "GET /api/auth/me - Get current user (requires auth)"
      },
      properties: {
        list: "GET /api/properties - List user properties (requires auth)",
        create: "POST /api/properties - Create property (requires auth)",
        get: "GET /api/properties/:id - Get property details (requires auth)",
        updateCalendars: "PATCH /api/properties/:id/calendars - Update calendar URLs (requires auth)",
        delete: "DELETE /api/properties/:id - Delete property (requires auth)"
      },
      bookings: {
        list: "GET /api/bookings - List bookings (requires auth)",
        create: "POST /api/bookings - Create manual booking (requires auth)",
        cancel: "POST /api/bookings/:id/cancel - Cancel booking (requires auth)"
      },
      calendar: {
        export: "GET /api/calendar/:propertyId.ics?key=SECRET - Public iCal feed",
        import: "POST /api/calendar/import - Import from platform iCal URLs (requires auth)"
      },
      platforms: {
        icsExport: "GET /api/platforms/:propertyId/ics-export - Get secure iCal export URL (requires auth)"
      },
      messages: {
        list: "GET /api/messages - List message templates (requires auth)",
        create: "POST /api/messages - Create message template (requires auth)",
        update: "PATCH /api/messages/:id - Update message template (requires auth)",
        delete: "DELETE /api/messages/:id - Delete message template (requires auth)"
      },
      billing: {
        session: "POST /api/billing/payfast/session - Create Payfast payment session (requires auth)",
        webhook: "POST /api/billing/payfast/itn - Payfast webhook (for payment notifications)",
        status: "GET /api/billing/me - Get subscription status (requires auth)"
      },
      integrations: {
        make: "POST /api/integrations/make - Webhook for Make.com/Zapier"
      }
    },
    documentation: {
      sampleRequests: {
        register: {
          method: "POST",
          url: "/api/auth/register",
          body: {
            email: "test@example.com",
            password: "password123",
            name: "Test User"
          }
        },
        login: {
          method: "POST",
          url: "/api/auth/login",
          body: {
            email: "test@example.com",
            password: "password123"
          }
        },
        createProperty: {
          method: "POST",
          url: "/api/properties",
          headers: {
            Authorization: "Bearer YOUR_JWT_TOKEN"
          },
          body: {
            title: "Beach House",
            address: "123 Ocean Drive",
            description: "Beautiful beachfront property",
            amenities: ["WiFi", "Pool", "Kitchen"]
          }
        }
      }
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (_req, res) => res.json({ 
  ok: true, 
  message: "✅ API is healthy and running!",
  timestamp: new Date().toISOString(),
  uptime: process.uptime()
}));

app.use('/api', api);

// Catch-all for undefined routes
app.use('*', (_req, res) => {
  res.status(404).json({
    error: "🔍 Route not found",
    message: "The requested endpoint does not exist",
    suggestion: "Visit GET / for available endpoints documentation",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 4000;

console.log('🔧 Starting server...');
console.log('🔧 PORT:', PORT);
console.log('🔧 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

connectNeonDB(process.env.DATABASE_URL).then(() => {
  // Start the server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
    console.log(`🚀 Server listening on all interfaces (0.0.0.0:${PORT})`);
  });
}).catch((error) => {
  console.error('❌ Failed to connect to database:', error);
  process.exit(1);
});
