import { 
  getNearbyHospitals as getOSMHospitals, 
  getNearbyPharmacies as getOSMPharmacies 
} from '../services/overpassService.js';
import Hospital from '../models/Hospital.js';
import Pharmacy from '../models/Pharmacy.js';

/**
 * Calculate distance between two coordinates using Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

/**
 * @desc    Get nearby hospitals and pharmacies using Google Places API with MongoDB fallback
 * @route   GET /api/location/nearby
 * @access  Public
 * @query   latitude, longitude, radius (in km), type (hospital|pharmacy|both)
 */
export const getNearbyPlaces = async (req, res) => {
  try {
    const { latitude, longitude, radius = 20, type = 'both' } = req.query;

    // Validate required parameters
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusInKm = parseFloat(radius);
    const radiusInMeters = radiusInKm * 1000;

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📍 LOCATION REQUEST`);
    console.log(`${'='.repeat(60)}`);
    console.log(`   Coordinates: ${lat.toFixed(8)}, ${lng.toFixed(8)}`);
    console.log(`   Radius: ${radiusInKm}km (${radiusInMeters}m)`);
    console.log(`   Type: ${type}`);
    console.log(`   Client IP: ${req.ip || req.connection.remoteAddress}`);
    console.log(`${'='.repeat(60)}\n`);

    let hospitals = [];
    let pharmacies = [];
    let source = 'openstreetmap'; // Use OpenStreetMap as primary source
    let raw = { request: { lat, lng, radius_m: radiusInMeters, type } };

    // Fetch from OpenStreetMap (Overpass API)
    console.log(`\n${'='.repeat(60)}`);
    console.log('🗺️  FETCHING FROM OPENSTREETMAP (OVERPASS API)');
    console.log(`${'='.repeat(60)}\n`);

    try {
      if (type === 'hospital' || type === 'both') {
        console.log('\n🏥 FETCHING HOSPITALS FROM OPENSTREETMAP');
        const osmHospitals = await getOSMHospitals(lat, lng, radiusInMeters);
        raw.osm_hospitals_count = osmHospitals.length;
        
        hospitals = osmHospitals.map(h => ({
          ...h,
          distance: parseFloat(h.distance),
          distance_km: parseFloat(h.distance),
          distance_m: Math.round(parseFloat(h.distance) * 1000)
        }));
        
        console.log(`✅ Found ${hospitals.length} hospitals from OpenStreetMap`);
      }

      if (type === 'pharmacy' || type === 'both') {
        console.log('\n💊 FETCHING PHARMACIES FROM OPENSTREETMAP');
        const osmPharmacies = await getOSMPharmacies(lat, lng, radiusInMeters);
        raw.osm_pharmacies_count = osmPharmacies.length;
        
        pharmacies = osmPharmacies.map(p => ({
          ...p,
          distance: parseFloat(p.distance),
          distance_km: parseFloat(p.distance),
          distance_m: Math.round(parseFloat(p.distance) * 1000)
        }));
        
        console.log(`✅ Found ${pharmacies.length} pharmacies from OpenStreetMap`);
      }
    } catch (osmError) {
      console.error('\n⚠️ OPENSTREETMAP API ERROR:', osmError.message);
      raw.osm_error = osmError.message;
    }

    const totalOSMResults = hospitals.length + pharmacies.length;
    console.log(`\n📊 OpenStreetMap Results: ${totalOSMResults} total (${hospitals.length} hospitals, ${pharmacies.length} pharmacies)`);
    
    // Fallback to MongoDB if OpenStreetMap returns no results
    if (totalOSMResults === 0) {
      console.log(`\n${'='.repeat(60)}`);
      console.log('💾 FALLING BACK TO MONGODB');
      console.log(`${'='.repeat(60)}\n`);
      source = 'mongo';

      try {
        if (type === 'hospital' || type === 'both') {
          console.log(`\n🏥 Querying MongoDB for hospitals...`);
          console.log(`   Query: { location: { $nearSphere: { $geometry: { type: "Point", coordinates: [${lng}, ${lat}] }, $maxDistance: ${radiusInMeters} }}, isActive: true }`);
          
          const dbHospitals = await Hospital.find({
            location: {
              $nearSphere: {
                $geometry: { type: 'Point', coordinates: [lng, lat] },
                $maxDistance: radiusInMeters
              }
            },
            isActive: true
          }).limit(20);

          raw.mongo_hospitals_count = dbHospitals.length;

          hospitals = dbHospitals.map(h => {
            const distance = calculateDistance(lat, lng, h.location.coordinates[1], h.location.coordinates[0]);
            return {
              name: h.name,
              address: h.address,
              phone: h.phone || 'N/A',
              place_id: h._id.toString(),
              lat: h.location.coordinates[1],
              lng: h.location.coordinates[0],
              distance_m: Math.round(distance * 1000),
              distance_km: parseFloat(distance.toFixed(2)),
              rating: h.rating,
              reviews: h.reviews,
              type: 'hospital',
              source: 'database'
            };
          }).sort((a, b) => a.distance_km - b.distance_km);
          
          console.log(`✅ Found ${hospitals.length} hospitals from MongoDB`);
        }

        if (type === 'pharmacy' || type === 'both') {
          console.log(`\n💊 Querying MongoDB for pharmacies...`);
          console.log(`   Query: { location: { $nearSphere: { $geometry: { type: "Point", coordinates: [${lng}, ${lat}] }, $maxDistance: ${radiusInMeters} }}, isActive: true }`);
          
          const dbPharmacies = await Pharmacy.find({
            location: {
              $nearSphere: {
                $geometry: { type: 'Point', coordinates: [lng, lat] },
                $maxDistance: radiusInMeters
              }
            },
            isActive: true
          }).limit(20);

          raw.mongo_pharmacies_count = dbPharmacies.length;

          pharmacies = dbPharmacies.map(p => {
            const distance = calculateDistance(lat, lng, p.location.coordinates[1], p.location.coordinates[0]);
            return {
              name: p.name,
              address: p.address,
              phone: p.phone || 'N/A',
              place_id: p._id.toString(),
              lat: p.location.coordinates[1],
              lng: p.location.coordinates[0],
              distance_m: Math.round(distance * 1000),
              distance_km: parseFloat(distance.toFixed(2)),
              rating: p.rating,
              reviews: p.reviews,
              isOpen: p.isOpen,
              isOpen24x7: p.isOpen24x7,
              type: 'pharmacy',
              source: 'database'
            };
          }).sort((a, b) => a.distance_km - b.distance_km);
          
          console.log(`✅ Found ${pharmacies.length} pharmacies from MongoDB`);
        }
      } catch (mongoError) {
        console.error('❌ MongoDB query error:', mongoError.message);
        raw.mongo_error = mongoError.message;
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch from both Google Places and database',
          raw
        });
      }
    }

    // Combine results
    const items = type === 'both' 
      ? [...hospitals, ...pharmacies]
      : type === 'hospital' ? hospitals : pharmacies;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 FINAL RESULTS`);
    console.log(`${'='.repeat(60)}`);
    console.log(`   Total: ${items.length} places`);
    console.log(`   Source: ${source}`);
    console.log(`   Hospitals: ${hospitals.length}`);
    console.log(`   Pharmacies: ${pharmacies.length}`);
    if (items.length > 0) {
      console.log(`   Closest: ${items[0].name} (${items[0].distance_km}km)`);
    }
    console.log(`${'='.repeat(60)}\n`);

    return res.status(200).json({
      success: true,
      source,
      count: items.length,
      items,
      location: { lat, lng },
      radius_km: radiusInKm,
      raw // Include raw debug data
    });

  } catch (error) {
    console.error('❌ Location controller error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch nearby places'
    });
  }
};

/**
 * @desc    Get directions from origin to destination using Google Directions API
 * @route   GET /api/location/directions
 * @access  Public
 * @query   originLat, originLng, destLat, destLng, placeId (optional, used instead of destLat/destLng)
 */
export const getDirectionsRoute = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng, placeId } = req.query;

    // Validate required parameters
    if (!originLat || !originLng) {
      return res.status(400).json({
        success: false,
        message: 'Origin coordinates (originLat, originLng) are required'
      });
    }

    if (!placeId && (!destLat || !destLng)) {
      return res.status(400).json({
        success: false,
        message: 'Either destination coordinates (destLat, destLng) or placeId is required'
      });
    }

    const oLat = parseFloat(originLat);
    const oLng = parseFloat(originLng);
    const dLat = destLat ? parseFloat(destLat) : null;
    const dLng = destLng ? parseFloat(destLng) : null;

    console.log(`\n🗺️ Directions Request:`, {
      origin: `${oLat}, ${oLng}`,
      destination: placeId || `${dLat}, ${dLng}`
    });

    // Fetch directions from Google Directions API
    const result = await getDirections(oLat, oLng, dLat, dLng, placeId);

    if (result.success) {
      console.log(`✅ Directions retrieved: ${result.route.distance_text}, ${result.route.duration_text}`);
      return res.status(200).json(result);
    } else {
      console.log(`⚠️ Directions failed: ${result.message}`);
      return res.status(404).json(result);
    }

  } catch (error) {
    console.error('❌ Directions controller error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch directions'
    });
  }
};

export default {
  getNearbyPlaces,
  getDirectionsRoute
};
