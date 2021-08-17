'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntradaDocumental = Schema({
    _id: Number,
    descripcion: String
})

module.exports = mongoose.model('EntradaDocumental', EntradaDocumental);