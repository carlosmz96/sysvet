'use strict'

// Importaciones
const express = require('express');
const CitaController = require('../controllers/citaController');
const md_auth = require('../middlewares/auth');

// Router de express
const api = express.Router();

// Rutas de cita
api.post('/nueva-cita', md_auth.ensureAuth, CitaController.nuevaCita);
api.get('/citas', md_auth.ensureAuth, CitaController.listarCitas);
api.get('/citas/:id', md_auth.ensureAuth, CitaController.consultarCita);
api.get('/citas-mascota/:idMascota', md_auth.ensureAuth, CitaController.listarCitasMascota);
api.get('/citas-propietario/:dni', md_auth.ensureAuth, CitaController.listarCitasPropietario);
api.put('/anular-cita/:id', md_auth.ensureAuth, CitaController.anularCita);
api.delete('/eliminar-cita/:id', md_auth.ensureAuth, CitaController.eliminarCita);
api.get('/obtener-motivo-cita/:id', md_auth.ensureAuth, CitaController.obtenerMotivoCita);

// Se exporta la api de rutas de cita
module.exports = api;