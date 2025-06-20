
const jwt = require('jsonwebtoken');

/**
 * Middleware para proteger rutas privadas usando token JWT
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer <token>"

  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ mensaje: 'Token inválido' });

    req.user = user; // ahora tienes disponible req.user en cualquier ruta protegida
    next();
  });
};


const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ mensaje: 'Formato de token inválido' });
  }

  const tokenValue = tokenParts[1];

  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.usuario = decoded; // se puede usar luego en los controladores
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;
