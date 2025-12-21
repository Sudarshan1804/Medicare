import express from 'express';
import { getNearbyHospitals, getAllHospitals, getHospitalById } from '../controllers/hospitalController.js';

const router = express.Router();

router.get('/nearby', getNearbyHospitals);
router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);

export default router;
