const express = require('express');
const mcsController = require('../controllers/mcsController');
const router = express.Router();

router.get('/', mcsController.getMCSReport);
router.get('/:project_id', mcsController.getMCSReportById);

module.exports = router;