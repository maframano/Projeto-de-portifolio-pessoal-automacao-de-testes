const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const SECRETARIA_CSV = path.join(__dirname, '../../data/secretaria.csv');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: SECRETARIA_CSV,
  header: [
    { id: 'id', title: 'id' },
    { id: 'nome', title: 'nome' },
    { id: 'email', title: 'email' },
    { id: 'senha_hash', title: 'senha_hash' }
  ],
  append: false
});

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      const secretarias = [];
      fs.createReadStream(SECRETARIA_CSV)
        .pipe(csv())
        .on('data', (row) => secretarias.push(row))
        .on('end', () => resolve(secretarias))
        .on('error', reject);
    });
  },
  save: async (secretaria) => {
    const secretarias = await module.exports.getAll();
    const novoId = secretarias.length > 0 ? (parseInt(secretarias[secretarias.length - 1].id) + 1).toString() : '1';
    const novaSecretaria = { ...secretaria, id: novoId };
    secretarias.push(novaSecretaria);
    await csvWriter.writeRecords(secretarias);
    return novaSecretaria;
  }
};
