import axios from 'axios';

const API_BASE = 'https://propstream-api.onrender.com/api';

const simpleSeed = async () => {
  console.log('🌱 Starting simple seeding (without roles for now)...');
  
  try {
    // Test API connection
    console.log('🔗 Testing API connection...');
    const healthCheck = await axios.get('https://propstream-api.onrender.com/');
    console.log('✅ API is responsive:', healthCheck.data.message);
    
    // Create users (will default to client role)
    console.log('👥 Creating users...');
    const users = [];
    
    const userData = [
      { name: 'Sarah Johnson', email: 'sarah.realtor@propstream.com', password: 'password123' },
      { name: 'Mike Thompson', email: 'mike.realtor@propstream.com', password: 'password123' },
      { name: 'Elena Rodriguez', email: 'elena.realtor@propstream.com', password: 'password123' },
      { name: 'John Smith', email: 'john.client@propstream.com', password: 'password123' },
      { name: 'Emma Wilson', email: 'emma.client@propstream.com', password: 'password123' },
      { name: 'David Brown', email: 'david.client@propstream.com', password: 'password123' },
      { name: 'Lisa Chen', email: 'lisa.client@propstream.com', password: 'password123' },
      { name: 'Alex Turner', email: 'alex.client@propstream.com', password: 'password123' }
    ];
    
    for (const user of userData) {
      try {
        const response = await axios.post(`${API_BASE}/auth/register`, user);
        users.push({ ...user, token: response.data.token, user: response.data.user });
        console.log(`✅ Created user: ${user.name}`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  User ${user.name} already exists, logging in...`);
          try {
            const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
              email: user.email,
              password: user.password
            });
            users.push({ ...user, token: loginResponse.data.token, user: loginResponse.data.user });
            console.log(`✅ Logged in user: ${user.name}`);
          } catch (loginError) {
            console.error(`❌ Failed to login ${user.name}:`, loginError.response?.data?.message);
          }
        } else {
          console.error(`❌ Failed to create ${user.name}:`, error.response?.data?.message || error.message);
        }
      }
    }
    
    // Create properties using the first few users as property owners
    console.log('🏠 Creating properties...');
    const properties = [];
    
    const propertyData = [
      {
        name: 'Luxury Beachfront Villa',
        address: '123 Ocean Drive',
        city: 'Miami Beach, FL',
        description: 'Stunning oceanfront villa with private beach access, infinity pool, and breathtaking sunset views. Perfect for luxury getaways.',
        pricePerNight: 450,
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Air Conditioning', 'Kitchen', 'Parking', 'Hot Tub', 'Ocean View'],
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9']
      },
      {
        name: 'Downtown Modern Loft',
        address: '456 Urban Street',
        city: 'New York, NY',
        description: 'Stylish loft in the heart of Manhattan with industrial design, exposed brick walls, and city skyline views.',
        pricePerNight: 280,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Elevator', 'City View', 'Workspace', 'Gym Access'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1484154218962-a197022b5858']
      },
      {
        name: 'Mountain Cabin Retreat',
        address: '789 Pine Ridge Road',
        city: 'Aspen, CO',
        description: 'Cozy log cabin nestled in the mountains with fireplace, hot tub, and spectacular mountain views. Ideal for winter skiing or summer hiking.',
        pricePerNight: 320,
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Kitchen', 'Parking', 'Mountain View', 'Ski Storage', 'Hiking Trails'],
        images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4']
      },
      {
        name: 'Historic Victorian Home',
        address: '321 Heritage Lane',
        city: 'San Francisco, CA',
        description: 'Beautifully restored Victorian home with original hardwood floors, bay windows, and modern amenities in historic neighborhood.',
        pricePerNight: 375,
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Garden', 'Parking', 'Historic Architecture', 'Bay Windows'],
        images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13', 'https://images.unsplash.com/photo-1576941089067-2de3c901e126']
      },
      {
        name: 'Lakeside Cottage',
        address: '654 Lakeshore Drive',
        city: 'Lake Tahoe, CA',
        description: 'Charming cottage right on the lake with private dock, kayaks, and panoramic lake views. Perfect for peaceful retreats.',
        pricePerNight: 225,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ['WiFi', 'Lake Access', 'Dock', 'Kayaks', 'Kitchen', 'Fireplace', 'Lake View', 'Fishing'],
        images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4']
      },
      {
        name: 'Desert Oasis Resort',
        address: '987 Cactus Boulevard',
        city: 'Scottsdale, AZ',
        description: 'Luxurious desert resort with private pool, spa, and stunning desert landscape views. Features modern Southwestern architecture.',
        pricePerNight: 395,
        maxGuests: 10,
        bedrooms: 5,
        bathrooms: 4,
        amenities: ['WiFi', 'Pool', 'Spa', 'Air Conditioning', 'Kitchen', 'Parking', 'Desert View', 'BBQ Grill', 'Tennis Court'],
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9']
      },
      {
        name: 'Urban Penthouse Suite',
        address: '147 Sky Tower',
        city: 'Chicago, IL',
        description: 'Spectacular penthouse with 360-degree city views, private terrace, and luxury amenities in prestigious downtown location.',
        pricePerNight: 520,
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 3,
        amenities: ['WiFi', 'City View', 'Terrace', 'Elevator', 'Kitchen', 'Gym Access', 'Concierge', 'Parking', 'Luxury Finishes'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1484154218962-a197022b5858']
      }
    ];
    
    // Use the first few users to create properties
    for (let i = 0; i < propertyData.length && i < users.length; i++) {
      if (users[i] && users[i].token) {
        try {
          const response = await axios.post(`${API_BASE}/properties`, propertyData[i], {
            headers: { Authorization: `Bearer ${users[i].token}` }
          });
          properties.push(response.data);
          console.log(`✅ Created property: ${propertyData[i].name} (${users[i].name})`);
        } catch (error) {
          console.error(`❌ Failed to create property ${propertyData[i].name}:`, error.response?.data?.message || error.message);
        }
      }
    }
    
    // Subscribe to newsletter
    console.log('📧 Creating newsletter subscriptions...');
    const newsletters = [
      'newsletter1@example.com',
      'newsletter2@example.com', 
      'traveler@example.com',
      'property.lover@example.com',
      'demo@propstream.com'
    ];
    
    let newsletterSuccess = 0;
    for (const email of newsletters) {
      try {
        await axios.post(`${API_BASE}/newsletter/subscribe`, { email });
        console.log(`✅ Subscribed: ${email}`);
        newsletterSuccess++;
      } catch (error) {
        console.log(`⚠️  Newsletter subscription failed for ${email} (might not be implemented yet)`);
      }
    }
    
    // Display Summary
    console.log('\n🎉 SIMPLE SEEDING COMPLETE! Summary:');
    console.log('=' .repeat(60));
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏠 Properties: ${properties.length}`);
    console.log(`📧 Newsletter Subscriptions: ${newsletterSuccess}`);
    
    console.log('\n📋 TEST ACCOUNTS:');
    console.log('=' .repeat(60));
    console.log('🔐 Password for all accounts: password123\n');
    
    users.forEach(user => {
      console.log(`   • ${user.name} - ${user.email}`);
    });
    
    console.log('\n🚀 READY TO TEST:');
    console.log('=' .repeat(60));
    console.log('1. Visit: http://localhost:5173');
    console.log('2. Click "Browse Properties" → See all properties');
    console.log('3. Register/Login with any account above');
    console.log('4. Test the complete user flow');
    console.log('5. Properties are now available for browsing!');
    
    console.log('\n💡 QUICK DEMO:');
    console.log('=' .repeat(60));
    console.log('• Browse Properties (public) → Should show all properties');
    console.log('• Login with any account → Test authenticated features');
    console.log('• Create new properties (if you have property creation access)');
    console.log('• Test role-based navigation and features');
    
  } catch (error) {
    console.error('❌ Simple seeding failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
};

// Run the simple seeding
simpleSeed()
  .then(() => {
    console.log('\n✅ Simple seeding completed successfully!');
  })
  .catch((error) => {
    console.error('❌ Simple seeding failed:', error);
  });
