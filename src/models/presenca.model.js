const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const PRESENCAS_CSV = path.join(__dirname, '../../data/presencas.csv');

const csvWriter = createCsvWriter({
  path: PRESENCAS_CSV,
  header: [
    { id: 'id', title: 'id' },
    { id: 'aluno_id', title: 'aluno_id' },
    { id: 'classe_id', title: 'classe_id' },
    { id: 'data_domingo', title: 'data_domingo' },
    { id: 'trimestre', title: 'trimestre' },
    { id: 'ano', title: 'ano' },
    { id: 'presente', title: 'presente' }
  ],
  append: false
});

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      const presencas = [];
      fs.createReadStream(PRESENCAS_CSV)
        .pipe(csv())
        .on('data', (row) => presencas.push(row))
        .on('end', () => resolve(presencas))
        .on('error', reject);
    });
  },
  save: async (presenca) => {
    const presencas = await module.exports.getAll();
    const novoId = presencas.length > 0 ? (parseInt(presencas[presencas.length - 1].id) + 1).toString() : '1';
    const novaPresenca = { ...presenca, id: novoId };
    presencas.push(novaPresenca);
    await csvWriter.writeRecords(presencas);
    return novaPresenca;
  }
};
