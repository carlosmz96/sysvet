'use strict'

// Importaciones
const express = require('express');
const UserController = require('../controllers/userController');

// Router de express
const api = express.Router();

// Creación de rutas de usuario
api.get('/probando-controlador', UserController.pruebas);

// Se exporta la api de rutas de usuario
module.exports = api;