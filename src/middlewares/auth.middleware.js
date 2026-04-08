const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Permitir acesso público ao Swagger, login e cadastros
  const publicRoutes = [
    { method: 'POST', path: '/secretaria' },
    { method: 'POST', path: '/professores' },
    { method: 'POST', path: '/alunos' },
  ];
  if (
    req.path === '/auth/login' ||
    req.path.startsWith('/swagger-ebd') ||
    publicRoutes.some(r => r.method === req.method && req.path === r.path)
  ) return next();
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido ou expirado' });
    req.user = user;
    next();
  });
};
