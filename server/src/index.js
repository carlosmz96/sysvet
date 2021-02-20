'use strict'

// Importacion de librerias
const express = require('express');
const { conexion } = require('./database/db');

// Inicializaciones
const app = express();
const userRoutes = require('./routes/userRoutes');

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Rutas base
app.use('/api', userRoutes);

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
    
    conexion(); // Prueba de conexión
});