import dotenv from 'dotenv';
import { connectNeonDB, getSQL } from './src/config/neon.js';

// Load environment variables
dotenv.config();

async function setupDatabase() {
  try {
    // Connect to database first
    await connectNeonDB();
    const sql = getSQL();
    
    console.log('🔧 Setting up database schema...');
    
    // Add role column to users table if it doesn't exist
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'realtor'))
    `;
    console.log('✅ Added role column to users table');
    
    // Update existing users to have client role if null
    await sql`
      UPDATE users SET role = 'client' WHERE role IS NULL
    `;
    console.log('✅ Updated existing users with default role');
    
    // Add newsletter subscription table
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        subscribed_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
      )
    `;
    console.log('✅ Created newsletter_subscriptions table');
    
    // Add realtor_id column to properties table
    await sql`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS realtor_id INTEGER REFERENCES users(id)
    `;
    console.log('✅ Added realtor_id column to properties table');
    
    // Update existing properties to link to a user
    await sql`
      UPDATE properties 
      SET realtor_id = user_id 
      WHERE realtor_id IS NULL AND user_id IS NOT NULL
    `;
    console.log('✅ Updated existing properties with realtor_id');
    
    // Add guest_count column to bookings if it doesn't exist
    await sql`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS guest_count INTEGER DEFAULT 1
    `;
    console.log('✅ Added guest_count column to bookings table');
    
    // Add notes column to bookings if it doesn't exist
    await sql`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS notes TEXT
    `;
    console.log('✅ Added notes column to bookings table');
    
    console.log('✅ Database schema updated successfully');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  }
}

// Run the setup
setupDatabase().catch(console.error);
