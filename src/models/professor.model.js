const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const ALUNOS_CSV = path.join(__dirname, '../../data/alunos.csv');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: ALUNOS_CSV,
  header: [
    { id: 'id', title: 'id' },
    { id: 'nome', title: 'nome' },
    { id: 'data_nascimento', title: 'data_nascimento' },
    { id: 'telefone', title: 'telefone' },
    { id: 'email', title: 'email' },
    { id: 'funcao', title: 'funcao' },
    { id: 'classe_id', title: 'classe_id' },
    { id: 'data_cadastro', title: 'data_cadastro' },
    { id: 'sexo', title: 'sexo' }
  ],
  append: false
});

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      const pessoas = [];
      fs.createReadStream(ALUNOS_CSV)
        .pipe(csv())
        .on('data', (row) => { if(row.funcao === 'professor') pessoas.push(row); })
        .on('end', () => resolve(pessoas))
        .on('error', reject);
    });
  },
  save: async (professor) => {
    const pessoas = await module.exports.getAll();
    // Para garantir unicidade de id entre todos
    const todos = [];
    fs.createReadStream(ALUNOS_CSV)
      .pipe(csv())
      .on('data', (row) => todos.push(row))
      .on('end', async () => {
        const novoId = todos.length > 0 ? (parseInt(todos[todos.length - 1].id) + 1).toString() : '1';
        const novoProfessor = { ...professor, id: novoId, funcao: 'professor' };
        todos.push(novoProfessor);
        await csvWriter.writeRecords(todos);
        return novoProfessor;
      });
    // Retorno imediato para compatibilidade
    return { ...professor, funcao: 'professor' };
  }
};
