const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const toolRoutes = require('./routes/toolRoutes');
const userRoutes = require('./routes/userRoutes');
const adRoutes = require('./routes/adRoutes'); // Importe as rotas de anúncios

dotenv.config();

const app = express();

// Configura o Express para confiar em apenas um nível de proxy
app.set('trust proxy', 1);

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3000', 'https://loyfus.com'];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  methods: 'GET,POST,PATCH,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

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

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Backend da Loyfus IA Search está funcionando!');
});

// Rotas da API
app.use('/api/tools', toolRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ads', adRoutes); // Adicione as rotas de anúncios

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
