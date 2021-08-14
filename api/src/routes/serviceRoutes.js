'use strict'

// Importaciones
const express = require('express');
const ServiceController = require('../controllers/serviceController');
const md_auth = require('../middlewares/auth');

// Router de express
const api = express.Router();

// Rutas de cita
api.post('/alta-servicio', md_auth.ensureAuth, ServiceController.altaServicio);
api.get('/servicios', md_auth.ensureAuth, ServiceController.consultarServicios);
api.get('/servicios/:id', md_auth.ensureAuth, ServiceController.consultarServicio);
api.put('/modificar-servicio/:id', md_auth.ensureAuth, ServiceController.modificarServicio);
api.delete('/baja-servicio/:id', md_auth.ensureAuth, ServiceController.bajaServicio);
api.get('/obtener-descripcion-servicio/:id', md_auth.ensureAuth, ServiceController.obtenerDescripcionServicio);
api.put('/modificar-descripcion-servicio/:id', md_auth.ensureAuth, ServiceController.modificarDescripcionServicio);
api.get('/serviciosByIds/:ids', md_auth.ensureAuth, ServiceController.consultarServiciosByIds);

// Se exporta la api de rutas de servicios
module.exports = api;