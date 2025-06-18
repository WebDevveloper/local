// Проверка, что пользователь – администратор
function requireAdmin(req, res, next) {
  // предполагается, что auth-миддлварь уже положила в req.user
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещён: требуется роль admin' });
  }
  next();
}

module.exports = { requireAdmin };
