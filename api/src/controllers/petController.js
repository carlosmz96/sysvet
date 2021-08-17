'use strict'

// Importaciones
const Mascota = require("../models/Mascota");
const MascotaDocumental = require('../models/MascotaDocumental');
const Historial = require("../models/Historial");
const fs = require('fs');
const path = require('path');

/**
 * Método encargado del registro de mascotas en BBDD
 * @param {*} req Consulta con los datos de la mascota a crear
 * @param {*} res Respuesta generada tras su ejecución
 */
async function altaMascota(req, res) {
    const params = req.body;

    // Creacion de mascota en BBDD
    await Mascota.create({
        identificador: params.identificador,
        nombre: params.nombre,
        especie: params.especie,
        raza: params.raza,
        sexo: params.sexo,
        color: params.color,
        edad: params.edad,
        altura: params.altura,
        peso: params.peso,
        esterilizado: params.esterilizado,
        propietario: params.propietario,
        veterinario: params.veterinario,
        dni_creacion: params.dni_creacion
    }).then(async function (pet) {
        if (!pet) {
            res.status(404).send({ message: 'No se ha guardado la mascota.' });
        } else {
            await Historial.create({ mascota: params.identificador }).then(function (historial) {
                if (!historial) {
                    res.status(404).send({ message: 'No se ha guardado el historial de la mascota.' });
                } else {
                    res.status(200).send({ pet, historial });
                }
            }).catch(() => {
                res.status(500).send({ message: 'Error al dar de alta el historial de la mascota.' });
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al dar de alta a la mascota.' });
    });
}

/**
 * Método encargado de consultar una mascota mediante su microchip
 * @param {*} req Consulta de los datos de la mascota mediante su microchip
 * @param {*} res Respuesta resultado de la operación
 */
async function consultarMascota(req, res) {
    const petId = req.params.id;

    await Mascota.findOne({ where: { identificador: petId } }).then(function (pet) {
        if (!pet) {
            res.status(404).send({ message: 'No se ha podido encontrar la mascota.' });
        } else {
            res.status(200).send({ pet });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al consultar la mascota.' });
    });
}

/**
 * Método encargado de consultar la lista con todas las mascotas
 * @param {*} req Consulta de todas las mascotas
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarMascotas(req, res) {
    await Mascota.findAll().then(function (pets) {
        if (!pets) {
            res.status(404).send({ message: 'No se ha podido encontrar la lista de mascotas.' });
        } else {
            res.status(200).send({ pets });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al consultar la lista de mascotas.' });
    });
}

/**
 * Método encargado de actualizar los datos de la mascota en BBDD
 * @param {*} req Consulta de los datos modificados de la mascota
 * @param {*} res Respuesta generada tras la modificación de los datos de la mascota
 */
async function modificarMascota(req, res) {
    const petId = req.params.id;
    const update = req.body;

    await Mascota.update({
        nombre: update.nombre,
        especie: update.especie,
        raza: update.raza,
        sexo: update.sexo,
        color: update.color,
        edad: update.edad,
        altura: update.altura,
        peso: update.peso,
        esterilizado: update.esterilizado,
        propietario: update.propietario,
        veterinario: update.veterinario,
        dni_modificacion: update.dni_modificacion
    }, { where: { identificador: petId } }).then(async function (petUpdated) {
        if (!petUpdated) {
            res.status(404).send({ message: 'No se ha podido actualizar la mascota.' });
        } else {
            await Mascota.findByPk(petId).then((petUpdated) => {
                res.status(200).send({ pet: petUpdated });
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al modificar los datos de la mascota.' });
    });
}

/**
 * Método encargado de dar de baja a una mascota
 * @param {*} req Consulta del microchip de la mascota a eliminar
 * @param {*} res Respuesta generada tras la baja de la mascota
 */
async function bajaMascota(req, res) {
    const petId = req.params.id;

    await Mascota.destroy({ where: { identificador: petId } }).then(async function (petDeleted) {
        if (!petDeleted) {
            res.status(404).send({ message: 'No se ha podido dar de baja a la mascota.' });
        } else {
            await MascotaDocumental.findByIdAndRemove({ _id: petId }).then(async function(docDel) {
                if(!docDel) {
                    res.status(404).send({ message: 'No se han podido dar de baja los datos documentales de la mascota.' });
                } else {
                    res.status(200).send({ pet: petDeleted });
                }
            }).catch(() => {
                res.status(500).send({ message: 'Error al dar de baja los datos documentales de la mascota.' });
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al dar de baja a la mascota.' });
    });
}

/**
 * Método encargado de subir una foto de perfil para la mascota
 * @param {*} req Consulta el archivo a subir como foto de perfil
 * @param {*} res Respuesta generada tras la subida del archivo
 */
async function subirFotoMascota(req, res) {
    const petId = req.params.id;

    if (req.file) {
        const file_name = req.file.filename;
        const file_ext = req.file.mimetype.substr(6);
        // Si la extensión es una de estas, se sube
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            await Mascota.update({
                imagen: file_name
            }, { where: { identificador: petId } }).then(function (petUpdated) {
                if (!petUpdated) {
                    res.status(404).send({ message: 'No se ha podido subir la foto de perfil de la mascota.' });
                } else {
                    res.status(200).send({ image: file_name, pet: petUpdated });
                }
            }).catch(() => {
                res.status(500).send({ message: 'Error al subir la foto de perfil de la mascota.' });
            });
        } else {
            res.status(200).send({ message: 'Extensión de la foto no válida.' });
        }
    } else {
        res.status(200).send({ message: 'No se ha subido ninguna foto.' });
    }
}

/**
 * Método encargado de eliminar la foto de perfil de la mascota
 * @param {*} req Consulta del microchip de la mascota
 * @param {*} res Respuesta generada tras la acción
 */
async function eliminarFotoMascota(req, res) {
    const petId = req.params.id;

    const mascota = await Mascota.findByPk(petId);
    const file_name = mascota.imagen;

    // eliminación de la foto en el directorio
    if (file_name !== null && fs.existsSync(`${__dirname}/../public/images/` + file_name)) {
        fs.unlinkSync(`${__dirname}/../public/images/` + file_name);
    }

    await Mascota.update({
        imagen: null
    }, { where: { identificador: petId } }).then(async function (petUpdated) {
        if (!petUpdated) {
            res.status(404).send({ message: 'No se ha podido eliminar la foto de perfil de la mascota.' });
        } else {
            await Mascota.findByPk(petId).then((petUpdated) => {
                res.status(200).send({ pet: petUpdated });
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al eliminar la foto de perfil de la mascota.' });
    });
}

/**
 * Método encargado de obtener la foto de perfil de la mascota
 * @param {*} req Consulta la foto de perfil de la mascota
 * @param {*} res Respuesta generada tras la consulta
 */
function obtenerFotoMascota(req, res) {
    const fotoMascota = req.params.fotoMascota;
    let path_file = "";
    if (fotoMascota == 'null') {
        path_file = './src/public/images/default-image.png';
    } else {
        path_file = './src/public/images/' + fotoMascota;
    }

    fs.stat(path_file, function (error) {
        if (error) {
            res.status(200).send({ message: 'No existe la foto de perfil de la mascota.' });
            console.error(error);
        } else {
            res.sendFile(path.resolve(path_file));
        }
    });
}

/**
 * Método encargado de obtener las observaciones de la mascota
 * @param {*} req Consulta las observaciones de la mascota
 * @param {*} res Respuesta generada tras la consulta
 */
async function obtenerObservacionesMascota(req, res) {
    const petId = req.params.id;

    await MascotaDocumental.findOne({ _id: petId }, (err, pet) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener los datos.' });
        } else {
            res.status(200).send({ pet });
        }
    });
}

/**
 * Método encargado de modificar las observaciones de la mascota
 * Nota: si no está creada, se crea
 * @param {*} req Consulta para modificar las observaciones de la mascota
 * @param {*} res Respuesta generada tras la consulta
 */
async function modificarObservacionesMascota(req, res) {
    const petId = req.params.id;
    const params = req.body;

    await MascotaDocumental.updateOne({ _id: petId }, { observaciones: params.observaciones }, { upsert: true }, async function (err) {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar los datos.' });
        } else {
            await MascotaDocumental.findById({ _id: petId }, (err, pet) => {
                if (err) {
                    res.status(500).send({ message: 'Error al obtener los datos.' });
                } else {
                    res.status(200).send({ pet });
                }
            });
        }
    });
}

module.exports = {
    altaMascota,
    consultarMascota,
    consultarMascotas,
    modificarMascota,
    bajaMascota,
    subirFotoMascota,
    eliminarFotoMascota,
    obtenerFotoMascota,
    obtenerObservacionesMascota,
    modificarObservacionesMascota
}