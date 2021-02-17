'use strict'

// Importación de sequelize
const { Sequelize } = require('sequelize');

// Instanciación de conexión
const sequelize = new Sequelize('sysvet', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

// Prueba de conexión
async function conexion() {
    try {
        await sequelize.authenticate();
        console.log('Conexión con BBDD establecida con éxito!');
    } catch (error) {
        console.error('Imposible conectar con BBDD:', error);
    }
}

// Exportación de instancia y método
module.exports = {
    sequelize,
    conexion
};