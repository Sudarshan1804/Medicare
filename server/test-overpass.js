// Test Overpass API directly
import { getNearbyHospitals, getNearbyPharmacies } from './services/overpassService.js';

// Your exact location from the logs
const testLat = 31.251795;
const testLng = 75.703677;
const testRadius = 20000; // 20km in meters

console.log('🧪 Testing Overpass API (OpenStreetMap Data)...\n');
console.log(`Location: ${testLat}, ${testLng}`);
console.log(`Radius: ${testRadius}m (${testRadius/1000}km)\n`);

async function testOverpass() {
  try {
    console.log('📍 Fetching Pharmacies...\n');
    const pharmacies = await getNearbyPharmacies(testLat, testLng, testRadius);
    console.log(`\n✅ Found ${pharmacies.length} pharmacies`);
    if (pharmacies.length > 0) {
      console.log('\nTop 10 Closest Pharmacies:');
      pharmacies.slice(0, 10).forEach((p, i) => {
        console.log(`${i+1}. ${p.name}`);
        console.log(`   Address: ${p.address}`);
        console.log(`   Distance: ${p.distance}km`);
        console.log(`   Coordinates: ${p.lat}, ${p.lng}\n`);
      });
    }

    console.log('\n' + '='.repeat(60) + '\n');

    console.log('📍 Fetching Hospitals...\n');
    const hospitals = await getNearbyHospitals(testLat, testLng, testRadius);
    console.log(`\n✅ Found ${hospitals.length} hospitals/clinics`);
    if (hospitals.length > 0) {
      console.log('\nTop 10 Closest Hospitals:');
      hospitals.slice(0, 10).forEach((h, i) => {
        console.log(`${i+1}. ${h.name}`);
        console.log(`   Address: ${h.address}`);
        console.log(`   Distance: ${h.distance}km`);
        console.log(`   Coordinates: ${h.lat}, ${h.lng}\n`);
      });
    }

    console.log('\n✅ Test Complete!\n');
    console.log(`Total results: ${pharmacies.length + hospitals.length} locations found`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testOverpass();
