'use strict'

// Importaciones
const express = require('express');
const UserController = require('../controllers/userController');
const md_auth = require('../middlewares/auth');
const md_upload = require('../middlewares/storage');

// Router de express
const api = express.Router();

// Rutas de usuario
api.post('/registro', UserController.altaUsuario);
api.post('/login', UserController.iniciarSesion);
api.get('/usuarios/:dni', md_auth.ensureAuth, UserController.consultarUsuario);
api.get('/usuarios', md_auth.ensureAuth, UserController.consultarUsuarios);
api.put('/modificar-usuario/:dni', md_auth.ensureAuth, UserController.modificarUsuario);
api.delete('/baja-usuario/:dni', md_auth.ensureAuth, UserController.bajaUsuario);
api.post('/subir-foto-perfil/:dni', [md_auth.ensureAuth, md_upload.single('imagen')], UserController.subirFotoPerfil);
api.post('/eliminar-foto-perfil/:dni', md_auth.ensureAuth, UserController.eliminarFotoPerfil);
api.get('/obtener-foto-perfil/:fotoPerfil', UserController.obtenerFotoPerfil);
api.get('/comprobar-clave/:dni/:pass', UserController.comprobarContrasena);
api.post('/recordar-contrasena', UserController.recordarContrasena);
api.put('/modificar-clave-usuario/:dni', UserController.modificarContrasena);

// Se exporta la api de rutas de usuario
module.exports = api;