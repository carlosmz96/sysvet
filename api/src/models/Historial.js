'use strict'

const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/db');
const Mascota = require('./Mascota');

const Historial = sequelize.define('Historial', {
    id_historial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true
    },
    mascota: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: Mascota,
            key: 'identificador'
        }
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
    tableName: 'historiales',
    updatedAt: 'fecha_modificacion',
    createdAt: 'fecha_creacion'
});

module.exports = Historial;