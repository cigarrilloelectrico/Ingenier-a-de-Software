// backend/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchController');

// Define el endpoint esperando un parámetro "id"
router.get('/:id', getMatches);

module.exports = router;