const PORT = process.env.PORT || 3000;

const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const toolRoutes = require('./src/routes/toolRoutes');
const userRoutes = require('./src/routes/userRoutes');
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();

// Configuração do rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Você excedeu o limite de requisições. Tente novamente em 15 minutos.',
  headers: true,
});
app.use(limiter);

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend da Loyfus IA Search está funcionando!');
});

// Rotas da API
app.use('/api/tools', toolRoutes);
app.use('/api/users', userRoutes);

// Configuração do Swagger
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
