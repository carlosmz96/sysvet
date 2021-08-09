'use strict'

const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database/db');
const Mascota = require('./Mascota');
const Propietario = require('./Propietario');
const Veterinario = require('./Veterinario');
const Servicio = require('./Servicio');

const Cita = sequelize.define('Cita', {
    id_cita: {
        type: DataTypes.STRING(15),
        primaryKey: true
    },
    mascota: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: Mascota,
            key: 'identificador'
        }
    },
    propietario: {
        type: DataTypes.STRING(9),
        allowNull: false,
        references: {
            model: Propietario,
            key: 'dni'
        }
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    servicio: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: Servicio,
            key: 'id_servicio'
        }
    },
    veterinario: {
        type: DataTypes.STRING(9),
        allowNull: false,
        references: {
            model: Veterinario,
            key: 'dni'
        }
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