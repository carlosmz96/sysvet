'use strict'

const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/db');
const Veterinario = require('./Veterinario');
const Servicio = require('./Servicio');

const Veterinario_Servicio = sequelize.define('Veterinario_Servicio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true
    },
    dni: {
        type: DataTypes.STRING(9),
        allowNull: false,
        references: {
            model: Veterinario,
            key: 'dni'
        }
    },
    id_servicio: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: Servicio,
            key: 'id_servicio'
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
}, {
    tableName: 'veterinario_servicio',
    updatedAt: 'fecha_modificacion',
    createdAt: 'fecha_creacion'
});

module.exports = Veterinario_Servicio;