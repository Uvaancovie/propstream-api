import dotenv from 'dotenv';
import { connectNeonDB, getSQL } from './src/config/neon.js';
import User from './src/models/User.js';
import Property from './src/models/Property.js';
import Booking from './src/models/Booking.js';

dotenv.config();

async function seedDemoDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding for client demo...');
    
    // Connect to database
    await connectNeonDB(process.env.DATABASE_URL);
    
    // Clear existing data first
    const sql = getSQL();
    console.log('🧹 Clearing existing demo data...');
    await sql`DELETE FROM bookings`;
    await sql`DELETE FROM properties`;
    await sql`DELETE FROM users`;
    console.log('✅ Database cleared');
    
    // Create demo users
    console.log('👥 Creating demo users...');
    const user1 = await User.create({
      name: 'Sarah Martinez',
      email: 'sarah@oceanviewproperties.com',
      password: 'demo123'
    });
    
    const user2 = await User.create({
      name: 'David Thompson',
      email: 'david@luxuryrentals.com',
      password: 'demo123'
    });
    
    const user3 = await User.create({
      name: 'Lisa Chen',
      email: 'lisa@cityapartments.com',
      password: 'demo123'
    });

    const user4 = await User.create({
      name: 'Michael Rodriguez',
      email: 'michael@mountaincabins.com',
      password: 'demo123'
    });
    
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@propstream.com',
      password: 'demo123'
    });
    
    console.log(`✅ Created ${5} demo users`);
    
    // Create realistic properties
    console.log('🏠 Creating demo properties...');
    
    // Sarah's properties (Ocean View Properties)
    const property1 = await Property.create({
      user_id: user1.id,
      name: 'Oceanfront Paradise Villa',
      description: 'Stunning 5-bedroom villa with panoramic ocean views, private pool, and direct beach access. Perfect for large families or groups seeking luxury by the sea.',
      address: '1247 Oceanfront Boulevard',
      city: 'Malibu, CA',
      price_per_night: 750.00,
      max_guests: 12,
      bedrooms: 5,
      bathrooms: 4,
      amenities: ['WiFi', 'Private Pool', 'Hot Tub', 'Gourmet Kitchen', 'Valet Parking', 'Beach Access', 'Ocean View', 'Concierge Service'],
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'https://images.unsplash.com/photo-1570214476464-8fc3d6d15148?w=800']
    });

    const property2 = await Property.create({
      user_id: user1.id,
      name: 'Seaside Cottage Retreat',
      description: 'Charming 3-bedroom cottage just steps from the beach. Cozy fireplace, private garden, and stunning sunset views.',
      address: '892 Coastal Highway',
      city: 'Carmel-by-the-Sea, CA',
      price_per_night: 425.00,
      max_guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Fireplace', 'Garden', 'Kitchen', 'Parking', 'Beach Walk', 'Pet Friendly'],
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800']
    });

    // David's properties (Luxury Rentals)
    const property3 = await Property.create({
      user_id: user2.id,
      name: 'Downtown Luxury Penthouse',
      description: 'Ultra-modern penthouse in the heart of downtown with floor-to-ceiling windows, rooftop terrace, and city skyline views.',
      address: '456 Metropolitan Avenue',
      city: 'New York, NY',
      price_per_night: 950.00,
      max_guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['WiFi', 'Rooftop Terrace', 'City Views', 'Modern Kitchen', 'Valet Parking', 'Gym Access', 'Concierge', 'Smart Home'],
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800']
    });

    const property4 = await Property.create({
      user_id: user2.id,
      name: 'Historic Mansion Estate',
      description: 'Magnificent 19th-century mansion with 6 bedrooms, ballroom, library, and 5-acre private grounds. Perfect for special events.',
      address: '1890 Heritage Lane',
      city: 'Charleston, SC',
      price_per_night: 1200.00,
      max_guests: 14,
      bedrooms: 6,
      bathrooms: 5,
      amenities: ['WiFi', 'Historic Architecture', 'Ballroom', 'Library', 'Gardens', 'Event Space', 'Full Kitchen', 'Parking'],
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800']
    });

    // Lisa's properties (City Apartments)
    const property5 = await Property.create({
      user_id: user3.id,
      name: 'Modern Loft in Arts District',
      description: 'Industrial-chic loft with exposed brick, high ceilings, and contemporary furnishings. Walking distance to galleries and restaurants.',
      address: '789 Creative Boulevard',
      city: 'Los Angeles, CA',
      price_per_night: 285.00,
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['WiFi', 'Exposed Brick', 'High Ceilings', 'Modern Kitchen', 'Street Parking', 'Arts District', 'Workspace'],
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1486304873000-235643847519?w=800']
    });

    const property6 = await Property.create({
      user_id: user3.id,
      name: 'Cozy Studio in University Area',
      description: 'Perfect studio for business travelers or students. Fully equipped kitchen, fast WiFi, and walking distance to campus.',
      address: '321 College Street',
      city: 'Boston, MA',
      price_per_night: 125.00,
      max_guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Kitchenette', 'University Area', 'Public Transit', 'Work Desk', 'Long-stay Friendly'],
      images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800']
    });

    // Michael's properties (Mountain Cabins)
    const property7 = await Property.create({
      user_id: user4.id,
      name: 'Luxury Mountain Lodge',
      description: 'Spectacular log cabin with panoramic mountain views, stone fireplace, hot tub, and access to hiking trails.',
      address: '567 Alpine Ridge Road',
      city: 'Aspen, CO',
      price_per_night: 650.00,
      max_guests: 10,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['WiFi', 'Mountain Views', 'Stone Fireplace', 'Hot Tub', 'Hiking Access', 'Full Kitchen', 'Ski Storage', 'Game Room'],
      images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800']
    });

    const property8 = await Property.create({
      user_id: user4.id,
      name: 'Rustic Cabin Getaway',
      description: 'Authentic log cabin experience with wood-burning stove, private deck, and surrounded by pristine forest.',
      address: '234 Forest Trail',
      city: 'Big Sur, CA',
      price_per_night: 320.00,
      max_guests: 6,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Wood Stove', 'Private Deck', 'Forest Views', 'Hiking Trails', 'Kitchenette', 'Fire Pit'],
      images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800']
    });

    // Demo user's showcase property
    const demoProperty = await Property.create({
      user_id: demoUser.id,
      name: 'PropStream Demo Villa',
      description: 'Beautiful demonstration property showcasing all PropStream features. Luxury villa with pool, garden, and smart home technology.',
      address: '100 Demo Street',
      city: 'Demo City, CA',
      price_per_night: 500.00,
      max_guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ['WiFi', 'Smart Home', 'Pool', 'Garden', 'Parking', 'Kitchen', 'Demo Features'],
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1570214476464-8fc3d6d15148?w=800']
    });
    
    console.log(`✅ Created ${9} demo properties`);
    
    // Create realistic bookings
    console.log('📅 Creating demo bookings...');
    
    // Recent and upcoming bookings for demonstration
    const bookings = [
      // Property 1 bookings (Oceanfront Paradise Villa)
      {
        property_id: property1.id,
        guest_name: 'Robert & Jennifer Williams',
        guest_email: 'robert.williams@email.com',
        guest_phone: '+1-555-0123',
        start_date: '2025-09-15',
        end_date: '2025-09-22',
        total_price: 5250.00,
        status: 'confirmed',
        platform: 'airbnb'
      },
      {
        property_id: property1.id,
        guest_name: 'The Johnson Family',
        guest_email: 'johnson.family@email.com',
        guest_phone: '+1-555-0234',
        start_date: '2025-10-05',
        end_date: '2025-10-12',
        total_price: 5250.00,
        status: 'confirmed',
        platform: 'vrbo'
      },
      
      // Property 2 bookings (Seaside Cottage)
      {
        property_id: property2.id,
        guest_name: 'Emma & Thomas Davis',
        guest_email: 'emma.davis@email.com',
        guest_phone: '+1-555-0345',
        start_date: '2025-08-28',
        end_date: '2025-09-01',
        total_price: 1700.00,
        status: 'confirmed',
        platform: 'direct'
      },
      
      // Property 3 bookings (Downtown Penthouse)
      {
        property_id: property3.id,
        guest_name: 'Alexander Schmidt',
        guest_email: 'alex.schmidt@business.com',
        guest_phone: '+1-555-0456',
        start_date: '2025-09-01',
        end_date: '2025-09-05',
        total_price: 3800.00,
        status: 'confirmed',
        platform: 'booking.com'
      },
      {
        property_id: property3.id,
        guest_name: 'Corporate Retreat Group',
        guest_email: 'events@techcorp.com',
        guest_phone: '+1-555-0567',
        start_date: '2025-09-20',
        end_date: '2025-09-23',
        total_price: 2850.00,
        status: 'confirmed',
        platform: 'direct'
      },
      
      // Property 4 bookings (Historic Mansion)
      {
        property_id: property4.id,
        guest_name: 'Wedding Party - Miller & Anderson',
        guest_email: 'sarah.miller@email.com',
        guest_phone: '+1-555-0678',
        start_date: '2025-10-15',
        end_date: '2025-10-17',
        total_price: 2400.00,
        status: 'confirmed',
        platform: 'direct'
      },
      
      // Property 5 bookings (Modern Loft)
      {
        property_id: property5.id,
        guest_name: 'Maya Patel',
        guest_email: 'maya.patel@creative.com',
        guest_phone: '+1-555-0789',
        start_date: '2025-08-30',
        end_date: '2025-09-06',
        total_price: 1995.00,
        status: 'confirmed',
        platform: 'airbnb'
      },
      
      // Property 7 bookings (Mountain Lodge)
      {
        property_id: property7.id,
        guest_name: 'Adventure Group - Smith Party',
        guest_email: 'adventures@email.com',
        guest_phone: '+1-555-0890',
        start_date: '2025-09-10',
        end_date: '2025-09-14',
        total_price: 2600.00,
        status: 'confirmed',
        platform: 'vrbo'
      },
      
      // Demo property booking
      {
        property_id: demoProperty.id,
        guest_name: 'Demo Guest',
        guest_email: 'guest@demo.com',
        guest_phone: '+1-555-DEMO',
        start_date: '2025-09-01',
        end_date: '2025-09-07',
        total_price: 3000.00,
        status: 'confirmed',
        platform: 'manual'
      },
      
      // Some past bookings for analytics demonstration
      {
        property_id: property1.id,
        guest_name: 'Summer Family Vacation',
        guest_email: 'summer.vacation@email.com',
        guest_phone: '+1-555-1234',
        start_date: '2025-07-15',
        end_date: '2025-07-22',
        total_price: 5250.00,
        status: 'completed',
        platform: 'airbnb'
      },
      {
        property_id: property3.id,
        guest_name: 'Business Conference Group',
        guest_email: 'conference@business.com',
        guest_phone: '+1-555-2345',
        start_date: '2025-06-10',
        end_date: '2025-06-15',
        total_price: 4750.00,
        status: 'completed',
        platform: 'booking.com'
      }
    ];

    // Create all bookings
    for (const bookingData of bookings) {
      await Booking.create(bookingData);
    }
    
    console.log(`✅ Created ${bookings.length} demo bookings`);
    
    console.log('');
    console.log('🎉 ========================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('🎉 ========================================');
    console.log('');
    console.log('📊 DEMO DATA SUMMARY:');
    console.log(`👥 Users: ${5} (including demo user)`);
    console.log(`🏠 Properties: ${9} across different categories`);
    console.log(`📅 Bookings: ${bookings.length} (past and future)`);
    console.log('');
    console.log('🔑 DEMO LOGIN CREDENTIALS:');
    console.log('');
    console.log('🌟 MAIN DEMO ACCOUNT:');
    console.log('   Email: demo@propstream.com');
    console.log('   Password: demo123');
    console.log('');
    console.log('🏢 ADDITIONAL DEMO ACCOUNTS:');
    console.log('   Sarah Martinez (Ocean Properties): sarah@oceanviewproperties.com / demo123');
    console.log('   David Thompson (Luxury Rentals): david@luxuryrentals.com / demo123');
    console.log('   Lisa Chen (City Apartments): lisa@cityapartments.com / demo123');
    console.log('   Michael Rodriguez (Mountain Cabins): michael@mountaincabins.com / demo123');
    console.log('');
    console.log('🚀 Ready for client demonstration!');
    console.log('🌐 Frontend: http://localhost:3002');
    console.log('🔌 API: http://localhost:4000');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the seeding
seedDemoDatabase();
