const axios = require('axios');

async function testLogin() {
  try {
    // Step 1: Login to get token
    const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'john.doe@realtor.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful. Token:', token);
    
    // Step 2: Get properties using the token
    const propsResponse = await axios.get('http://localhost:4000/api/properties', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Properties response:', JSON.stringify(propsResponse.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

testLogin();
