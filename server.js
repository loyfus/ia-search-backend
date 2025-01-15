const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const toolRoutes = require('./src/routes/toolRoutes');
const userRoutes = require('./src/routes/userRoutes');
const setupSwagger = require('./swagger');

// Carrega as variáveis de ambiente
dotenv.config();

// Inicializa o Express
const app = express();

// Configuração do rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: 'Você excedeu o limite de requisições. Tente novamente em 15 minutos.',
  headers: true,
});
app.use(limiter);

// Middlewares
app.use(cors()); // Habilita o CORS
app.use(express.json()); // Permite o uso de JSON no corpo das requisições

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
app.use('/api/tools', toolRoutes); // Rotas relacionadas a ferramentas
app.use('/api/users', userRoutes); // Rotas relacionadas a usuários

// Configuração do Swagger
setupSwagger(app);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exporta o app para testes ou uso em outros arquivos
module.exports = app;
