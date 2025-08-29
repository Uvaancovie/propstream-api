import { config } from 'dotenv';
import { getSQL, connectNeonDB } from './src/config/neon.js';

// Load environment variables
config();

async function addPropertyColumns() {
  // Connect to database first
  await connectNeonDB(process.env.DATABASE_URL);
  const sql = getSQL();
  
  try {
    console.log('🔄 Adding new columns to properties table...');
    
    // Add new columns to properties table
    await sql`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS property_type VARCHAR(50) DEFAULT 'apartment',
      ADD COLUMN IF NOT EXISTS available_from DATE,
      ADD COLUMN IF NOT EXISTS available_to DATE,
      ADD COLUMN IF NOT EXISTS realtor_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS realtor_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS realtor_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true
    `;
    
    console.log('✅ Successfully added new columns to properties table');
    
    // Update existing properties with default realtor info from users table
    console.log('🔄 Updating existing properties with realtor information...');
    
    await sql`
      UPDATE properties 
      SET 
        realtor_name = users.name,
        realtor_email = users.email,
        property_type = 'apartment',
        is_available = true
      FROM users 
      WHERE properties.user_id = users.id 
      AND (properties.realtor_name IS NULL OR properties.realtor_name = '')
    `;
    
    console.log('✅ Updated existing properties with realtor information');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
addPropertyColumns()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
