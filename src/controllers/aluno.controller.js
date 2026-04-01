const alunoModel = require('../models/aluno.model');

exports.listarAlunos = async (req, res) => {
  try {
    const alunos = await alunoModel.getAll();
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar alunos.' });
  }
};

exports.cadastrarAluno = async (req, res) => {
  try {
    const novoAluno = req.body;
    // Validação básica
    if (!novoAluno.nome || !novoAluno.data_nascimento || !novoAluno.sexo || !novoAluno.estado_civil) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }
    // Alocação automática de classe
    const dataNasc = new Date(novoAluno.data_nascimento);
    const hoje = new Date();
    const idade = hoje.getFullYear() - dataNasc.getFullYear();
    let classe_id = '';
    if (novoAluno.sexo === 'masculino' && novoAluno.estado_civil === 'casado' && idade > 30) {
      classe_id = 'abraao';
    } else if (novoAluno.sexo === 'feminino' && novoAluno.estado_civil === 'casado' && idade > 30) {
      classe_id = 'sarah';
    } else if (idade >= 15 && idade <= 17) {
      classe_id = 'mensageiros';
    } else if (idade >= 12 && idade <= 14) {
      classe_id = 'samuel';
    } else if (idade >= 4 && idade <= 11) {
      classe_id = 'cordeirinhos';
    } else {
      classe_id = 'peniel';
    }
    novoAluno.classe_id = classe_id;
    novoAluno.data_matricula = hoje.toISOString().slice(0, 10);
    novoAluno.ativo = 'true';
    // Salvar aluno
    const alunoSalvo = await alunoModel.save(novoAluno);
    res.status(201).json(alunoSalvo);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao cadastrar aluno.' });
  }
};
