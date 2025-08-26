// CORS middleware for Express backend
// This file should be added to your Express backend to allow cross-origin requests from the Next.js frontend

const corsMiddleware = (req, res, next) => {
  // Define allowed origins
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:5173',  // Vite dev server
    'https://propstream-frontend.vercel.app',  // Your Vercel deployment
    'https://propstream-frontend-*.vercel.app' // Vercel preview deployments
  ];
  
  // Check if the origin is in the allowed list or if it's a Vercel deployment
  const origin = req.headers.origin;
  const isVercelDomain = origin && origin.includes('propstream-frontend') && origin.includes('vercel.app');
  
  if (origin && (allowedOrigins.includes(origin) || isVercelDomain)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // Allow all origins in development, specific origin in production
    res.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://propstream-frontend.vercel.app' : '*');
  }
  
  // Allow specific headers
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token'
  );
  
  // Allow specific methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

module.exports = corsMiddleware;
