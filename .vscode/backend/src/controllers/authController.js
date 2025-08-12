
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

/**
 * Registro de usuario
 */
exports.register = (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  const hashedPassword = bcrypt.hashSync(contraseña, 10);

  usuarioModel.insertUsuario({ nombre, correo, contraseña: hashedPassword }, (err, result) => {
    if (err) {
      console.error('❌ Error al registrar:', err);
      return res.status(500).json({ mensaje: 'Error al registrar usuario' });
    }
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  });
};

/**
 * Inicio de sesión
 */
exports.login = (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  usuarioModel.findByCorreo(correo, (err, usuario) => {
    if (err) {
      console.error('❌ Error al buscar usuario:', err);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const passwordValida = bcrypt.compareSync(contraseña, usuario.contraseña);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ mensaje: 'Login exitoso', token });
  });
};
