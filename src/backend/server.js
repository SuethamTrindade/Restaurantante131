const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/restaurante')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar MongoDB', err));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend rodando em http://localhost:${port}`));