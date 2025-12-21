import express from 'express';
import { getNearbyPharmacies, getAllPharmacies, getPharmacyById } from '../controllers/pharmacyController.js';

const router = express.Router();

router.get('/nearby', getNearbyPharmacies);
router.get('/', getAllPharmacies);
router.get('/:id', getPharmacyById);

export default router;
