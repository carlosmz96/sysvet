'use strict'

// Importaciones
const express = require('express');
const PostController = require('../controllers/postController');
const md_auth = require('../middlewares/auth');

// Router de express
const api = express.Router();

// Rutas de cita
api.post('/alta-publicacion', md_auth.ensureAuth, PostController.altaPublicacion);
api.get('/publicaciones', md_auth.ensureAuth, PostController.listarPublicaciones);
api.get('/publicaciones/:id', md_auth.ensureAuth, PostController.consultarPublicacion);
api.put('/modificar-publicacion', md_auth.ensureAuth, PostController.modificarPublicacion);
api.delete('/baja-publicacion/:id', md_auth.ensureAuth, PostController.bajaPublicacion);

// Se exporta la api de rutas de publicaciones
module.exports = api;