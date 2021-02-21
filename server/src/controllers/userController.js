'use strict'

// Importaciones
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const jwt = require('../services/jwt');

/**
 * Método encargado del registro de usuarios en BBDD
 * @param {*} req Consulta con los datos del usuario a crear
 * @param {*} res Respuesta generada tras su ejecución
 */
async function altaUsuario(req, res) {
    const params = req.body;

    if (params.pass) {
        // Encriptación de contraseña
        const hash = bcrypt.hashSync(params.pass, 10);
        if (params.dni && params.nombre && params.apellidos && params.email && params.rol) {
            // Creacion de usuario en BBDD
            await Usuario.create({
                dni: params.dni,
                nombre: params.nombre,
                apellidos: params.apellidos,
                email: params.email,
                pass: hash,
                rol: params.rol
            }).then(function (user) {
                if (!user) {
                    res.status(404).send({ message: 'No se ha guardado el usuario.' });
                } else {
                    res.status(200).send({ message: 'Registro de usuario realizado con éxito.' });
                    console.log(user.get());
                }
            }).catch(function (error) {
                res.status(500).send({ message: 'Error en el registro de usuario.' });
                console.error(error);
            });
        } else {
            res.status(200).send({ message: 'Por favor, rellena todos los campos del formulario de registro.' });
        }
    } else {
        res.status(200).send({ message: 'Por favor, rellena el campo de contraseña.' });
    }
}

/**
 * Método encargado del inicio de sesión en la aplicación
 * @param {*} req Consulta las credenciales del usuario
 * @param {*} res Respuesta generada tras su ejecución
 */
async function iniciarSesion(req, res) {
    const params = req.body;
    const dni = params.dni;
    const pass = params.pass;

    await Usuario.findOne({ where: { dni: dni } }).then(function (user) {
        if (!user) {
            res.status(404).send({ message: 'El usuario no existe.' });
        } else {
            // Se comprueba la contraseña
            if (bcrypt.compareSync(pass, user.pass)) {
                // Se devuelven los datos del usuario logueado
                if (params.gethash) {
                    // Token JWT
                    res.status(200).send({
                        token: jwt.crearToken(user)
                    })
                } else {
                    res.status(200).send({user});
                }
            } else {
                res.status(404).send({ message: 'El usuario no ha podido iniciar sesión.' })
            }
        }
    }).catch(function (error) {
        res.status(500).send({ message: error });
    });
}

module.exports = {
    altaUsuario,
    iniciarSesion
}