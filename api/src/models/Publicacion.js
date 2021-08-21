'use strict'

const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/db');
const Veterinario = require('./Veterinario');

const Publicacion = sequelize.define('Publicacion', {
    id_publicacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    tableName: 'publicaciones',
    updatedAt: 'fecha_modificacion',
    createdAt: 'fecha_creacion'
});

module.exports = Publicacion;