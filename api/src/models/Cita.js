'use strict'

const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/db');

const Cita = sequelize.define('Cita', {
    id_cita: {
        type: DataTypes.STRING(15),
        primaryKey: true
    },
    microchip: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    propietario: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    activa: {
        type: DataTypes.STRING(1),
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
    tableName: 'citas',
    updatedAt: 'fecha_modificacion',
    createdAt: 'fecha_creacion'
});

module.exports = Cita;