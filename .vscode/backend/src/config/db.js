const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((error) => {
  if (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  } else {
    console.log('✅ Conexión a la base de datos MySQL exitosa');
  }
});

module.exports = connection;
