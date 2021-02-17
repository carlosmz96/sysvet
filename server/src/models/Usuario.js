'use strict'

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Usuario = sequelize.define('Usuario', {
    dni: {
        type: DataTypes.STRING(9),
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    pass: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(9),
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mascotas: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
    tableName: 'usuarios'
});

module.exports = Usuario;