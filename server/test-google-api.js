// Quick test script to verify Google Places API
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

// Test coordinates (Jalandhar, Punjab, India)
const testLat = 31.251795;
const testLng = 75.703677;
const testRadius = 20000; // 20km

async function testGooglePlaces() {
  console.log('🧪 Testing Google Places API...\n');
  console.log(`API Key: ${GOOGLE_PLACES_API_KEY ? GOOGLE_PLACES_API_KEY.substring(0, 20) + '...' : 'NOT FOUND'}`);
  console.log(`Location: ${testLat}, ${testLng}`);
  console.log(`Radius: ${testRadius}m (${testRadius/1000}km)\n`);

  try {
    // Test pharmacies
    console.log('📍 Testing Pharmacies...');
    const pharmacyResponse = await axios.get(PLACES_API_URL, {
      params: {
        location: `${testLat},${testLng}`,
        radius: testRadius,
        type: 'pharmacy',
        key: GOOGLE_PLACES_API_KEY
      }
    });

    console.log(`Status: ${pharmacyResponse.data.status}`);
    console.log(`Results: ${pharmacyResponse.data.results?.length || 0}`);
    if (pharmacyResponse.data.error_message) {
      console.error(`Error: ${pharmacyResponse.data.error_message}`);
    }
    if (pharmacyResponse.data.results?.length > 0) {
      console.log('Sample results:');
      pharmacyResponse.data.results.slice(0, 3).forEach((place, i) => {
        console.log(`  ${i+1}. ${place.name} - ${place.vicinity}`);
      });
    }

    console.log('\n📍 Testing Hospitals...');
    const hospitalResponse = await axios.get(PLACES_API_URL, {
      params: {
        location: `${testLat},${testLng}`,
        radius: testRadius,
        type: 'hospital',
        key: GOOGLE_PLACES_API_KEY
      }
    });

    console.log(`Status: ${hospitalResponse.data.status}`);
    console.log(`Results: ${hospitalResponse.data.results?.length || 0}`);
    if (hospitalResponse.data.error_message) {
      console.error(`Error: ${hospitalResponse.data.error_message}`);
    }
    if (hospitalResponse.data.results?.length > 0) {
      console.log('Sample results:');
      hospitalResponse.data.results.slice(0, 3).forEach((place, i) => {
        console.log(`  ${i+1}. ${place.name} - ${place.vicinity}`);
      });
    }

    console.log('\n✅ Test complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testGooglePlaces();
