const presencaModel = require('../models/presenca.model');
const alunoModel = require('../models/aluno.model');
const professorModel = require('../models/professor.model');

// Presença por classe em um domingo
exports.presencasPorDomingo = async (req, res) => {
  try {
    const { data } = req.params;
    const presencas = await presencaModel.getAll();
    const alunos = await alunoModel.getAll();
    const porClasse = {};
    presencas.filter(p => p.data_domingo === data && p.presente === 'true').forEach(p => {
      porClasse[p.classe_id] = (porClasse[p.classe_id] || 0) + 1;
    });
    res.json(porClasse);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao gerar relatório.' });
  }
};

// Presença acumulada por classe no trimestre
exports.presencasPorTrimestre = async (req, res) => {
  try {
    const { ano, trimestre } = req.params;
    const presencas = await presencaModel.getAll();
    const porClasse = {};
    presencas.filter(p => p.ano === ano && p.trimestre === trimestre && p.presente === 'true').forEach(p => {
      porClasse[p.classe_id] = (porClasse[p.classe_id] || 0) + 1;
    });
    res.json(porClasse);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao gerar relatório.' });
  }
};

// Classe vencedora e aluno ganhador por classe no trimestre
exports.vencedoresTrimestre = async (req, res) => {
  try {
    const { ano, trimestre } = req.params;
    const presencas = await presencaModel.getAll();
    const alunos = await alunoModel.getAll();
    // Cálculo de percentual de presença por classe
    const totalPorClasse = {};
    const presentesPorClasse = {};
    alunos.forEach(a => {
      totalPorClasse[a.classe_id] = (totalPorClasse[a.classe_id] || 0) + 1;
    });
    presencas.filter(p => p.ano === ano && p.trimestre === trimestre && p.presente === 'true').forEach(p => {
      presentesPorClasse[p.classe_id] = (presentesPorClasse[p.classe_id] || 0) + 1;
    });
    let classeVencedora = null;
    let maiorPercentual = 0;
    Object.keys(totalPorClasse).forEach(cid => {
      const percentual = totalPorClasse[cid] ? (presentesPorClasse[cid] || 0) / totalPorClasse[cid] * 100 : 0;
      if (percentual > maiorPercentual) {
        maiorPercentual = percentual;
        classeVencedora = cid;
      }
    });
    // Aluno ganhador por classe
    const ganhadores = {};
    Object.keys(totalPorClasse).forEach(cid => {
      let maxPresencas = 0;
      let alunoGanhador = null;
      alunos.filter(a => a.classe_id === cid).forEach(a => {
        const presencasAluno = presencas.filter(p => p.ano === ano && p.trimestre === trimestre && p.aluno_id === a.id && p.presente === 'true').length;
        if (presencasAluno > maxPresencas) {
          maxPresencas = presencasAluno;
          alunoGanhador = a;
        }
      });
      if (alunoGanhador) {
        ganhadores[cid] = { aluno: alunoGanhador, presencas: maxPresencas };
      }
    });
    res.json({ classeVencedora, maiorPercentual, ganhadores });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao gerar relatório.' });
  }
};

// Lista de aniversariantes (alunos e professores)
exports.aniversariantes = async (req, res) => {
  try {
    const alunos = await alunoModel.getAll();
    const professores = await professorModel.getAll();
    const todos = [...alunos, ...professores].map(p => ({
      nome: p.nome,
      data_nascimento: p.data_nascimento
    }));
    todos.sort((a, b) => new Date('2000-' + a.data_nascimento.slice(5)) - new Date('2000-' + b.data_nascimento.slice(5)));
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao gerar aniversariantes.' });
  }
};
