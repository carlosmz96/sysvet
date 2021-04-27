'use strict'

const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/db');
const Usuario = require('./Usuario');

const Mascota = sequelize.define('Mascota', {
    microchip: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    especie: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    raza: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    sexo: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    color: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    edad: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    altura: {
        type: DataTypes.FLOAT(3,2),
        allowNull: false
    },
    peso: {
        type: DataTypes.FLOAT(3,2),
        allowNull: false
    },
    esterilizado: {
        type: DataTypes.STRING(1),
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    propietario: {
        type: DataTypes.STRING(9),
        allowNull: true,
        references: {
            model: Usuario,
            key: 'dni'
        }
    },
    veterinario: {
        type: DataTypes.STRING(9),
        allowNull: true,
        references: {
            model: Usuario,
            key: 'dni'
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
    tableName: 'mascotas',
    updatedAt: 'fecha_modificacion',
    createdAt: 'fecha_creacion'
});

module.exports = Mascota;