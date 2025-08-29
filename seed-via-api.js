import axios from 'axios';

const API_BASE = 'https://propstream-api.onrender.com/api';

const seedViaAPI = async () => {
  console.log('🌱 Starting API-based seeding...');
  
  try {
    // Test API connection
    console.log('🔗 Testing API connection...');
    const healthCheck = await axios.get('https://propstream-api.onrender.com/');
    console.log('✅ API is responsive:', healthCheck.data.message);
    
    // Create realtors
    console.log('👔 Creating realtors...');
    const realtors = [];
    
    const realtorData = [
      { name: 'Sarah Johnson', email: 'sarah.realtor@propstream.com', password: 'password123', role: 'realtor' },
      { name: 'Mike Thompson', email: 'mike.realtor@propstream.com', password: 'password123', role: 'realtor' },
      { name: 'Elena Rodriguez', email: 'elena.realtor@propstream.com', password: 'password123', role: 'realtor' }
    ];
    
    for (const realtor of realtorData) {
      try {
        const response = await axios.post(`${API_BASE}/auth/register`, realtor);
        realtors.push({ ...realtor, token: response.data.token, user: response.data.user });
        console.log(`✅ Created realtor: ${realtor.name}`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  Realtor ${realtor.name} already exists, logging in...`);
          const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: realtor.email,
            password: realtor.password
          });
          realtors.push({ ...realtor, token: loginResponse.data.token, user: loginResponse.data.user });
        } else {
          console.error(`❌ Failed to create ${realtor.name}:`, error.response?.data?.message);
        }
      }
    }
    
    // Create clients  
    console.log('👥 Creating clients...');
    const clients = [];
    
    const clientData = [
      { name: 'John Smith', email: 'john.client@propstream.com', password: 'password123', role: 'client' },
      { name: 'Emma Wilson', email: 'emma.client@propstream.com', password: 'password123', role: 'client' },
      { name: 'David Brown', email: 'david.client@propstream.com', password: 'password123', role: 'client' },
      { name: 'Lisa Chen', email: 'lisa.client@propstream.com', password: 'password123', role: 'client' },
      { name: 'Alex Turner', email: 'alex.client@propstream.com', password: 'password123', role: 'client' }
    ];
    
    for (const client of clientData) {
      try {
        const response = await axios.post(`${API_BASE}/auth/register`, client);
        clients.push({ ...client, token: response.data.token, user: response.data.user });
        console.log(`✅ Created client: ${client.name}`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  Client ${client.name} already exists, logging in...`);
          const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: client.email,
            password: client.password
          });
          clients.push({ ...client, token: loginResponse.data.token, user: loginResponse.data.user });
        } else {
          console.error(`❌ Failed to create ${client.name}:`, error.response?.data?.message);
        }
      }
    }
    
    // Create properties for each realtor
    console.log('🏠 Creating properties...');
    const properties = [];
    
    // Sarah's properties
    if (realtors[0]) {
      const sarahProperties = [
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
        }
      ];
      
      for (const property of sarahProperties) {
        try {
          const response = await axios.post(`${API_BASE}/properties`, property, {
            headers: { Authorization: `Bearer ${realtors[0].token}` }
          });
          properties.push(response.data);
          console.log(`✅ Created property: ${property.name} (Sarah)`);
        } catch (error) {
          console.error(`❌ Failed to create property ${property.name}:`, error.response?.data?.message);
        }
      }
    }
    
    // Mike's properties
    if (realtors[1]) {
      const mikeProperties = [
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
        }
      ];
      
      for (const property of mikeProperties) {
        try {
          const response = await axios.post(`${API_BASE}/properties`, property, {
            headers: { Authorization: `Bearer ${realtors[1].token}` }
          });
          properties.push(response.data);
          console.log(`✅ Created property: ${property.name} (Mike)`);
        } catch (error) {
          console.error(`❌ Failed to create property ${property.name}:`, error.response?.data?.message);
        }
      }
    }
    
    // Elena's properties
    if (realtors[2]) {
      const elenaProperties = [
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
      
      for (const property of elenaProperties) {
        try {
          const response = await axios.post(`${API_BASE}/properties`, property, {
            headers: { Authorization: `Bearer ${realtors[2].token}` }
          });
          properties.push(response.data);
          console.log(`✅ Created property: ${property.name} (Elena)`);
        } catch (error) {
          console.error(`❌ Failed to create property ${property.name}:`, error.response?.data?.message);
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
    
    for (const email of newsletters) {
      try {
        await axios.post(`${API_BASE}/newsletter/subscribe`, { email });
        console.log(`✅ Subscribed: ${email}`);
      } catch (error) {
        console.error(`❌ Failed to subscribe ${email}:`, error.response?.data?.message);
      }
    }
    
    // Display Summary
    console.log('\n🎉 API SEEDING COMPLETE! Summary:');
    console.log('=' .repeat(60));
    console.log(`👔 Realtors: ${realtors.length}`);
    console.log(`👥 Clients: ${clients.length}`);
    console.log(`🏠 Properties: ${properties.length}`);
    console.log(`📧 Newsletter Subscriptions: ${newsletters.length}`);
    
    console.log('\n📋 TEST ACCOUNTS:');
    console.log('=' .repeat(60));
    console.log('🔐 Password for all accounts: password123\n');
    
    console.log('👔 REALTORS:');
    realtors.forEach(realtor => {
      console.log(`   • ${realtor.name} - ${realtor.email}`);
    });
    
    console.log('\n👥 CLIENTS:');
    clients.forEach(client => {
      console.log(`   • ${client.name} - ${client.email}`);
    });
    
    console.log('\n🚀 READY TO TEST:');
    console.log('=' .repeat(60));
    console.log('1. Visit: http://localhost:5173');
    console.log('2. Click "Browse Properties" → See all properties');
    console.log('3. Register/Login as client → Browse & book properties');
    console.log('4. Register/Login as realtor → Manage properties & bookings');
    console.log('5. Test newsletter signup on landing page');
    console.log('6. Check role-based navigation differences');
    
    console.log('\n💡 QUICK DEMO FLOW:');
    console.log('=' .repeat(60));
    console.log('• Login as sarah.realtor@propstream.com → See dashboard with properties');
    console.log('• Login as john.client@propstream.com → Browse properties as client');
    console.log('• Try accessing realtor-only pages as client (should redirect)');
    console.log('• Test property creation as realtor');
    console.log('• Test property booking as client');
    
  } catch (error) {
    console.error('❌ API seeding failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
};

// Run the API seeding
seedViaAPI()
  .then(() => {
    console.log('\n✅ API seeding completed successfully!');
  })
  .catch((error) => {
    console.error('❌ API seeding failed:', error);
  });
