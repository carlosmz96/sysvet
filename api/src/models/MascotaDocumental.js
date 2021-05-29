'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MascotaDocumental = Schema({
    _id: String,
    observaciones: String
})

module.exports = mongoose.model('MascotaDocumental', MascotaDocumental);