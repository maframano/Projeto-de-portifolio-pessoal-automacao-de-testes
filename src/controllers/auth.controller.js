const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const csv = require('csv-parser');

const SECRETARIA_CSV = path.join(__dirname, '../../data/secretaria.csv');

exports.login = (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }
  const secretarias = [];
  fs.createReadStream(SECRETARIA_CSV)
    .pipe(csv())
    .on('data', (row) => secretarias.push(row))
    .on('end', () => {
      const secretaria = secretarias.find(s => s.email === email);
      if (!secretaria) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }
      bcrypt.compare(senha, secretaria.senha_hash, (err, result) => {
        if (err || !result) {
          return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        const token = jwt.sign({ id: secretaria.id, email: secretaria.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token });
      });
    });
};
