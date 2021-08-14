'use strict'

// Importaciones
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const jwt = require('../services/jwt');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const Propietario = require('../models/Propietario');
const Veterinario = require('../models/Veterinario');

/**
 * Método encargado del registro de usuarios en BBDD
 * @param {*} req Consulta con los datos del usuario a crear
 * @param {*} res Respuesta generada tras su ejecución
 */
async function altaUsuario(req, res) {
    const params = req.body;
    let rolesStr = '';
    let activoStr = '';

    if (params.rol == 'administrador') {
        rolesStr = 'administrador, veterinario, cliente';
        activoStr = 'S';
    } else if (params.rol == 'cliente') {
        rolesStr = 'cliente';
        activoStr = 'S';
    } else {
        rolesStr = 'veterinario';
        activoStr = 'N';
    }

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
                rol: params.rol,
                roles: rolesStr,
                activo: activoStr
            }).then(function (user) {
                if (!user) {
                    res.status(404).send({ message: 'No se ha guardado el usuario.' });
                } else {
                    if (params.rol == 'administrador') {
                        Propietario.create({ dni: params.dni }).catch((err) => {
                            console.error(err)
                        });
                        Veterinario.create({ dni: params.dni });
                    } else if (params.rol == 'cliente') {
                        Propietario.create({ dni: params.dni });
                    } else {
                        Veterinario.create({ dni: params.dni, num_colegiado: params.num_colegiado });
                    }
                    res.status(200).send({ user });
                }
            }).catch((err) => {
                res.status(500).send({ message: 'Error al dar de alta al usuario.' });
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
                res.status(404).send({ message: 'Contraseña incorrecta.' })
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

    await Usuario.findOne({ where: { dni: userDni } }).then(function (user) {
        if (!user) {
            res.status(404).send({ message: 'No se ha podido encontrar al usuario.' });
        } else {
            res.status(200).send({ user });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al consultar el usuario.' });
    });
}

/**
 * Método encargado de consultar la lista con todos los usuarios
 * @param {*} req Consulta de todos los usuarios
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarUsuarios(req, res) {
    await Usuario.findAll().then(function (users) {
        if (!users) {
            res.status(404).send({ message: 'No se ha podido encontrar la lista de usuarios.' });
        } else {
            res.status(200).send({ users });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al consultar la lista de usuarios.' });
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
        rol: update.rol,
        telefono: update.telefono,
        direccion: update.direccion
    }, { where: { dni: userDni } }).then(async function (userUpdated) {
        if (!userUpdated) {
            res.status(404).send({ message: 'No se ha podido actualizar el usuario.' });
        } else {
            await Usuario.findByPk(userDni).then((userUpdated) => {
                res.status(200).send({ user: userUpdated });
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al modificar los datos del usuario.' });
    });
}

/**
 * Método encargado de dar de baja a un usuario
 * @param {*} req Consulta del dni del usuario a eliminar
 * @param {*} res Respuesta generada tras la baja del usuario
 */
async function bajaUsuario(req, res) {
    const userDni = req.params.dni;

    await Usuario.findOne({ where: { dni: userDni } }).then(async function (user) {
        if (!user) {
            res.status(404).send({ message: 'No se ha podido encontrar al usuario.' });
        } else {
            if (user.rol == 'administrador') {
                await Propietario.destroy({ where: { dni: userDni } }).then(async function (pro) {
                    if (!pro) {
                        res.status(404).send({ message: 'No se ha podido dar de baja al propietario.' });
                    } else {
                        await Veterinario.destroy({ where: { dni: userDni } }).then(async function (vet) {
                            if (!vet) {
                                res.status(404).send({ message: 'No se ha podido dar de baja al veterinario.' });
                            } else {
                                await Usuario.destroy({ where: { dni: userDni } }).then(function (userDeleted) {
                                    if (!userDeleted) {
                                        res.status(404).send({ message: 'No se ha podido dar de baja al usuario.' });
                                    } else {
                                        res.status(200).send({ user: userDeleted });
                                    }
                                }).catch((err) => {
                                    res.status(500).send({ message: 'Error al dar de baja al usuario.' });
                                });
                            }
                        }).catch(() => {
                            res.status(500).send({ message: 'Error al eliminar el veterinario.' });
                        });
                    }
                }).catch(() => {
                    res.status(500).send({ message: 'Error al eliminar el propietario.' });
                });
            } else if (user.rol == 'cliente') {
                await Propietario.destroy({ where: { dni: userDni } }).then(async function (pro) {
                    if (!pro) {
                        res.status(404).send({ message: 'No se ha podido dar de baja al propietario.' });
                    } else {
                        await Usuario.destroy({ where: { dni: userDni } }).then(function (userDeleted) {
                            if (!userDeleted) {
                                res.status(404).send({ message: 'No se ha podido dar de baja al usuario.' });
                            } else {
                                res.status(200).send({ user: userDeleted });
                            }
                        }).catch((err) => {
                            res.status(500).send({ message: 'Error al dar de baja al usuario.' });
                        });
                    }
                }).catch(() => {
                    res.status(500).send({ message: 'Error al eliminar el propietario.' });
                });
            } else {
                await Veterinario.destroy({ where: { dni: userDni } }).then(async function (vet) {
                    if (!vet) {
                        res.status(404).send({ message: 'No se ha podido dar de baja al veterinario.' });
                    } else {
                        await Usuario.destroy({ where: { dni: userDni } }).then(function (userDeleted) {
                            if (!userDeleted) {
                                res.status(404).send({ message: 'No se ha podido dar de baja al usuario.' });
                            } else {
                                res.status(200).send({ user: userDeleted });
                            }
                        }).catch((err) => {
                            res.status(500).send({ message: 'Error al dar de baja al usuario.' });
                        });
                    }
                }).catch(() => {
                    res.status(500).send({ message: 'Error al eliminar el veterinario.' });
                });
            }
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al consultar el usuario.' });
    });
}

/**
 * Método encargado de subir una foto de perfil para el usuario
 * @param {*} req Consulta el archivo a subir como foto de perfil
 * @param {*} res Respuesta generada tras la subida del archivo
 */
async function subirFotoPerfil(req, res) {
    const userDni = req.params.dni;

    if (req.file) {
        const file_name = req.file.filename;
        const file_ext = req.file.mimetype.substr(6);
        // Si la extensión es una de estas, se sube
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            await Usuario.update({
                foto: file_name
            }, { where: { dni: userDni } }).then(function (userUpdated) {
                if (!userUpdated) {
                    res.status(404).send({ message: 'No se ha podido subir la foto de perfil del usuario.' });
                } else {
                    res.status(200).send({ image: file_name, user: userUpdated });
                }
            }).catch(() => {
                res.status(500).send({ message: 'Error al subir la foto de perfil del usuario.' });
            });
        } else {
            res.status(200).send({ message: 'Extensión de la foto no válida.' });
        }
    } else {
        res.status(200).send({ message: 'No se ha subido ninguna foto.' });
    }
}

/**
 * Método encargado de eliminar la foto de perfil del usuario
 * @param {*} req Consulta del dni del usuario
 * @param {*} res Respuesta generada tras la acción
 */
async function eliminarFotoPerfil(req, res) {
    const userDni = req.params.dni;

    const user = await Usuario.findByPk(userDni);
    const file_name = user.foto;

    // eliminación de la foto en el directorio
    if (file_name !== null && fs.existsSync(`${__dirname}/../public/images/` + file_name)) {
        fs.unlinkSync(`${__dirname}/../public/images/` + file_name);
    }

    await Usuario.update({
        foto: null
    }, { where: { dni: userDni } }).then(async function (userUpdated) {
        if (!userUpdated) {
            res.status(404).send({ message: 'No se ha podido eliminar la foto de perfil del usuario.' });
        } else {
            await Usuario.findByPk(userDni).then((userUpdated) => {
                res.status(200).send({ user: userUpdated });
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al eliminar la foto de perfil del usuario.' });
    });
}

/**
 * Método encargado de obtener la foto de perfil del usuario
 * @param {*} req Consulta la foto de perfil del usuario
 * @param {*} res Respuesta generada tras la consulta
 */
function obtenerFotoPerfil(req, res) {
    const fotoPerfil = req.params.fotoPerfil;
    let path_file = "";
    if (fotoPerfil == 'null') {
        path_file = './src/public/images/default-image.png';
    } else {
        path_file = './src/public/images/' + fotoPerfil;
    }

    fs.stat(path_file, function (error) {
        if (error) {
            res.status(200).send({ message: 'No existe la foto de perfil.' });
        } else {
            res.sendFile(path.resolve(path_file));
        }
    });
}

/**
 * Método encargado de comprobar que la contraseña introducida sea correcta
 * @param {*} req Consulta del usuario y contraseña
 * @param {*} res Respuesta resultado tras la comprobación
 */
async function comprobarContrasena(req, res) {
    const userDni = req.params.dni;
    const userPass = req.params.pass;

    await Usuario.findByPk(userDni).then(function (user) {
        if (!user) {
            res.status(404).send({ message: 'El usuario no existe.' });
        } else {
            // Se comprueba la contraseña
            if (bcrypt.compareSync(userPass, user.pass)) {
                res.status(200).send({ res: true });
            } else {
                res.status(200).send({ res: false });
            }
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al obtener el usuario.' });
    });
}

/**
 * Método encargado de enviar un correo electrónico al usuario con una dirección url
 * para poder crear una nueva contraseña
 * @param {*} req Consulta del email del usuario
 * @param {*} res Respuesta generada tras consultar dicho email
 */
async function recordarContrasena(req, res) {
    const userEmail = req.body.email;

    await Usuario.findOne({ where: { email: userEmail } }).then(async function (user) {
        if (!user) {
            res.status(404).send({ message: 'No existe ningún usuario con este correo.' });
        } else {
            // creación del token con una durabilidad de 20 minutos
            const token = jwt.crearTokenCambiarClave(user);

            // creación del medio de transporte
            let transporter = nodemailer.createTransport(smtpTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'carlossysvet01@gmail.com',
                    pass: 'sysvet01tfg'
                }
            }));

            // le paso la url con el id cifrado
            let mailOptions = {
                from: 'carlossysvet01@gmail.com',
                to: userEmail,
                subject: '¿Olvidaste tu contraseña?',
                html: `<p>Para cambiar tu contraseña, tan solo haz clic en el siguiente enlace:
                <a href="${process.env.CAMBIO_CLAVE}/${token}">crear nueva contraseña</p>
                <p>Este enlace solo tendrá una validez de hasta 20 minutos desde que se creó.</p>`
            };

            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.status(500).send({ message: 'Error al intentar enviar el email.' });
                } else {
                    res.status(200).send({ message: 'Correo enviado correctamente.', user: user });
                }
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al intentar enviar el email.' });
    });
}

/**
 * Método encargado de cambiar solo la contraseña del usuario
 * @param {*} req Consulta el usuario mediante el dni
 * @param {*} res Respuesta generada tras el cambio de contraseña
 */
async function modificarContrasena(req, res) {
    const userDni = req.params.dni;
    const update = req.body;

    const hashPass = bcrypt.hashSync(update.pass, 10);

    await Usuario.update({
        pass: hashPass
    }, { where: { dni: userDni } }).then(async function (userUpdated) {
        if (!userUpdated) {
            res.status(404).send({ message: 'No se ha podido cambiar la contraseña del usuario.' });
        } else {
            await Usuario.findByPk(userDni).then((userUpdated) => {
                res.status(200).send({ user: userUpdated });
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al cambiar la contraseña del usuario.' });
    });
}

module.exports = {
    altaUsuario,
    iniciarSesion,
    consultarUsuario,
    consultarUsuarios,
    modificarUsuario,
    bajaUsuario,
    subirFotoPerfil,
    eliminarFotoPerfil,
    obtenerFotoPerfil,
    comprobarContrasena,
    recordarContrasena,
    modificarContrasena
}