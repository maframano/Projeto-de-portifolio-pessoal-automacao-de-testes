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
        .on('data', (row) => { if(row.funcao === 'secretaria') pessoas.push(row); })
        .on('end', () => resolve(pessoas))
        .on('error', reject);
    });
  },
  save: async (secretaria) => {
    const pessoas = [];
    fs.createReadStream(ALUNOS_CSV)
      .pipe(csv())
      .on('data', (row) => pessoas.push(row))
      .on('end', async () => {
        const novoId = pessoas.length > 0 ? (parseInt(pessoas[pessoas.length - 1].id) + 1).toString() : '1';
        const novaSecretaria = { ...secretaria, id: novoId, funcao: 'secretaria' };
        pessoas.push(novaSecretaria);
        await csvWriter.writeRecords(pessoas);
        return novaSecretaria;
      });
    return { ...secretaria, funcao: 'secretaria' };
  }
};
