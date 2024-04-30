const express = require('express');
const elevationViewController = require('../controllers/elevationViewController');
const router = express.Router();

//router.post('/', projectController.createProject);
router.get('/', elevationViewController.getAllElevations);
router.get('/:jobCode', elevationViewController.getElevationsByProject);
//router.put('/:id', projectController.updateProject);
//router.delete('/:id', projectController.deleteProject);

module.exports = router;
