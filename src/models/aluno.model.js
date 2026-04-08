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
    { id: 'data_matricula', title: 'data_matricula' },
    { id: 'ativo', title: 'ativo' },
    { id: 'sexo', title: 'sexo' },
    { id: 'estado_civil', title: 'estado_civil' },
    { id: 'senha_hash', title: 'senha_hash' }
  ],
  append: false
});

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      const pessoas = [];
      fs.createReadStream(ALUNOS_CSV)
        .pipe(csv())
        .on('data', (row) => pessoas.push(row))
        .on('end', () => resolve(pessoas))
        .on('error', reject);
    });
  },
  save: async (pessoa) => {
    const pessoas = await module.exports.getAll();
    const novoId = pessoas.length > 0 ? (parseInt(pessoas[pessoas.length - 1].id) + 1).toString() : '1';
    const novaPessoa = { ...pessoa, id: novoId };
    pessoas.push(novaPessoa);
    await csvWriter.writeRecords(pessoas);
    return novaPessoa;
  }
};
