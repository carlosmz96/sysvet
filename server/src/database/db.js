'use strict'

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sysvet', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

async function conexion() {
    try {
        await sequelize.authenticate();
        console.log('Conexión con BBDD establecida con éxito!');
    } catch (error) {
        console.error('Imposible conectar con BBDD:', error);
    }
}

module.exports = conexion;