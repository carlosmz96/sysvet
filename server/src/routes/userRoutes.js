'use strict'

// Importaciones
const express = require('express');
const UserController = require('../controllers/userController');
const md_auth = require('../middlewares/auth');

// Router de express
const api = express.Router();

// Rutas de usuario
api.post('/registro', UserController.altaUsuario);
api.post('/login', UserController.iniciarSesion);

// Se exporta la api de rutas de usuario
module.exports = api;