'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

/**
 * Método encargado de crear el token de sesión
 * @param {*} user Usuario con el cual se genera el token
 * @returns Token codificado
 */
exports.crearToken = function(user) {
    const payload = {
        sub: user.dni,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono,
        direccion: user.direccion,
        imagen: user.imagen,
        iat: moment().unix(), // Momento en el que se inicia sesión
        exp: moment().add(30, 'days').unix() // Tiempo de caducidad de la sesión
    };

    // Devuelve el token codificando los datos del usuario con una clave secreta
    return jwt.encode(payload, process.env.SECRET_KEY);
};

/**
 * Método encargado de crear el token de sesión para poder cambiar clave de usuario
 * @param {*} user Usuario con el cual se genera el token
 * @returns Token codificado
 */
 exports.crearTokenCambiarClave = function(user) {
    const payload = {
        sub: user.dni,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono,
        direccion: user.direccion,
        imagen: user.imagen,
        iat: moment().unix(), // Momento en el que se inicia sesión
        exp: moment().add(20, 'minutes').unix() // Tiempo de caducidad de la sesión
    };

    // Devuelve el token codificando los datos del usuario con una clave secreta
    return jwt.encode(payload, process.env.SECRET_KEY);
};