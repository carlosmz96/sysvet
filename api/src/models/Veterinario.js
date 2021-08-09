'use strict'

const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/db');
const Usuario = require('./Usuario');

const Veterinario = sequelize.define('Veterinario', {
    dni: {
        type: DataTypes.STRING(9),
        allowNull: false,
        primaryKey: true,
        references: {
            model: Usuario,
            key: 'dni'
        }
    },
    num_colegiado: {
        type: DataTypes.STRING(4),
        allowNull: false,
        unique: true
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
    tableName: 'veterinarios',
    updatedAt: 'fecha_modificacion',
    createdAt: 'fecha_creacion'
});

module.exports = Veterinario;