import { neon } from '@neondatabase/serverless';

let sql;

export async function connectNeonDB(databaseUrl) {
  try {
    sql = neon(databaseUrl);
    
    // Test the connection
    const result = await sql`SELECT version()`;
    console.log('✅ Neon PostgreSQL connected');
    console.log('📊 Database version:', result[0].version);
    
    // Create tables if they don't exist
    await createTables();
    
    return sql;
  } catch (error) {
    console.error('❌ Failed to connect to Neon PostgreSQL:', error);
    throw error;
  }
}

async function createTables() {
  try {
    // Drop existing tables (for clean setup)
    await sql`DROP TABLE IF EXISTS platform_links CASCADE`;
    await sql`DROP TABLE IF EXISTS subscriptions CASCADE`;
    await sql`DROP TABLE IF EXISTS message_templates CASCADE`;
    await sql`DROP TABLE IF EXISTS bookings CASCADE`;
    await sql`DROP TABLE IF EXISTS properties CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    
    // Users table
    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Properties table
    await sql`
      CREATE TABLE properties (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        city VARCHAR(255),
        price_per_night DECIMAL(10,2),
        max_guests INTEGER,
        bedrooms INTEGER,
        bathrooms INTEGER,
        amenities JSONB DEFAULT '[]',
        images JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Bookings table
    await sql`
      CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        guest_name VARCHAR(255) NOT NULL,
        guest_email VARCHAR(255) NOT NULL,
        guest_phone VARCHAR(50),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_price DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'confirmed',
        platform VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Message templates table
    await sql`
      CREATE TABLE message_templates (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        trigger_event VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Subscriptions table
    await sql`
      CREATE TABLE subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        current_period_start DATE,
        current_period_end DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Platform links table
    await sql`
      CREATE TABLE platform_links (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        platform VARCHAR(100) NOT NULL,
        calendar_url TEXT,
        export_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Database tables created/verified');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

export function getSQL() {
  if (!sql) {
    throw new Error('Database not connected. Call connectNeonDB first.');
  }
  return sql;
}

export { sql };
