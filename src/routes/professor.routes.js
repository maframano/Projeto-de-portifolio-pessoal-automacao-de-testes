const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professor.controller');


router.get('/', professorController.listarProfessores);
router.post('/', professorController.cadastrarProfessor);

module.exports = router;
