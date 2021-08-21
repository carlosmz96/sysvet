'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PublicacionDocumental = Schema({
    _id: Number,
    titulo: String,
    descripcion: String
})

module.exports = mongoose.model('PublicacionDocumental', PublicacionDocumental);