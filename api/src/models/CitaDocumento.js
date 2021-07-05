'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitaDocumento = Schema({
    _id: String,
    motivo: String
})

module.exports = mongoose.model('CitaDocumento', CitaDocumento);