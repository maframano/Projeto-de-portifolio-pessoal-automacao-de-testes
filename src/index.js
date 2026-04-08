const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const relatorioRoutes = require('./routes/relatorio.routes');
const presencaRoutes = require('./routes/presenca.routes');
const secretariaRoutes = require('./routes/secretaria.routes');
const professorRoutes = require('./routes/professor.routes');
const alunoRoutes = require('./routes/aluno.routes');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

// Carregar swagger.json
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/swagger.json'), 'utf8'));

// Endpoint público para Swagger
app.use('/swagger-ebd', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const authMiddleware = require('./middlewares/auth.middleware');
const authRoutes = require('./routes/auth.routes');

app.use(authMiddleware);
app.use('/auth', authRoutes);
app.use('/alunos', alunoRoutes);
app.use('/professores', professorRoutes);
app.use('/secretaria', secretariaRoutes);
app.use('/presencas', presencaRoutes);
app.use('/relatorios', relatorioRoutes);

app.get('/', (req, res) => {
  res.send('API EBD - Escola Bíblica Dominical');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
