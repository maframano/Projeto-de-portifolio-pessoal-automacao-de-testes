const secretariaModel = require('../models/secretaria.model');

const bcrypt = require('bcryptjs');

exports.listarSecretarias = async (req, res) => {
  try {
    const pessoas = await secretariaModel.getAll();
    const secretarias = pessoas.filter(p => p.funcao === 'secretaria');
    res.json(secretarias);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar secretárias.' });
  }
};

exports.cadastrarSecretaria = async (req, res) => {
  try {
    const novaSecretaria = req.body;
    if (!novaSecretaria.nome || !novaSecretaria.email || !novaSecretaria.senha || !novaSecretaria.data_nascimento || !novaSecretaria.telefone) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }
    // Hash da senha
    const senha_hash = await bcrypt.hash(novaSecretaria.senha, 10);
    const secretariaParaSalvar = {
      nome: novaSecretaria.nome,
      email: novaSecretaria.email,
      data_nascimento: novaSecretaria.data_nascimento,
      telefone: novaSecretaria.telefone,
      senha_hash
    };
    const secretariaSalva = await secretariaModel.save({ ...secretariaParaSalvar, funcao: 'secretaria' });
    res.status(201).json(secretariaSalva);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao cadastrar secretária.' });
  }
};
