'use strict'

const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/db');
const Historial = require('./Historial');
const Veterinario = require('./Veterinario');

const Entrada = sequelize.define('Entrada', {
    id_entrada: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_historial: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Historial,
            key: 'id_historial'
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
    },
    dni_modificacion: {
        type: DataTypes.STRING(9),
        allowNull: true,
        references: {
            model: Veterinario,
            key: 'dni'
        }
    },
    dni_creacion: {
        type: DataTypes.STRING(9),
        allowNull: false,
        references: {
            model: Veterinario,
            key: 'dni'
        }
    }
},
{
    tableName: 'entradas',
    updatedAt: 'fecha_modificacion',
    createdAt: 'fecha_creacion'
});

module.exports = Entrada;