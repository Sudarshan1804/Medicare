/**
 * Test script to directly test Google Places API
 * Run with: node test-places-api.js
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyDQT2Il6Rz0BfRQDSAXv-GoUr1KgiENSUw';
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

// LPU Campus coordinates (from Google Maps)
const LPU_LAT = 31.2500;
const LPU_LNG = 75.7067;
const RADIUS = 5000; // 5km in meters

console.log('\n' + '='.repeat(70));
console.log('🧪 TESTING GOOGLE PLACES API');
console.log('='.repeat(70));
console.log(`📍 Location: ${LPU_LAT}, ${LPU_LNG}`);
console.log(`📏 Radius: ${RADIUS}m (${RADIUS/1000}km)`);
console.log(`🔑 API Key: ${GOOGLE_PLACES_API_KEY.substring(0, 20)}...`);
console.log('='.repeat(70) + '\n');

async function testPlacesAPI(type) {
  try {
    const url = `${PLACES_API_URL}?location=${LPU_LAT},${LPU_LNG}&radius=${RADIUS}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
    
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`🔍 Testing ${type.toUpperCase()}`);
    console.log(`${'─'.repeat(70)}`);
    console.log(`Request URL: ${PLACES_API_URL}`);
    console.log(`Parameters:`)
    console.log(`   location: ${LPU_LAT},${LPU_LNG}`);
    console.log(`   radius: ${RADIUS}`);
    console.log(`   type: ${type}`);
    console.log(`   key: ${GOOGLE_PLACES_API_KEY.substring(0, 20)}...\n`);
    
    const response = await axios.get(PLACES_API_URL, {
      params: {
        location: `${LPU_LAT},${LPU_LNG}`,
        radius: RADIUS,
        type: type,
        key: GOOGLE_PLACES_API_KEY
      }
    });

    console.log(`📥 Response Status: ${response.data.status}`);
    
    if (response.data.error_message) {
      console.log(`❌ Error Message: ${response.data.error_message}`);
    }
    
    if (response.data.status === 'REQUEST_DENIED') {
      console.log(`\n⚠️  REQUEST DENIED - Possible causes:`);
      console.log(`   1. Invalid API key`);
      console.log(`   2. API key not enabled for Places API`);
      console.log(`   3. Billing not enabled`);
      console.log(`   4. IP restrictions blocking request`);
      return;
    }
    
    if (response.data.status === 'ZERO_RESULTS') {
      console.log(`\n⚠️  ZERO RESULTS - This location may not have ${type}s in Google's database`);
      console.log(`   Consider adding records to MongoDB for campus locations`);
      return;
    }
    
    if (response.data.status === 'OK') {
      const results = response.data.results;
      console.log(`✅ Found: ${results.length} ${type}(s)\n`);
      
      // Show first 5 results
      console.log(`📋 Results (showing first 5):`);
      results.slice(0, 5).forEach((place, idx) => {
        const distance = calculateDistance(
          LPU_LAT, LPU_LNG,
          place.geometry.location.lat, place.geometry.location.lng
        );
        console.log(`\n   ${idx + 1}. ${place.name}`);
        console.log(`      📍 ${place.vicinity || place.formatted_address}`);
        console.log(`      📏 Distance: ${distance.toFixed(2)}km`);
        console.log(`      ⭐ Rating: ${place.rating || 'N/A'} (${place.user_ratings_total || 0} reviews)`);
        console.log(`      🆔 Place ID: ${place.place_id}`);
      });
      
      if (results.length > 5) {
        console.log(`\n   ... and ${results.length - 5} more`);
      }
    }
    
  } catch (error) {
    console.log(`\n❌ ERROR: ${error.message}`);
    if (error.response) {
      console.log(`   Status Code: ${error.response.status}`);
      console.log(`   Response:`, JSON.stringify(error.response.data, null, 2));
    }
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Run tests
(async () => {
  await testPlacesAPI('hospital');
  await testPlacesAPI('pharmacy');
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ TEST COMPLETE');
  console.log('='.repeat(70));
  console.log('\n💡 Next Steps:');
  console.log('   1. If ZERO_RESULTS: Add campus locations to MongoDB');
  console.log('   2. If REQUEST_DENIED: Check API key and billing');
  console.log('   3. If OK: Your API is working! Check frontend logs\n');
})();
