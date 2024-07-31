import express from 'express';
import { getMCSReport, getMCSReportById } from '../controllers/mcsReportController';

const router = express.Router();

router.get('/', getMCSReport);
router.get('/:project_id', getMCSReportById);

export default router;
