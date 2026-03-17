const express = require('express');
const router = express.Router();
const { getAllHospitals, getHospitalById, updateBeds } = require('../controllers/hospital.controller');

router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.patch('/:id/beds', updateBeds);

module.exports = router;