const express = require('express');
const router = express.Router();
const { dispatch } = require('../controllers/emergency.controller');

router.post('/dispatch', dispatch);

module.exports = router;
