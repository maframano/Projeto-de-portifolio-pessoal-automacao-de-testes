const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/aluno.controller');


router.get('/', alunoController.listarAlunos);
router.post('/', alunoController.cadastrarAluno);

module.exports = router;
