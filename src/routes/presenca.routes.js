const express = require('express');
const router = express.Router();
const presencaController = require('../controllers/presenca.controller');

router.get('/', presencaController.listarPresencas);
router.post('/', presencaController.registrarPresenca);

module.exports = router;
