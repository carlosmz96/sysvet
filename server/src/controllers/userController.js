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
                }
            }).catch(() => {
                res.status(500).send({ message: 'Error al dar de alta al usuario.' })
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
                    res.status(200).send({ user });
                }
            } else {
                res.status(404).send({ message: 'El usuario no ha podido iniciar sesión.' })
            }
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al iniciar sesión.' });
    });
}

/**
 * Método encargado de consultar los datos de un usuario en particular
 * @param {*} req Consulta de los datos del usuario mediante su dni
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarUsuario(req, res) {
    const userDni = req.params.dni;

    await Usuario.findOne({where: {dni: userDni}}).then(function(user){
        if(!user) {
            res.status(404).send({message: 'No se ha podido encontrar al usuario.'});
        }else{
            res.status(200).send({user});
        }
    }).catch(() => {
        res.status(500).send({message: 'Error al consultar el usuario.'});
    });
}

/**
 * Método encargado de consultar la lista con todos los usuarios
 * @param {*} req Consulta de todos los usuarios
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarUsuarios(req, res) {
    await Usuario.findAll().then(function(users){
        if(!users) {
            res.status(404).send({message: 'No se ha podido encontrar la lista de usuarios.'});
        }else{
            res.status(200).send({users});
        }
    }).catch(() => {
        res.status(500).send({message: 'Error al consultar la lista de usuarios.'});
    });
}

/**
 * Método encargado de actualizar los datos del usuario en BBDD
 * @param {*} req Consulta de los datos modificados del usuario
 * @param {*} res Respuesta generada tras la modificación de los datos del usuario
 */
async function modificarUsuario(req, res) {
    const userDni = req.params.dni;
    const update = req.body;

    await Usuario.update({
        nombre: update.nombre,
        apellidos: update.apellidos,
        email: update.email,
        pass: update.pass,
        rol: update.rol,
        telefono: update.telefono,
        direccion: update.direccion,
        imagen: update.imagen
    }, { where: { dni: userDni } }).then(function (userUpdated) {
        if (!userUpdated) {
            res.status(404).send({ message: 'No se ha podido actualizar el usuario.' });
        } else {
            res.status(200).send({ user: userUpdated });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al modificar los datos del usuario.' });
    });
}

/**
 * Método encargado de dar de baja a un usuario
 * @param {*} req Consulta del dni del usuario a eliminar
 * @param {*} res Respuesta generada tras la función
 */
async function bajaUsuario(req, res) {
    const userDni = req.params.dni;

    await Usuario.destroy({ where: { dni: userDni } }).then(function (userDeleted) {
        if (!userDeleted) {
            res.status(404).send({ message: 'No se ha podido dar de baja al usuario.' });
        } else {
            res.status(200).send({ user: userDeleted });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al dar de baja al usuario.' });
    });
}

module.exports = {
    altaUsuario,
    iniciarSesion,
    consultarUsuario,
    consultarUsuarios,
    modificarUsuario,
    bajaUsuario
}