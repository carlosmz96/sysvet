'use strict'

// importación de dependencia
const mongoose = require('mongoose');

// conexión base de datos
function conexionMongo() {
    mongoose.connect('mongodb://localhost:27017/sysvet', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log("MongoDB OK!");
        }
    });
}

module.exports = {
    conexionMongo
}