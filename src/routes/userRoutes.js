const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

// Rota para registrar um usuário comum
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('E-mail inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = new User(req.body);
    try {
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Rota para login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = generateToken(user._id);
    res.json({ message: 'Login bem-sucedido', token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listar todos os usuários (somente ADMIN)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users }); // Retorne um objeto com a chave "users"
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;