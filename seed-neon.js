import dotenv from 'dotenv';
import { connectNeonDB, getSQL } from './src/config/neon.js';
import User from './src/models/User.js';
import Property from './src/models/Property.js';
import Booking from './src/models/Booking.js';

dotenv.config();

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding for client demo...');
    
    // Connect to database
    await connectNeonDB(process.env.DATABASE_URL);
    
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
      images: ['https://example.com/beach1.jpg', 'https://example.com/beach2.jpg']
    });
    
    const property2 = await Property.create({
      user_id: user1.id,
      name: 'Mountain Cabin Retreat',
      description: 'Cozy cabin in the mountains perfect for hiking and relaxation',
      address: '456 Pine Trail',
      city: 'Aspen',
      price_per_night: 199.99,
      max_guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Hiking Trails', 'Parking'],
      images: ['https://example.com/cabin1.jpg', 'https://example.com/cabin2.jpg']
    });
    
    const property3 = await Property.create({
      user_id: user2.id,
      name: 'Urban Loft Downtown',
      description: 'Modern loft in the heart of the city with skyline views',
      address: '789 City Center Blvd',
      city: 'New York',
      price_per_night: 349.99,
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ['WiFi', 'Gym', 'Rooftop Access', 'Kitchen', 'Concierge'],
      images: ['https://example.com/loft1.jpg', 'https://example.com/loft2.jpg']
    });
    
    const property4 = await Property.create({
      user_id: user3.id,
      name: 'Lakeside Cottage',
      description: 'Peaceful cottage by the lake with fishing and boating',
      address: '321 Lakefront Road',
      city: 'Lake Tahoe',
      price_per_night: 179.99,
      max_guests: 5,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Boat Dock', 'Kitchen', 'Fishing', 'Parking'],
      images: ['https://example.com/lake1.jpg', 'https://example.com/lake2.jpg']
    });
    
    console.log(`✅ Created ${4} properties`);
    
    // Create bookings
    console.log('📅 Creating bookings...');
    const bookings = [
      {
        property_id: property1.id,
        guest_name: 'Alice Johnson',
        guest_email: 'alice@email.com',
        guest_phone: '+1-555-0101',
        start_date: '2024-01-15',
        end_date: '2024-01-22',
        total_price: 2099.93,
        status: 'confirmed',
        platform: 'airbnb'
      },
      {
        property_id: property1.id,
        guest_name: 'Bob Martinez',
        guest_email: 'bob@email.com',
        guest_phone: '+1-555-0102',
        start_date: '2024-02-10',
        end_date: '2024-02-17',
        total_price: 2099.93,
        status: 'confirmed',
        platform: 'vrbo'
      },
      {
        property_id: property2.id,
        guest_name: 'Carol Davis',
        guest_email: 'carol@email.com',
        guest_phone: '+1-555-0103',
        start_date: '2024-01-20',
        end_date: '2024-01-27',
        total_price: 1399.93,
        status: 'confirmed',
        platform: 'booking'
      },
      {
        property_id: property2.id,
        guest_name: 'David Wilson',
        guest_email: 'david@email.com',
        guest_phone: '+1-555-0104',
        start_date: '2024-03-05',
        end_date: '2024-03-12',
        total_price: 1399.93,
        status: 'confirmed',
        platform: 'manual'
      },
      {
        property_id: property3.id,
        guest_name: 'Eva Rodriguez',
        guest_email: 'eva@email.com',
        guest_phone: '+1-555-0105',
        start_date: '2024-01-25',
        end_date: '2024-01-30',
        total_price: 1749.95,
        status: 'confirmed',
        platform: 'airbnb'
      }
    ];
    
    for (const bookingData of bookings) {
      await Booking.create(bookingData);
    }
    
    console.log(`✅ Created ${bookings.length} bookings`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: 3`);
    console.log(`- Properties: 4`);
    console.log(`- Bookings: ${bookings.length}`);
    console.log('\n🔑 Test credentials:');
    console.log('Email: john.doe@realtor.com | Password: password123');
    console.log('Email: jane.smith@host.com | Password: password123');
    console.log('Email: mike.wilson@property.com | Password: password123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
