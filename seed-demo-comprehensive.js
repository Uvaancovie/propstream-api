import { connectNeonDB } from './src/config/neon.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  const neon = await connectNeonDB();
  
  console.log('🌱 Starting comprehensive seeding...');
  
  try {
    // Clear existing data
    console.log('🧹 Cleaning existing data...');
    await neon`DELETE FROM bookings`;
    await neon`DELETE FROM properties`;
    await neon`DELETE FROM users`;
    await neon`DELETE FROM newsletter_subscriptions`;
    
    // Reset sequences
    await neon`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
    await neon`ALTER SEQUENCE properties_id_seq RESTART WITH 1`;
    await neon`ALTER SEQUENCE bookings_id_seq RESTART WITH 1`;
    await neon`ALTER SEQUENCE newsletter_subscriptions_id_seq RESTART WITH 1`;
    
    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // 1. Create Realtors
    console.log('👔 Creating realtors...');
    const realtors = await neon`
      INSERT INTO users (name, email, password, role, created_at, updated_at)
      VALUES 
        ('Sarah Johnson', 'sarah.realtor@propstream.com', ${hashedPassword}, 'realtor', NOW(), NOW()),
        ('Mike Thompson', 'mike.realtor@propstream.com', ${hashedPassword}, 'realtor', NOW(), NOW()),
        ('Elena Rodriguez', 'elena.realtor@propstream.com', ${hashedPassword}, 'realtor', NOW(), NOW())
      RETURNING id, name, email, role
    `;
    
    console.log(`✅ Created ${realtors.length} realtors:`, realtors.map(r => r.name));
    
    // 2. Create Clients
    console.log('👥 Creating clients...');
    const clients = await neon`
      INSERT INTO users (name, email, password, role, created_at, updated_at)
      VALUES 
        ('John Smith', 'john.client@propstream.com', ${hashedPassword}, 'client', NOW(), NOW()),
        ('Emma Wilson', 'emma.client@propstream.com', ${hashedPassword}, 'client', NOW(), NOW()),
        ('David Brown', 'david.client@propstream.com', ${hashedPassword}, 'client', NOW(), NOW()),
        ('Lisa Chen', 'lisa.client@propstream.com', ${hashedPassword}, 'client', NOW(), NOW()),
        ('Alex Turner', 'alex.client@propstream.com', ${hashedPassword}, 'client', NOW(), NOW())
      RETURNING id, name, email, role
    `;
    
    console.log(`✅ Created ${clients.length} clients:`, clients.map(c => c.name));
    
    // 3. Create Properties for each realtor
    console.log('🏠 Creating properties...');
    
    const properties = [];
    
    // Sarah's properties
    const sarahProperties = await neon`
      INSERT INTO properties (
        name, address, city, description, price_per_night, max_guests, 
        bedrooms, bathrooms, amenities, images, user_id, created_at, updated_at
      )
      VALUES 
        (
          'Luxury Beachfront Villa',
          '123 Ocean Drive',
          'Miami Beach, FL',
          'Stunning oceanfront villa with private beach access, infinity pool, and breathtaking sunset views. Perfect for luxury getaways.',
          450,
          8,
          4,
          3,
          '["WiFi", "Pool", "Beach Access", "Air Conditioning", "Kitchen", "Parking", "Hot Tub", "Ocean View"]',
          '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6", "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"]',
          ${realtors[0].id},
          NOW(),
          NOW()
        ),
        (
          'Downtown Modern Loft',
          '456 Urban Street',
          'New York, NY',
          'Stylish loft in the heart of Manhattan with industrial design, exposed brick walls, and city skyline views.',
          280,
          4,
          2,
          2,
          '["WiFi", "Air Conditioning", "Kitchen", "Elevator", "City View", "Workspace", "Gym Access"]',
          '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", "https://images.unsplash.com/photo-1484154218962-a197022b5858"]',
          ${realtors[0].id},
          NOW(),
          NOW()
        )
      RETURNING id, name, user_id
    `;
    
    // Mike's properties  
    const mikeProperties = await neon`
      INSERT INTO properties (
        name, address, city, description, price_per_night, max_guests,
        bedrooms, bathrooms, amenities, images, user_id, created_at, updated_at
      )
      VALUES 
        (
          'Mountain Cabin Retreat',
          '789 Pine Ridge Road',
          'Aspen, CO',
          'Cozy log cabin nestled in the mountains with fireplace, hot tub, and spectacular mountain views. Ideal for winter skiing or summer hiking.',
          320,
          6,
          3,
          2,
          '["WiFi", "Fireplace", "Hot Tub", "Kitchen", "Parking", "Mountain View", "Ski Storage", "Hiking Trails"]',
          '["https://images.unsplash.com/photo-1449824913935-59a10b8d2000", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"]',
          ${realtors[1].id},
          NOW(),
          NOW()
        ),
        (
          'Historic Victorian Home',
          '321 Heritage Lane',
          'San Francisco, CA',
          'Beautifully restored Victorian home with original hardwood floors, bay windows, and modern amenities in historic neighborhood.',
          375,
          6,
          3,
          2,
          '["WiFi", "Kitchen", "Fireplace", "Garden", "Parking", "Historic Architecture", "Bay Windows"]',
          '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13", "https://images.unsplash.com/photo-1576941089067-2de3c901e126"]',
          ${realtors[1].id},
          NOW(),
          NOW()
        ),
        (
          'Lakeside Cottage',
          '654 Lakeshore Drive',
          'Lake Tahoe, CA',
          'Charming cottage right on the lake with private dock, kayaks, and panoramic lake views. Perfect for peaceful retreats.',
          225,
          4,
          2,
          1,
          '["WiFi", "Lake Access", "Dock", "Kayaks", "Kitchen", "Fireplace", "Lake View", "Fishing"]',
          '["https://images.unsplash.com/photo-1449824913935-59a10b8d2000", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"]',
          ${realtors[1].id},
          NOW(),
          NOW()
        )
      RETURNING id, name, user_id
    `;
    
    // Elena's properties
    const elenaProperties = await neon`
      INSERT INTO properties (
        name, address, city, description, price_per_night, max_guests,
        bedrooms, bathrooms, amenities, images, user_id, created_at, updated_at
      )
      VALUES 
        (
          'Desert Oasis Resort',
          '987 Cactus Boulevard',
          'Scottsdale, AZ',
          'Luxurious desert resort with private pool, spa, and stunning desert landscape views. Features modern Southwestern architecture.',
          395,
          10,
          5,
          4,
          '["WiFi", "Pool", "Spa", "Air Conditioning", "Kitchen", "Parking", "Desert View", "BBQ Grill", "Tennis Court"]',
          '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6", "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"]',
          ${realtors[2].id},
          NOW(),
          NOW()
        ),
        (
          'Urban Penthouse Suite',
          '147 Sky Tower',
          'Chicago, IL',
          'Spectacular penthouse with 360-degree city views, private terrace, and luxury amenities in prestigious downtown location.',
          520,
          6,
          3,
          3,
          '["WiFi", "City View", "Terrace", "Elevator", "Kitchen", "Gym Access", "Concierge", "Parking", "Luxury Finishes"]',
          '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", "https://images.unsplash.com/photo-1484154218962-a197022b5858"]',
          ${realtors[2].id},
          NOW(),
          NOW()
        )
      RETURNING id, name, user_id
    `;
    
    properties.push(...sarahProperties, ...mikeProperties, ...elenaProperties);
    console.log(`✅ Created ${properties.length} properties`);
    
    // 4. Create Bookings
    console.log('📅 Creating bookings...');
    
    const bookings = await neon`
      INSERT INTO bookings (
        property_id, client_id, check_in, check_out, guests, total_price,
        status, booking_reference, created_at, updated_at
      )
      VALUES 
        -- John's bookings
        (${properties[0].id}, ${clients[0].id}, '2025-09-15', '2025-09-20', 4, 2250, 'confirmed', 'BK001', NOW(), NOW()),
        (${properties[2].id}, ${clients[0].id}, '2025-10-10', '2025-10-15', 2, 1600, 'confirmed', 'BK002', NOW(), NOW()),
        
        -- Emma's bookings  
        (${properties[1].id}, ${clients[1].id}, '2025-09-05', '2025-09-08', 2, 840, 'confirmed', 'BK003', NOW(), NOW()),
        (${properties[4].id}, ${clients[1].id}, '2025-11-01', '2025-11-05', 3, 900, 'pending', 'BK004', NOW(), NOW()),
        
        -- David's bookings
        (${properties[3].id}, ${clients[2].id}, '2025-09-25', '2025-09-30', 4, 1875, 'confirmed', 'BK005', NOW(), NOW()),
        (${properties[6].id}, ${clients[2].id}, '2025-12-20', '2025-12-25', 6, 2600, 'pending', 'BK006', NOW(), NOW()),
        
        -- Lisa's bookings
        (${properties[5].id}, ${clients[3].id}, '2025-10-01', '2025-10-05', 8, 1580, 'confirmed', 'BK007', NOW(), NOW()),
        
        -- Alex's bookings
        (${properties[0].id}, ${clients[4].id}, '2025-11-15', '2025-11-18', 6, 1350, 'pending', 'BK008', NOW(), NOW())
      RETURNING id, booking_reference, status
    `;
    
    console.log(`✅ Created ${bookings.length} bookings`);
    
    // 5. Create Newsletter Subscriptions
    console.log('📧 Creating newsletter subscriptions...');
    
    const newsletters = await neon`
      INSERT INTO newsletter_subscriptions (email, subscribed_at)
      VALUES 
        ('newsletter1@example.com', NOW()),
        ('newsletter2@example.com', NOW()),
        ('newsletter3@example.com', NOW()),
        ('traveler@example.com', NOW()),
        ('property.lover@example.com', NOW())
      RETURNING email
    `;
    
    console.log(`✅ Created ${newsletters.length} newsletter subscriptions`);
    
    // 6. Display Summary
    console.log('\n🎉 SEEDING COMPLETE! Summary:');
    console.log('=' .repeat(50));
    console.log(`👔 Realtors: ${realtors.length}`);
    console.log(`👥 Clients: ${clients.length}`);
    console.log(`🏠 Properties: ${properties.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);
    console.log(`📧 Newsletter Subscriptions: ${newsletters.length}`);
    
    console.log('\n📋 TEST ACCOUNTS:');
    console.log('=' .repeat(50));
    console.log('🔐 Password for all accounts: password123\n');
    
    console.log('👔 REALTORS:');
    realtors.forEach(realtor => {
      console.log(`   • ${realtor.name} - ${realtor.email}`);
    });
    
    console.log('\n👥 CLIENTS:');
    clients.forEach(client => {
      console.log(`   • ${client.name} - ${client.email}`);
    });
    
    console.log('\n🏠 PROPERTIES BY REALTOR:');
    console.log(`   • Sarah Johnson: ${sarahProperties.length} properties`);
    console.log(`   • Mike Thompson: ${mikeProperties.length} properties`);  
    console.log(`   • Elena Rodriguez: ${elenaProperties.length} properties`);
    
    console.log('\n📅 BOOKING STATUS:');
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    console.log(`   • Confirmed: ${confirmed}`);
    console.log(`   • Pending: ${pending}`);
    
    console.log('\n🚀 READY TO TEST:');
    console.log('=' .repeat(50));
    console.log('1. Login as realtor → See dashboard with properties & bookings');
    console.log('2. Login as client → Browse properties & see your bookings');
    console.log('3. Public browsing → View all properties without login');
    console.log('4. Newsletter → Subscription system working');
    console.log('5. Role-based navigation → Different menus per role');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run the seeding
seedData()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
