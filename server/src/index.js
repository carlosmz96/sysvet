'use strict'

// Importacion de librerias
const express = require('express');
const { conexion } = require('./database/db');

// Inicializaciones
const app = express();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Rutas base
app.get('/pruebas', function(req, res) {
    res.status(200).send({message: 'Bienvenido a sysvet'});
});

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
    
    conexion(); // Prueba de conexión
});