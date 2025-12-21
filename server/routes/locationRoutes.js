import express from 'express';
import { 
  getNearbyPlaces, 
  getDirectionsRoute 
} from '../controllers/locationController.js';

const router = express.Router();

// @route   GET /api/location/nearby
// @desc    Get nearby hospitals and pharmacies using Google Places API with MongoDB fallback
// @access  Public
router.get('/nearby', getNearbyPlaces);

// @route   GET /api/location/directions
// @desc    Get directions from user location to destination
// @access  Public
router.get('/directions', getDirectionsRoute);

export default router;
