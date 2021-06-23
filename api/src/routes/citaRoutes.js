'use strict'

// Importaciones
const express = require('express');
const CitaController = require('../controllers/citaController');
const md_auth = require('../middlewares/auth');

// Router de express
const api = express.Router();

// Rutas de cita
api.post('/nueva-cita', md_auth.ensureAuth, CitaController.nuevaCita);
api.get('/obtener-citas', md_auth.ensureAuth, CitaController.obtenerCitas);
api.get('/obtener-cita-mascota/:microchip', md_auth.ensureAuth, CitaController.obtenerCitasMascota);
api.get('/obtener-cita-propietario/:dni', md_auth.ensureAuth, CitaController.obtenerCitasPropietario);
api.put('/anular-cita', md_auth.ensureAuth, CitaController.anularCita);
api.delete('/eliminar-cita', md_auth.ensureAuth, CitaController.eliminarCita);

// Se exporta la api de rutas de cita
module.exports = api;