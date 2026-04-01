const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const TRIMESTRES_CSV = path.join(__dirname, '../../data/trimestres.csv');

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      const trimestres = [];
      fs.createReadStream(TRIMESTRES_CSV)
        .pipe(csv())
        .on('data', (row) => trimestres.push(row))
        .on('end', () => resolve(trimestres))
        .on('error', reject);
    });
  },
};
