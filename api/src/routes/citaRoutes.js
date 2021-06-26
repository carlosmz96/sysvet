'use strict'

// Importaciones
const express = require('express');
const CitaController = require('../controllers/citaController');
const md_auth = require('../middlewares/auth');

// Router de express
const api = express.Router();

// Rutas de cita
api.post('/nueva-cita', md_auth.ensureAuth, CitaController.nuevaCita);
api.get('/citas', md_auth.ensureAuth, CitaController.consultarCitas);
api.get('/citas-mascota/:microchip', md_auth.ensureAuth, CitaController.consultarCitasMascota);
api.get('/citas-propietario/:dni', md_auth.ensureAuth, CitaController.consultarCitasPropietario);
api.put('/anular-cita', md_auth.ensureAuth, CitaController.anularCita);
api.delete('/eliminar-cita', md_auth.ensureAuth, CitaController.eliminarCita);

// Se exporta la api de rutas de cita
module.exports = api;