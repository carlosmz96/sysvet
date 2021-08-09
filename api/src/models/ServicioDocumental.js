'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServicioDocumental = Schema({
    _id: Number,
    descripcion: String
})

module.exports = mongoose.model('ServicioDocumental', ServicioDocumental);