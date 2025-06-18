const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function auth(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });
  const payload = jwt.verify(token, JWT_SECRET);
  req.user = payload; // payload.id, payload.role и т.д.
  next();
};
