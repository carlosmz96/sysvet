'use strict'

// Importaciones
const express = require('express');
const PetController = require('../controllers/petController');
const md_auth = require('../middlewares/auth');
const md_upload = require('../middlewares/storage');

// Router de express
const api = express.Router();

// Rutas de mascota
api.post('/alta-mascota', md_auth.ensureAuth, PetController.altaMascota);
api.get('/mascotas/:microchip', md_auth.ensureAuth, PetController.consultarMascota);
api.get('/mascotas', md_auth.ensureAuth, PetController.consultarMascotas);
api.put('/modificar-mascota/:microchip', md_auth.ensureAuth, PetController.modificarMascota);
api.delete('/baja-mascota/:microchip', md_auth.ensureAuth, PetController.bajaMascota);
api.post('/subir-foto-mascota/:microchip', [md_auth.ensureAuth, md_upload.single('imagen')], PetController.subirFotoMascota);
api.post('/eliminar-foto-mascota/:microchip', md_auth.ensureAuth, PetController.eliminarFotoMascota);
api.get('/obtener-foto-mascota/:fotoMascota', PetController.obtenerFotoMascota);


// Se exporta la api de rutas de mascota
module.exports = api;