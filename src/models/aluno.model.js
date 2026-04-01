const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { writeToPath } = require('csv-writer');

const ALUNOS_CSV = path.join(__dirname, '../../data/alunos.csv');

// Funções para ler e escrever alunos
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: ALUNOS_CSV,
  header: [
    { id: 'id', title: 'id' },
    { id: 'nome', title: 'nome' },
    { id: 'data_nascimento', title: 'data_nascimento' },
    { id: 'sexo', title: 'sexo' },
    { id: 'estado_civil', title: 'estado_civil' },
    { id: 'telefone', title: 'telefone' },
    { id: 'email', title: 'email' },
    { id: 'classe_id', title: 'classe_id' },
    { id: 'data_matricula', title: 'data_matricula' },
    { id: 'ativo', title: 'ativo' }
  ],
  append: false
});

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      const alunos = [];
      fs.createReadStream(ALUNOS_CSV)
        .pipe(csv())
        .on('data', (row) => alunos.push(row))
        .on('end', () => resolve(alunos))
        .on('error', reject);
    });
  },
  save: async (aluno) => {
    // Lê todos os alunos, adiciona o novo e reescreve o arquivo
    const alunos = await module.exports.getAll();
    const novoId = alunos.length > 0 ? (parseInt(alunos[alunos.length - 1].id) + 1).toString() : '1';
    const novoAluno = { ...aluno, id: novoId };
    alunos.push(novoAluno);
    await csvWriter.writeRecords(alunos);
    return novoAluno;
  }
};
