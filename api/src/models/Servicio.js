'use strict'

const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/db');

const Servicio = sequelize.define('Servicio', {
    id_servicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    fecha_modificacion: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true
    },
    fecha_creacion: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},
{
    tableName: 'servicios',
    updatedAt: 'fecha_modificacion',
    createdAt: 'fecha_creacion'
});

module.exports = Servicio;