

const express = require('express'); // ✅ solo una vez
const cors = require('cors');
require('dotenv').config();
const db = require('./src/config/db');

const usuarioRoutes = require('./src/routes/usuarioRoutes');

const authRoutes = require('./src/routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente 🟢');
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
