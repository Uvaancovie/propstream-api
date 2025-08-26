const axios = require('axios');

const API_URL = 'http://localhost:4000/api';
const EMAIL = 'john.doe@realtor.com';
const PASSWORD = 'password123';

async function testBookings() {
  try {
    console.log('🔑 Logging in as John Doe...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful. Token received.');
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Fetch properties for John Doe
    console.log('\n🏠 Fetching properties...');
    const propertiesResponse = await axios.get(`${API_URL}/properties`, { headers });
    const properties = propertiesResponse.data.properties;
    
    console.log(`✅ Found ${properties.length} properties for John Doe:`);
    properties.forEach((property, index) => {
      console.log(`   ${index + 1}. ${property.name} (${property._id})`);
    });
    
    // Fetch bookings for John Doe
    console.log('\n📅 Fetching bookings...');
    const bookingsResponse = await axios.get(`${API_URL}/bookings`, { headers });
    
    if (bookingsResponse.data.bookings) {
      const bookings = bookingsResponse.data.bookings;
      console.log(`✅ Found ${bookings.length} bookings:`);
      
      bookings.forEach((booking, index) => {
        const startDate = new Date(booking.start).toLocaleDateString();
        const endDate = new Date(booking.end).toLocaleDateString();
        console.log(`   ${index + 1}. ${booking.guestName || 'Unnamed Guest'} (${startDate} to ${endDate}) - ${booking.status || 'confirmed'}`);
      });
    } else {
      console.log('❌ No bookings found or unexpected response format.');
      console.log('Response data:', bookingsResponse.data);
    }
    
    // Create a new test booking
    if (properties.length > 0) {
      console.log('\n➕ Creating a new test booking...');
      const today = new Date();
      const checkIn = new Date(today);
      checkIn.setDate(today.getDate() + 14); // Two weeks from now
      
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkIn.getDate() + 3); // 3-day stay
      
      const newBooking = {
        propertyId: properties[0]._id,
        start: checkIn.toISOString(),
        end: checkOut.toISOString(),
        guestName: 'Test Guest',
        guestEmail: 'test@example.com',
        platform: 'manual',
        status: 'confirmed',
        notes: 'Test booking created via API'
      };
      
      const createResponse = await axios.post(`${API_URL}/bookings`, newBooking, { headers });
      console.log('✅ New booking created:', createResponse.data);
    }
    
    console.log('\n🎉 Booking test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
    }
  }
}

// Run the test
testBookings();
