#!/usr/bin/env node

/**
 * API Testing Script for PropStream Demo
 * This script demonstrates the calendar sync functionality for realtors
 */

import axios from 'axios';
import fs from 'fs/promises';

const BASE_URL = 'http://localhost:4000';
let authToken = '';

// Demo user credentials
const DEMO_USER = {
  email: 'john.doe@realtor.com',
  password: 'password123'
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

async function login() {
  try {
    console.log('🔐 Logging in as demo realtor...');
    const response = await api.post('/api/auth/login', DEMO_USER);
    authToken = response.data.token;
    console.log('✅ Successfully logged in');
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function getProperties() {
  try {
    console.log('\n🏠 Fetching properties...');
    const response = await api.get('/api/properties');
    console.log(`✅ Found ${response.data.length} properties:`);
    response.data.forEach((prop, index) => {
      console.log(`   ${index + 1}. ${prop.title} (${prop.address})`);
    });
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch properties:', error.response?.data || error.message);
    return [];
  }
}

async function getBookings() {
  try {
    console.log('\n📅 Fetching all bookings...');
    const response = await api.get('/api/bookings');
    console.log(`✅ Found ${response.data.length} bookings:`);
    response.data.forEach((booking, index) => {
      const start = new Date(booking.start).toLocaleDateString();
      const end = new Date(booking.end).toLocaleDateString();
      console.log(`   ${index + 1}. ${booking.guestName} (${start} - ${end}) [${booking.platform}]`);
    });
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch bookings:', error.response?.data || error.message);
    return [];
  }
}

async function exportCalendar(propertyId) {
  try {
    console.log(`\n📤 Exporting calendar for property ${propertyId}...`);
    const response = await api.get(`/api/calendar/export/${propertyId}`, {
      responseType: 'text'
    });
    
    // Save to file for demo
    const filename = `property_${propertyId}_calendar.ics`;
    await fs.writeFile(filename, response.data);
    console.log(`✅ Calendar exported to ${filename}`);
    console.log('   📋 You can now upload this .ics file to booking platforms like:');
    console.log('      • Airbnb Calendar Settings');
    console.log('      • Booking.com Extranet');
    console.log('      • VRBO Partner Central');
    
    return filename;
  } catch (error) {
    console.error('❌ Failed to export calendar:', error.response?.data || error.message);
    return null;
  }
}

async function addPlatformLink(propertyId, platform, iCalUrl) {
  try {
    console.log(`\n🔗 Adding ${platform} calendar import for property ${propertyId}...`);
    const response = await api.post('/api/platforms/links', {
      propertyId,
      platform,
      iCalUrl,
      syncEnabled: true
    });
    console.log(`✅ Successfully added ${platform} calendar link`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to add platform link:', error.response?.data || error.message);
    return null;
  }
}

async function createManualBooking(propertyId) {
  try {
    console.log(`\n➕ Creating manual booking for property ${propertyId}...`);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);
    
    const booking = {
      propertyId,
      platform: 'manual',
      start: tomorrow.toISOString(),
      end: dayAfter.toISOString(),
      guestName: 'Demo Guest',
      guestEmail: 'demo@example.com',
      status: 'confirmed',
      notes: 'Demo booking created via API'
    };
    
    const response = await api.post('/api/bookings', booking);
    console.log('✅ Manual booking created successfully');
    console.log(`   Guest: ${booking.guestName}`);
    console.log(`   Dates: ${tomorrow.toLocaleDateString()} - ${dayAfter.toLocaleDateString()}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create booking:', error.response?.data || error.message);
    return null;
  }
}

async function runDemo() {
  console.log('🎯 PropStream Calendar Sync Demo\n');
  console.log('This demo showcases calendar synchronization features for realtors:');
  console.log('• Property and booking management');
  console.log('• Calendar export (.ics files)');
  console.log('• Platform integration (Airbnb, Booking.com, VRBO)');
  console.log('• Manual booking creation\n');
  
  try {
    // 1. Login
    await login();
    
    // 2. Get properties
    const properties = await getProperties();
    if (properties.length === 0) {
      console.log('❌ No properties found. Make sure to run the seed script first.');
      return;
    }
    
    // 3. Get existing bookings
    await getBookings();
    
    // 4. Export calendar for first property
    const firstProperty = properties[0];
    await exportCalendar(firstProperty._id);
    
    // 5. Demo platform integration
    await addPlatformLink(
      firstProperty._id, 
      'airbnb', 
      'https://calendar.airbnb.com/calendar/ical/demo123.ics'
    );
    
    // 6. Create a manual booking
    await createManualBooking(firstProperty._id);
    
    // 7. Show updated bookings
    console.log('\n🔄 Updated bookings after manual addition:');
    await getBookings();
    
    console.log('\n🎉 Demo completed successfully!');
    console.log('\n📝 Next steps for realtor demo:');
    console.log('1. Show the frontend calendar interface');
    console.log('2. Upload the exported .ics file to a booking platform');
    console.log('3. Demonstrate automatic booking imports');
    console.log('4. Show conflict prevention and availability management');
    
  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
  }
}

// Run the demo
runDemo();
