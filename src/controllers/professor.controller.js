const professorModel = require('../models/professor.model');

exports.listarProfessores = async (req, res) => {
  try {
    const professores = await professorModel.getAll();
    res.json(professores);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar professores.' });
  }
};

exports.cadastrarProfessor = async (req, res) => {
  try {
    const novoProfessor = req.body;
    if (!novoProfessor.nome || !novoProfessor.data_nascimento || !novoProfessor.sexo) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }
    const hoje = new Date();
    novoProfessor.data_cadastro = hoje.toISOString().slice(0, 10);
    // classe_id pode ser informado ou vazio
    const professorSalvo = await professorModel.save(novoProfessor);
    res.status(201).json(professorSalvo);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao cadastrar professor.' });
  }
};
