import express from 'express';
import { getAllElevations, getElevationsByProject } from '../controllers/elevationViewController';

const router = express.Router();

router.get('/', getAllElevations);
router.get('/:jobCode', getElevationsByProject);

export default router;
