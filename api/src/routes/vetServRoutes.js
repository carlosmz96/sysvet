'use strict'

// Importaciones
const express = require('express');
const VetServController = require('../controllers/vetServController');
const md_auth = require('../middlewares/auth');

// Router de express
const api = express.Router();

// Rutas de veterinario_servicio
api.get('/especializaciones-veterinario/:dni', md_auth.ensureAuth, VetServController.obtenerEspecializacionesVeterinario);
api.post('/asignar-especializacion-veterinario/:dni/:idServicio', md_auth.ensureAuth, VetServController.asignarEspecializacionAVeterinario);
api.delete('/desasignar-especializacion-veterinario/:dni/:idServicio', md_auth.ensureAuth, VetServController.desasignarEspecializacionDeVeterinario);

// Se exporta la api de rutas de usuario
module.exports = api;