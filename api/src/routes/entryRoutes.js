'use strict'

// Importaciones
const express = require('express');
const EntryController = require('../controllers/entryController');
const md_auth = require('../middlewares/auth');

// Router de express
const api = express.Router();

// Rutas de cita
api.post('/crear-entrada', md_auth.ensureAuth, EntryController.crearEntrada);
api.get('/historial/:id', md_auth.ensureAuth, EntryController.listarEntradas);
api.get('/entradas/:id', md_auth.ensureAuth, EntryController.consultarEntrada);
api.put('/modificar-entrada/:id', md_auth.ensureAuth, EntryController.modificarEntrada);
api.delete('/eliminar-entrada/:id', md_auth.ensureAuth, EntryController.eliminarEntrada);
api.get('/entradasByIds/:ids', md_auth.ensureAuth, EntryController.obtenerDescripcionesEntradas);

// Se exporta la api de rutas de entrada
module.exports = api;