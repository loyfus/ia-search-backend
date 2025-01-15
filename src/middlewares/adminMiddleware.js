const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId); // req.userId é definido no authMiddleware
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Você não é um administrador.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = adminMiddleware;