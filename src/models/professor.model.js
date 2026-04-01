const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const PROFESSORES_CSV = path.join(__dirname, '../../data/professores.csv');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: PROFESSORES_CSV,
  header: [
    { id: 'id', title: 'id' },
    { id: 'nome', title: 'nome' },
    { id: 'data_nascimento', title: 'data_nascimento' },
    { id: 'sexo', title: 'sexo' },
    { id: 'telefone', title: 'telefone' },
    { id: 'email', title: 'email' },
    { id: 'classe_id', title: 'classe_id' },
    { id: 'data_cadastro', title: 'data_cadastro' }
  ],
  append: false
});

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      const professores = [];
      fs.createReadStream(PROFESSORES_CSV)
        .pipe(csv())
        .on('data', (row) => professores.push(row))
        .on('end', () => resolve(professores))
        .on('error', reject);
    });
  },
  save: async (professor) => {
    const professores = await module.exports.getAll();
    const novoId = professores.length > 0 ? (parseInt(professores[professores.length - 1].id) + 1).toString() : '1';
    const novoProfessor = { ...professor, id: novoId };
    professores.push(novoProfessor);
    await csvWriter.writeRecords(professores);
    return novoProfessor;
  }
};
