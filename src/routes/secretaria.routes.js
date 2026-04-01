const express = require('express');
const router = express.Router();
const secretariaController = require('../controllers/secretaria.controller');


router.get('/', secretariaController.listarSecretarias);
router.post('/', secretariaController.cadastrarSecretaria);

module.exports = router;
