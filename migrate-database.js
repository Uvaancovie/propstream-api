import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const runMigration = async () => {
  console.log('🔧 Running database migration...');
  
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('📋 Adding role column to users table...');
    
    // Add role column to users table
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'realtor'))
    `;
    
    console.log('✅ Added role column to users table');
    
    // Update existing users to have default role
    const result = await sql`
      UPDATE users 
      SET role = 'client' 
      WHERE role IS NULL
    `;
    
    console.log(`✅ Updated ${result.length} existing users with default role`);
    
    // Create newsletter_subscriptions table if it doesn't exist
    console.log('📧 Creating newsletter_subscriptions table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT true
      )
    `;
    
    console.log('✅ Created newsletter_subscriptions table');
    
    // Add realtor_id to properties table if it doesn't exist  
    console.log('🏠 Updating properties table...');
    
    await sql`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS realtor_id INTEGER REFERENCES users(id)
    `;
    
    // Update existing properties to link with user_id
    await sql`
      UPDATE properties 
      SET realtor_id = user_id 
      WHERE realtor_id IS NULL AND user_id IS NOT NULL
    `;
    
    console.log('✅ Updated properties table with realtor_id');
    
    // Verify tables
    console.log('🔍 Verifying database schema...');
    
    const users = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`;
    const properties = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'properties'`;
    const newsletters = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'newsletter_subscriptions'`;
    
    console.log('📋 Users table columns:', users.map(c => c.column_name));
    console.log('📋 Properties table columns:', properties.map(c => c.column_name));
    console.log('📋 Newsletter table columns:', newsletters.map(c => c.column_name));
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('✅ Database is now ready for role-based authentication');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Run the migration
runMigration()
  .then(() => {
    console.log('✅ Database migration completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
