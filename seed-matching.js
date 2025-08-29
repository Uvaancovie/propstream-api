import axios from 'axios';

const API_BASE = 'https://propstream-api.onrender.com/api';

async function seedMatchingData() {
  console.log('🌱 Creating seed data that matches frontend localStorage...\n');

  try {
    // Test API connection
    console.log('🔗 Testing API connection...');
    const healthCheck = await axios.get('https://propstream-api.onrender.com/');
    console.log('✅ API is responsive:', healthCheck.data.message);

    // Create specific users with roles
    console.log('\n👥 Creating users with roles...');
    
    const users = [
      { 
        name: 'John Smith', 
        email: 'realtor@test.com', 
        password: 'password123', 
        role: 'realtor',
        phone: '+27 11 123 4567'
      },
      { 
        name: 'Sarah Johnson', 
        email: 'sarah@properties.com', 
        password: 'password123', 
        role: 'realtor',
        phone: '+27 21 987 6543'
      },
      { 
        name: 'Mike Client', 
        email: 'client@test.com', 
        password: 'password123', 
        role: 'client',
        phone: '+27 82 123 4567'
      },
      { 
        name: 'Alice Walker', 
        email: 'alice@email.com', 
        password: 'password123', 
        role: 'client',
        phone: '+27 83 765 4321'
      }
    ];

    const createdUsers = [];

    for (const userData of users) {
      try {
        const response = await axios.post(`${API_BASE}/auth/register`, userData);
        createdUsers.push({ 
          ...userData, 
          token: response.data.token, 
          user: response.data.user,
          id: response.data.user.id
        });
        console.log(`✅ Created ${userData.role}: ${userData.name} (${userData.email})`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  User ${userData.name} already exists, logging in...`);
          try {
            const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
              email: userData.email,
              password: userData.password
            });
            createdUsers.push({ 
              ...userData, 
              token: loginResponse.data.token, 
              user: loginResponse.data.user,
              id: loginResponse.data.user.id
            });
            console.log(`✅ Logged in ${userData.role}: ${userData.name}`);
          } catch (loginError) {
            console.error(`❌ Failed to login ${userData.name}:`, loginError.response?.data?.message);
          }
        } else {
          console.error(`❌ Failed to create ${userData.name}:`, error.response?.data?.message || error.message);
        }
      }
    }

    // Create properties matching frontend seed data
    console.log('\n🏠 Creating properties...');
    
    const realtors = createdUsers.filter(u => u.role === 'realtor');
    const johnSmith = realtors.find(r => r.email === 'realtor@test.com');
    const sarahJohnson = realtors.find(r => r.email === 'sarah@properties.com');

    const properties = [
      {
        name: 'Luxury Beachfront Villa',
        description: 'Beautiful oceanfront villa with stunning views and modern amenities. Perfect for a relaxing getaway.',
        address: '123 Ocean Drive',
        city: 'Cape Town',
        price_per_night: 2500,
        max_guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        amenities: ['WiFi', 'Swimming Pool', 'Ocean View', 'Kitchen', 'Parking'],
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        property_type: 'villa',
        is_available: true,
        realtor: johnSmith
      },
      {
        name: 'Modern City Apartment',
        description: 'Stylish apartment in the heart of the city with all modern conveniences.',
        address: '456 Main Street',
        city: 'Johannesburg',
        price_per_night: 1200,
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['WiFi', 'Gym', 'Concierge', 'Kitchen', 'Air Conditioning'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        property_type: 'apartment',
        is_available: true,
        realtor: johnSmith
      },
      {
        name: 'Cozy Mountain Cabin',
        description: 'Peaceful cabin surrounded by mountains, perfect for nature lovers.',
        address: '789 Mountain View',
        city: 'Stellenbosch',
        price_per_night: 800,
        max_guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['WiFi', 'Fireplace', 'Mountain View', 'Kitchen', 'Hiking Trails'],
        images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        property_type: 'cabin',
        is_available: true,
        realtor: sarahJohnson
      }
    ];

    const createdProperties = [];

    for (const propertyData of properties) {
      if (!propertyData.realtor) {
        console.log(`⚠️ Skipping property ${propertyData.name} - no realtor found`);
        continue;
      }

      try {
        const response = await axios.post(`${API_BASE}/properties`, propertyData, {
          headers: {
            'Authorization': `Bearer ${propertyData.realtor.token}`,
            'Content-Type': 'application/json'
          }
        });
        createdProperties.push({
          ...response.data.property,
          realtor: propertyData.realtor
        });
        console.log(`✅ Created property: ${propertyData.name} (${propertyData.realtor.name})`);
      } catch (error) {
        console.error(`❌ Failed to create property ${propertyData.name}:`, error.response?.data?.message || error.message);
      }
    }

    // Create sample bookings
    console.log('\n📅 Creating sample bookings...');
    
    const clients = createdUsers.filter(u => u.role === 'client');
    const mikeClient = clients.find(c => c.email === 'client@test.com');
    const aliceWalker = clients.find(c => c.email === 'alice@email.com');

    const bookings = [
      {
        property_id: createdProperties[0]?.id, // Luxury Beachfront Villa
        check_in: '2025-09-15',
        check_out: '2025-09-20',
        guests: 4,
        guest_name: 'Mike Client',
        guest_email: 'client@test.com',
        guest_phone: '+27 82 123 4567',
        total_amount: 12500,
        special_requests: 'Anniversary celebration trip',
        client: mikeClient
      },
      {
        property_id: createdProperties[1]?.id, // Modern City Apartment
        check_in: '2025-09-10',
        check_out: '2025-09-12',
        guests: 2,
        guest_name: 'Alice Walker',
        guest_email: 'alice@email.com',
        guest_phone: '+27 83 765 4321',
        total_amount: 2400,
        special_requests: 'Business trip to Johannesburg',
        client: aliceWalker
      }
    ];

    for (const bookingData of bookings) {
      if (!bookingData.property_id || !bookingData.client) {
        console.log(`⚠️ Skipping booking for ${bookingData.guest_name} - missing property or client`);
        continue;
      }

      try {
        const response = await axios.post(`${API_BASE}/bookings`, bookingData, {
          headers: {
            'Authorization': `Bearer ${bookingData.client.token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(`✅ Created booking: ${bookingData.guest_name} → ${response.data.booking.check_in} to ${response.data.booking.check_out}`);
      } catch (error) {
        console.error(`❌ Failed to create booking for ${bookingData.guest_name}:`, error.response?.data?.message || error.message);
      }
    }

    // Newsletter subscriptions
    console.log('\n📧 Creating newsletter subscriptions...');
    const newsletterEmails = ['client@test.com', 'alice@email.com'];
    
    for (const email of newsletterEmails) {
      try {
        await axios.post(`${API_BASE}/newsletter/subscribe`, { email });
        console.log(`✅ Newsletter subscription: ${email}`);
      } catch (error) {
        console.log(`⚠️ Newsletter subscription failed for ${email}:`, error.response?.data?.message || 'endpoint might not exist');
      }
    }

    console.log('\n🎉 SEED DATA COMPLETE! Summary:');
    console.log('============================================================');
    console.log(`👥 Users: ${createdUsers.length} (${realtors.length} realtors, ${clients.length} clients)`);
    console.log(`🏠 Properties: ${createdProperties.length}`);
    console.log(`📅 Bookings: ${bookings.filter(b => b.property_id && b.client).length}`);
    console.log(`📧 Newsletter Subscriptions: ${newsletterEmails.length}`);

    console.log('\n📋 TEST ACCOUNTS:');
    console.log('============================================================');
    console.log('🔐 Password for all accounts: password123\n');
    
    console.log('REALTORS:');
    realtors.forEach(r => console.log(`   • ${r.name} - ${r.email}`));
    
    console.log('\nCLIENTS:');
    clients.forEach(c => console.log(`   • ${c.name} - ${c.email}`));

    console.log('\n🚀 READY TO TEST:');
    console.log('============================================================');
    console.log('1. Login as realtor@test.com to add/manage properties');
    console.log('2. Login as client@test.com to browse and book properties');
    console.log('3. Test the complete role-based workflow');
    console.log('4. All data now matches your frontend localStorage seed data!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

seedMatchingData();
