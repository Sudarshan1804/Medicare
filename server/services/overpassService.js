/**
 * Overpass API Service for fetching nearby hospitals and pharmacies
 * Uses OpenStreetMap data via Overpass API
 */

import axios from 'axios';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

/**
 * Fetch nearby hospitals using Overpass API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default: 5000m = 5km)
 * @returns {Promise<Array>} Array of hospital objects
 */
async function getNearbyHospitals(lat, lng, radius = 5000) {
  try {
    // Comprehensive Overpass query for all hospital types
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        relation["amenity"="hospital"](around:${radius},${lat},${lng});
        node["amenity"="clinic"](around:${radius},${lat},${lng});
        way["amenity"="clinic"](around:${radius},${lat},${lng});
        node["amenity"="doctors"](around:${radius},${lat},${lng});
        node["healthcare"="hospital"](around:${radius},${lat},${lng});
        way["healthcare"="hospital"](around:${radius},${lat},${lng});
        node["healthcare"="clinic"](around:${radius},${lat},${lng});
        way["healthcare"="clinic"](around:${radius},${lat},${lng});
        node["healthcare"="centre"](around:${radius},${lat},${lng});
        way["healthcare"="centre"](around:${radius},${lat},${lng});
      );
      out body center tags qt;
    `;

    const response = await axios.post(OVERPASS_API_URL, query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 27000 // 27 seconds client timeout to match server timeout
    });

    console.log(`📥 Overpass API Response: ${response.data.elements?.length || 0} elements found`);

    const elements = response.data.elements || [];
    
    // Extract and clean hospital data
    const hospitals = elements
      .map(element => {
        const coords = element.center || { lat: element.lat, lon: element.lon };
        const distance = calculateDistance(lat, lng, coords.lat, coords.lon);
        
        // Try multiple name fields
        const name = element.tags?.name 
          || element.tags?.['name:en'] 
          || element.tags?.['official_name']
          || element.tags?.brand
          || element.tags?.operator
          || element.tags?.description
          || element.tags?.['alt_name']
          || null;
        
        return {
          id: element.id,
          place_id: `osm_${element.type}_${element.id}`,
          name: name,
          lat: coords.lat,
          lng: coords.lon,
          address: formatAddress(element.tags || {}),
          phone: element.tags?.phone || element.tags?.['contact:phone'] || null,
          website: element.tags?.website || element.tags?.['contact:website'] || null,
          emergency: element.tags?.emergency === 'yes',
          beds: element.tags?.beds ? parseInt(element.tags.beds) : null,
          operator: element.tags?.operator || null,
          distance: distance.toFixed(2),
          isOpen: true,
          rating: null,
          type: 'hospital',
          source: 'openstreetmap'
        };
      })
      .filter(hospital => hospital.name); // Only include hospitals with names

    // Sort by distance
    const sortedHospitals = hospitals.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    console.log(`✅ Processed ${sortedHospitals.length} hospitals, sorted by distance`);
    if (sortedHospitals.length > 0) {
      console.log(`   Closest: ${sortedHospitals[0].name} (${sortedHospitals[0].distance}km)`);
      if (sortedHospitals.length > 1) {
        console.log(`   Farthest: ${sortedHospitals[sortedHospitals.length-1].name} (${sortedHospitals[sortedHospitals.length-1].distance}km)`);
      }
    }
    return sortedHospitals;
  } catch (error) {
    console.error('Error fetching hospitals from Overpass:', error.message);
    throw error;
  }
}

/**
 * Fetch nearby pharmacies using Overpass API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default: 5000m = 5km)
 * @returns {Promise<Array>} Array of pharmacy objects
 */
async function getNearbyPharmacies(lat, lng, radius = 5000) {
  try {
    // Comprehensive Overpass query for all pharmacy types
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="pharmacy"](around:${radius},${lat},${lng});
        way["amenity"="pharmacy"](around:${radius},${lat},${lng});
        relation["amenity"="pharmacy"](around:${radius},${lat},${lng});
        node["shop"="chemist"](around:${radius},${lat},${lng});
        way["shop"="chemist"](around:${radius},${lat},${lng});
        node["healthcare"="pharmacy"](around:${radius},${lat},${lng});
        way["healthcare"="pharmacy"](around:${radius},${lat},${lng});
        node["shop"="pharmacy"](around:${radius},${lat},${lng});
        way["shop"="pharmacy"](around:${radius},${lat},${lng});
        node["dispensing"="yes"](around:${radius},${lat},${lng});
        node["shop"="drugstore"](around:${radius},${lat},${lng});
        way["shop"="drugstore"](around:${radius},${lat},${lng});
      );
      out body center tags qt;
    `;

    const response = await axios.post(OVERPASS_API_URL, query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 27000 // 27 seconds client timeout to match server timeout
    });

    console.log(`📥 Overpass API Response: ${response.data.elements?.length || 0} pharmacy elements found`);

    const elements = response.data.elements || [];
    
    // Extract and clean pharmacy data
    const pharmacies = elements
      .map(element => {
        const coords = element.center || { lat: element.lat, lon: element.lon };
        const distance = calculateDistance(lat, lng, coords.lat, coords.lon);
        
        // Try multiple name fields
        let name = element.tags?.name 
          || element.tags?.['name:en'] 
          || element.tags?.['official_name']
          || element.tags?.brand
          || element.tags?.operator
          || element.tags?.description
          || element.tags?.['alt_name'];
        
        // If no name found, generate one based on type and location
        if (!name) {
          const type = element.tags?.shop === 'chemist' ? 'Chemist' 
                    : element.tags?.shop === 'drugstore' ? 'Drugstore'
                    : 'Pharmacy';
          name = `${type} (${distance.toFixed(1)}km away)`;
        }
        
        return {
          id: element.id,
          place_id: `osm_${element.type}_${element.id}`,
          name: name,
          lat: coords.lat,
          lng: coords.lon,
          address: formatAddress(element.tags || {}),
          phone: element.tags?.phone || element.tags?.['contact:phone'] || null,
          website: element.tags?.website || element.tags?.['contact:website'] || null,
          dispensing: element.tags?.dispensing !== 'no',
          wheelchair: element.tags?.wheelchair === 'yes',
          opening_hours: element.tags?.opening_hours || null,
          operator: element.tags?.operator || null,
          distance: distance.toFixed(2),
          isOpen: checkOpeningHours(element.tags?.opening_hours),
          rating: null,
          type: 'pharmacy',
          source: 'openstreetmap'
        };
      });

    // Sort by distance
    const sortedPharmacies = pharmacies.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    console.log(`✅ Processed ${sortedPharmacies.length} pharmacies, sorted by distance`);
    if (sortedPharmacies.length > 0) {
      console.log(`   Closest: ${sortedPharmacies[0].name} (${sortedPharmacies[0].distance}km)`);
      if (sortedPharmacies.length > 1) {
        console.log(`   Farthest: ${sortedPharmacies[sortedPharmacies.length-1].name} (${sortedPharmacies[sortedPharmacies.length-1].distance}km)`);
      }
    }
    return sortedPharmacies;
  } catch (error) {
    console.error('Error fetching pharmacies from Overpass:', error.message);
    throw error;
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Format address from OSM tags
 * @param {Object} tags - OSM tags
 * @returns {string} Formatted address
 */
function formatAddress(tags) {
  const parts = [];
  
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:state']) parts.push(tags['addr:state']);
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
  
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
}

/**
 * Check if a place is currently open based on opening_hours tag
 * Simplified version - just returns true if hours exist
 * @param {string} openingHours - OSM opening_hours tag
 * @returns {boolean} Whether place is open
 */
function checkOpeningHours(openingHours) {
  if (!openingHours) return true; // Assume open if no hours specified
  
  // For "24/7" format
  if (openingHours === '24/7') return true;
  
  // For other formats, assume open (proper parsing would be complex)
  return true;
}

export {
  getNearbyHospitals,
  getNearbyPharmacies
};
