const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchController');
const { validarIdObjeto } = require('../validations/matchValidation');

router.get('/:id', validarIdObjeto, getMatches);

module.exports = router;