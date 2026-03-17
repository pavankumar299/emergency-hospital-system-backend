const express = require('express');
const router = express.Router();
const { getAlertsByHospital, acknowledgeAlert } = require('../controllers/alert.controller');

router.get('/:hospitalId', getAlertsByHospital);
router.patch('/:id/acknowledge', acknowledgeAlert);

module.exports = router;