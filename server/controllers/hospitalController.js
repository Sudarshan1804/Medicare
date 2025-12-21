import Hospital from '../models/Hospital.js';

// @desc    Get nearby hospitals within radius
// @route   GET /api/hospitals/nearby
// @access  Public
export const getNearbyHospitals = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, specialty, useGooglePlaces } = req.query;

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

    // Add specialty filter if provided
    if (specialty && specialty !== 'all') {
      filter.specialties = { $regex: new RegExp(specialty, 'i') };
    }

    let hospitals;

    // Find hospitals within radius using geospatial query from database
    const dbHospitals = await Hospital.find(filter);

    // Calculate distance for each hospital
    hospitals = dbHospitals.map(hospital => {
      const distance = calculateDistance(
        lat,
        lng,
        hospital.location.coordinates[1],
        hospital.location.coordinates[0]
      );

      return {
        ...hospital.toObject(),
        distance: parseFloat(distance.toFixed(2)),
        source: 'database'
      };
    });

    // Sort by distance
    hospitals.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (error) {
    console.error('Get nearby hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (error) {
    console.error('Get all hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get hospital by ID
// @route   GET /api/hospitals/:id
// @access  Public
export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hospital
    });
  } catch (error) {
    console.error('Get hospital by ID error:', error);
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
