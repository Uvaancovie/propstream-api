import axios from 'axios';

const API_BASE = 'https://propstream-api.onrender.com/api';

async function testLogins() {
  console.log('🔍 Testing user roles and logins...\n');
  
  const testUsers = [
    { email: 'sarah.realtor@propstream.com', expected: 'realtor' },
    { email: 'john.client@propstream.com', expected: 'client' },
    { email: 'realtor@test.com', expected: 'realtor' },
    { email: 'client@test.com', expected: 'client' }
  ];
  
  for (const testUser of testUsers) {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: testUser.email,
        password: 'password123'
      });
      
      console.log(`✅ ${response.data.user.name}:`);
      console.log(`   Email: ${response.data.user.email}`);
      console.log(`   Role: ${response.data.user.role}`);
      console.log(`   ID: ${response.data.user.id}`);
      console.log();
    } catch (error) {
      console.log(`❌ Login failed for ${testUser.email}:`, error.response?.data?.message || error.message);
      console.log();
    }
  }
}

testLogins();
