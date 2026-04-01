const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorio.controller');

router.get('/presencas/domingo/:data', relatorioController.presencasPorDomingo);
router.get('/presencas/trimestre/:ano/:trimestre', relatorioController.presencasPorTrimestre);
router.get('/vencedores/trimestre/:ano/:trimestre', relatorioController.vencedoresTrimestre);
router.get('/aniversariantes', relatorioController.aniversariantes);

module.exports = router;
