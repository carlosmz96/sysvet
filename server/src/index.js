// Importacion de librerias
const express = require('express');

// Inicializaciones
const app = express();

// Configuraciones
app.set('port', 3000);

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
})