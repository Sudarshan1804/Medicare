import Pharmacy from '../models/Pharmacy.js';

// @desc    Get nearby pharmacies within radius
// @route   GET /api/pharmacies/nearby
// @access  Public
export const getNearbyPharmacies = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, open24x7, useGooglePlaces } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusInKm = parseFloat(radius);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    // Build query filter
    const filter = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radiusInKm * 1000 // Convert km to meters
        }
      },
      isActive: true
    };

    // Add 24x7 filter if provided
    if (open24x7 === 'true') {
      filter.isOpen24x7 = true;
    }

    let pharmacies;

    // Find pharmacies within radius using geospatial query from database
    const dbPharmacies = await Pharmacy.find(filter);

    // Calculate distance for each pharmacy
    pharmacies = dbPharmacies.map(pharmacy => {
      const distance = calculateDistance(
        lat,
        lng,
        pharmacy.location.coordinates[1],
        pharmacy.location.coordinates[0]
      );

      return {
        ...pharmacy.toObject(),
        distance: parseFloat(distance.toFixed(2)),
        address: `${distance.toFixed(1)} km from your location`,
        source: 'database'
      };
    });

    // Sort by distance
    pharmacies.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: pharmacies.length,
      data: pharmacies
    });
  } catch (error) {
    console.error('Get nearby pharmacies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all pharmacies
// @route   GET /api/pharmacies
// @access  Public
export const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      count: pharmacies.length,
      data: pharmacies
    });
  } catch (error) {
    console.error('Get all pharmacies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get pharmacy by ID
// @route   GET /api/pharmacies/:id
// @access  Public
export const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    console.error('Get pharmacy by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
