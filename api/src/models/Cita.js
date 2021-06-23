'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cita = Schema({
    microchip: String,
    propietario: String,
    fecha: Date,
    activa: String
})

module.exports = mongoose.model('Cita', Cita);