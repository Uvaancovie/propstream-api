import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import User from './src/models/User.js';
import Property from './src/models/Property.js';
import Booking from './src/models/Booking.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB(process.env.MONGODB_URI);
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    
    // Create sample users
    console.log('👤 Creating sample users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        email: 'john.doe@realtor.com',
        passwordHash: hashedPassword,
        name: 'John Doe',
        role: 'owner'
      },
      {
        email: 'jane.smith@realtor.com',
        passwordHash: hashedPassword,
        name: 'Jane Smith',
        role: 'owner'
      },
      {
        email: 'admin@propstream.com',
        passwordHash: hashedPassword,
        name: 'Admin User',
        role: 'admin'
      }
    ]);
    
    console.log(`✅ Created ${users.length} users`);
    
    // Create sample properties
    console.log('🏠 Creating sample properties...');
    const properties = await Property.create([
      {
        ownerId: users[0]._id,
        name: 'Luxury Beach House - Cape Town',
        address: '123 Ocean Drive, Clifton',
        city: 'Cape Town',
        description: 'Stunning 3-bedroom beach house with panoramic ocean views. Perfect for families and couples looking for a luxurious getaway. Features include a private pool, direct beach access, and modern amenities.',
        pricePerNight: 2500,
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Parking', 'Kitchen', 'Air Conditioning', 'BBQ Area'],
        houseRules: 'No smoking, No pets, Check-in after 3pm, Check-out before 11am',
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400'
        ],
        iCalSecret: crypto.randomUUID(),
        calendars: {
          airbnbExportUrl: '',
          airbnbImportUrl: 'https://calendar.airbnb.com/calendar/ical/123456.ics',
          bookingComImportUrl: '',
          vrboImportUrl: '',
          otherImportUrls: []
        }
      },
      {
        ownerId: users[0]._id,
        name: 'Modern City Apartment - Johannesburg',
        address: '456 Nelson Mandela Square, Sandton',
        city: 'Johannesburg',
        description: 'Sleek 2-bedroom apartment in the heart of Sandton. Perfect for business travelers and city explorers. Walking distance to shopping malls, restaurants, and business districts.',
        pricePerNight: 1200,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ['WiFi', 'Gym', 'Security', 'Parking', 'Kitchen', 'Balcony', 'City View'],
        houseRules: 'No smoking, Quiet hours after 10pm, No parties',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
          'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=400',
          'https://images.unsplash.com/photo-1560449752-aa4dae5d6ea6?w=400'
        ],
        iCalSecret: crypto.randomUUID(),
        calendars: {
          airbnbExportUrl: '',
          airbnbImportUrl: '',
          bookingComImportUrl: 'https://admin.booking.com/hotel/ical/123456.ics',
          vrboImportUrl: '',
          otherImportUrls: []
        }
      },
      {
        ownerId: users[1]._id,
        name: 'Wine Estate Cottage - Stellenbosch',
        address: '789 Vineyard Road',
        city: 'Stellenbosch',
        description: 'Charming cottage on a working wine estate. Surrounded by vineyards with mountain views. Perfect for wine lovers and those seeking a peaceful retreat.',
        pricePerNight: 1800,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1.5,
        amenities: ['WiFi', 'Wine Tasting', 'Mountain View', 'Parking', 'Kitchen', 'Fireplace', 'Garden'],
        houseRules: 'No smoking indoors, Respect vineyard operations, Check-in after 2pm',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
          'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400',
          'https://images.unsplash.com/photo-1600566753364-2e9a7ae99ce9?w=400'
        ],
        iCalSecret: crypto.randomUUID(),
        calendars: {
          airbnbExportUrl: '',
          airbnbImportUrl: '',
          bookingComImportUrl: '',
          vrboImportUrl: 'https://www.vrbo.com/ical/calendar.ics?id=123456',
          otherImportUrls: []
        }
      },
      {
        ownerId: users[1]._id,
        name: 'Safari Lodge Room - Kruger Area',
        address: '321 Safari Drive, Marloth Park',
        city: 'Marloth Park',
        description: 'Authentic African safari experience with wildlife viewing from your doorstep. Comfortable lodge room with all amenities and guided safari tours available.',
        pricePerNight: 3200,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['WiFi', 'Safari Tours', 'Wildlife Viewing', 'Restaurant', 'Pool', 'Air Conditioning'],
        houseRules: 'Respect wildlife, No feeding animals, Stay on designated paths',
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400'
        ],
        iCalSecret: crypto.randomUUID(),
        calendars: {
          airbnbExportUrl: '',
          airbnbImportUrl: 'https://calendar.airbnb.com/calendar/ical/789012.ics',
          bookingComImportUrl: '',
          vrboImportUrl: '',
          otherImportUrls: ['https://example-booking-platform.com/ical/calendar123.ics']
        }
      }
    ]);
    
    console.log(`✅ Created ${properties.length} properties`);
    
    // Create sample bookings
    console.log('📅 Creating sample bookings...');
    const today = new Date();
    const bookings = [];
    
    // Generate bookings for each property
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      
      // Past booking
      bookings.push({
        propertyId: property._id,
        platform: i % 2 === 0 ? 'airbnb' : 'booking',
        start: new Date(today.getTime() - (30 + i * 7) * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() - (27 + i * 7) * 24 * 60 * 60 * 1000),
        guestName: `Guest ${i + 1}`,
        guestEmail: `guest${i + 1}@example.com`,
        externalId: `EXT${Math.random().toString(36).substr(2, 9)}`,
        status: 'confirmed',
        notes: 'Great stay, very clean property'
      });
      
      // Current/upcoming booking
      bookings.push({
        propertyId: property._id,
        platform: 'manual',
        start: new Date(today.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + (i + 4) * 24 * 60 * 60 * 1000),
        guestName: `Future Guest ${i + 1}`,
        guestEmail: `future${i + 1}@example.com`,
        externalId: null,
        status: 'confirmed',
        notes: 'Special requests: Late check-in'
      });
      
      // Future booking
      bookings.push({
        propertyId: property._id,
        platform: i % 3 === 0 ? 'vrbo' : 'airbnb',
        start: new Date(today.getTime() + (i + 15) * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + (i + 18) * 24 * 60 * 60 * 1000),
        guestName: `Extended Guest ${i + 1}`,
        guestEmail: `extended${i + 1}@example.com`,
        externalId: `EXT${Math.random().toString(36).substr(2, 9)}`,
        status: 'confirmed',
        notes: 'Business trip - needs early check-in'
      });
    }
    
    // Add some blocked dates (maintenance/personal use)
    bookings.push({
      propertyId: properties[0]._id,
      platform: 'manual',
      start: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
      guestName: 'BLOCKED - Maintenance',
      guestEmail: '',
      externalId: null,
      status: 'confirmed',
      notes: 'Pool cleaning and repairs'
    });
    
    const createdBookings = await Booking.create(bookings);
    console.log(`✅ Created ${createdBookings.length} bookings`);
    
    // Summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Properties: ${properties.length}`);
    console.log(`   Bookings: ${createdBookings.length}`);
    
    console.log('\n🔐 Demo Login Credentials:');
    console.log('   Email: john.doe@realtor.com');
    console.log('   Password: password123');
    console.log('   ---');
    console.log('   Email: jane.smith@realtor.com');
    console.log('   Password: password123');
    console.log('   ---');
    console.log('   Email: admin@propstream.com');
    console.log('   Password: password123');
    
    console.log('\n📅 Calendar Features to Demo:');
    console.log('   ✓ View bookings across multiple properties');
    console.log('   ✓ Export property calendars (.ics files)');
    console.log('   ✓ Import bookings from Airbnb, Booking.com, VRBO');
    console.log('   ✓ Manual booking management');
    console.log('   ✓ Past, current, and future bookings');
    console.log('   ✓ Blocked dates for maintenance');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  }
};

// Run the seed function
seedData();
