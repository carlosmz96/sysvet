'use strict'

// Importacion de librerias
const express = require('express');
const { conexion } = require('./database/db');
const { conexionMongo } = require('./database/mongo');
const dotenv = require('dotenv');

// Inicializaciones
const app = express();
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const citaRoutes = require('./routes/citaRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const vetServRoutes = require('./routes/vetServRoutes');
const entryRoutes = require('./routes/entryRoutes');
const postRoutes = require('./routes/postRoutes');
dotenv.config();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Configuracion de cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

// Rutas base
app.use('/api', userRoutes);
app.use('/api', petRoutes);
app.use('/api', citaRoutes);
app.use('/api', serviceRoutes);
app.use('/api', vetServRoutes);
app.use('/api', entryRoutes);
app.use('/api', postRoutes);

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
    
    conexion(); // Prueba de conexión
    conexionMongo();
});

module.exports = app;