const presencaModel = require('../models/presenca.model');

exports.listarPresencas = async (req, res) => {
  try {
    const presencas = await presencaModel.getAll();
    res.json(presencas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar presenças.' });
  }
};

exports.registrarPresenca = async (req, res) => {
  try {
    const novaPresenca = req.body;
    if (!novaPresenca.aluno_id || !novaPresenca.classe_id || !novaPresenca.data_domingo || !novaPresenca.trimestre || !novaPresenca.ano || typeof novaPresenca.presente === 'undefined') {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }
    const presencaSalva = await presencaModel.save(novaPresenca);
    res.status(201).json(presencaSalva);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar presença.' });
  }
};
