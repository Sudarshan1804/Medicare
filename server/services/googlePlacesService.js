import axios from 'axios';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyDQT2Il6Rz0BfRQDSAXv-GoUr1KgiENSUw';
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

/**
 * Fetch nearby hospitals from Google Places API
 */
export const fetchNearbyHospitals = async (latitude, longitude, radius = 10000) => {
  try {
    const requestUrl = `${PLACES_API_URL}?location=${latitude},${longitude}&radius=${radius}&type=hospital&key=${GOOGLE_PLACES_API_KEY.substring(0, 10)}...`;
    console.log(`\n🔍 Google Places API Request (hospitals):`);
    console.log(`   URL: ${PLACES_API_URL}`);
    console.log(`   Params: location=${latitude},${longitude} radius=${radius}m type=hospital`);
    
    const response = await axios.get(PLACES_API_URL, {
      params: {
        location: `${latitude},${longitude}`,
        radius: radius, // in meters
        type: 'hospital',
        key: GOOGLE_PLACES_API_KEY
      }
    });

    console.log(`   Response status: ${response.data.status}`);
    console.log(`   Results count: ${response.data.results?.length || 0}`);
    
    if (response.data.status === 'ZERO_RESULTS') {
      console.log(`   ⚠️ Google Places returned ZERO_RESULTS for hospitals`);
      return [];
    }
    
    if (response.data.status === 'REQUEST_DENIED') {
      console.error(`   ❌ REQUEST_DENIED: ${response.data.error_message || 'Check API key and billing'}`);
      return [];
    }

    if (response.data.status === 'OK') {
      const results = response.data.results.map(place => ({
        googlePlaceId: place.place_id,
        name: place.name,
        address: place.vicinity || place.formatted_address,
        location: {
          type: 'Point',
          coordinates: [place.geometry.location.lng, place.geometry.location.lat]
        },
        rating: place.rating || 0,
        reviews: place.user_ratings_total || 0,
        isOpen: place.opening_hours?.open_now || false,
        photos: place.photos ? place.photos.map(p => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        ) : [],
        types: place.types || []
      }));
      
      console.log(`   ✅ Returning ${results.length} hospitals`);
      return results;
    }

    return [];
  } catch (error) {
    console.error('❌ Google Places API error (hospitals):', error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`, error.response.data);
    }
    return [];
  }
};

/**
 * Fetch nearby pharmacies from Google Places API
 */
export const fetchNearbyPharmacies = async (latitude, longitude, radius = 10000) => {
  try {
    console.log(`\n🔍 Google Places API Request (pharmacies):`);
    console.log(`   URL: ${PLACES_API_URL}`);
    console.log(`   Params: location=${latitude},${longitude} radius=${radius}m type=pharmacy`);
    
    const response = await axios.get(PLACES_API_URL, {
      params: {
        location: `${latitude},${longitude}`,
        radius: radius, // in meters
        type: 'pharmacy',
        key: GOOGLE_PLACES_API_KEY
      }
    });

    console.log(`   Response status: ${response.data.status}`);
    console.log(`   Results count: ${response.data.results?.length || 0}`);
    
    if (response.data.status === 'ZERO_RESULTS') {
      console.log(`   ⚠️ Google Places returned ZERO_RESULTS for pharmacies`);
      return [];
    }
    
    if (response.data.status === 'REQUEST_DENIED') {
      console.error(`   ❌ REQUEST_DENIED: ${response.data.error_message || 'Check API key and billing'}`);
      return [];
    }

    if (response.data.status === 'OK') {
      const results = response.data.results.map(place => ({
        googlePlaceId: place.place_id,
        name: place.name,
        address: place.vicinity || place.formatted_address,
        location: {
          type: 'Point',
          coordinates: [place.geometry.location.lng, place.geometry.location.lat]
        },
        rating: place.rating || 0,
        reviews: place.user_ratings_total || 0,
        isOpen: place.opening_hours?.open_now || false,
        isOpen24x7: place.opening_hours?.periods?.length === 1 || false,
        photos: place.photos ? place.photos.map(p => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        ) : [],
        types: place.types || []
      }));
      
      console.log(`   ✅ Returning ${results.length} pharmacies`);
      return results;
    }

    return [];
  } catch (error) {
    console.error('❌ Google Places API error (pharmacies):', error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`, error.response.data);
    }
    return [];
  }
};

/**
 * Get place details from Google Places API
 */
export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(PLACE_DETAILS_URL, {
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,formatted_phone_number,opening_hours,website,rating,user_ratings_total,geometry',
        key: GOOGLE_PLACES_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      return response.data.result;
    }

    return null;
  } catch (error) {
    console.error('Google Places API error (details):', error.message);
    return null;
  }
};

/**
 * Get directions from origin to destination using Google Directions API
 * @param {number} originLat - Origin latitude
 * @param {number} originLng - Origin longitude
 * @param {number} destLat - Destination latitude (optional if placeId provided)
 * @param {number} destLng - Destination longitude (optional if placeId provided)
 * @param {string} placeId - Google Place ID of destination (optional)
 * @returns {Object} Directions data with steps, distance, duration, polyline
 */
export const getDirections = async (originLat, originLng, destLat = null, destLng = null, placeId = null) => {
  try {
    const origin = `${originLat},${originLng}`;
    let destination;
    
    if (placeId) {
      destination = `place_id:${placeId}`;
    } else if (destLat && destLng) {
      destination = `${destLat},${destLng}`;
    } else {
      throw new Error('Either placeId or destination coordinates required');
    }

    console.log('🗺️ Fetching directions:', { origin, destination });

    const response = await axios.get(DIRECTIONS_API_URL, {
      params: {
        origin,
        destination,
        mode: 'driving', // Can be: driving, walking, bicycling, transit
        alternatives: true, // Get alternative routes
        key: GOOGLE_PLACES_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.routes.length > 0) {
      const route = response.data.routes[0]; // Get first (fastest) route
      const leg = route.legs[0];

      console.log('✅ Directions retrieved:', {
        distance: leg.distance.text,
        duration: leg.duration.text
      });

      return {
        success: true,
        route: {
          distance_text: leg.distance.text,
          distance_m: leg.distance.value,
          duration_text: leg.duration.text,
          duration_s: leg.duration.value,
          start_address: leg.start_address,
          end_address: leg.end_address,
          steps: leg.steps.map(step => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Strip HTML
            distance: step.distance.text,
            duration: step.duration.text,
            maneuver: step.maneuver || 'continue'
          })),
          polyline: route.overview_polyline.points, // Encoded polyline for map rendering
          bounds: route.bounds
        },
        alternatives: response.data.routes.slice(1).map(altRoute => ({
          distance_text: altRoute.legs[0].distance.text,
          duration_text: altRoute.legs[0].duration.text,
          polyline: altRoute.overview_polyline.points
        }))
      };
    }

    return {
      success: false,
      message: response.data.status === 'ZERO_RESULTS' 
        ? 'No route found' 
        : `Directions API error: ${response.data.status}`
    };
  } catch (error) {
    console.error('Google Directions API error:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

export default {
  fetchNearbyHospitals,
  fetchNearbyPharmacies,
  getPlaceDetails,
  getDirections
};
