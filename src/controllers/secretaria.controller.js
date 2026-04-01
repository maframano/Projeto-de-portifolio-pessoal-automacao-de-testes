const secretariaModel = require('../models/secretaria.model');

const bcrypt = require('bcryptjs');

exports.listarSecretarias = async (req, res) => {
  try {
    const secretarias = await secretariaModel.getAll();
    res.json(secretarias);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar secretárias.' });
  }
};

exports.cadastrarSecretaria = async (req, res) => {
  try {
    const novaSecretaria = req.body;
    if (!novaSecretaria.nome || !novaSecretaria.email || !novaSecretaria.senha) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }
    // Hash da senha
    const senha_hash = await bcrypt.hash(novaSecretaria.senha, 10);
    const secretariaParaSalvar = {
      nome: novaSecretaria.nome,
      email: novaSecretaria.email,
      senha_hash
    };
    const secretariaSalva = await secretariaModel.save(secretariaParaSalvar);
    res.status(201).json(secretariaSalva);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao cadastrar secretária.' });
  }
};
