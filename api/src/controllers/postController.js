'use strict'

// Importaciones
const Publicacion = require('../models/Publicacion');
const PublicacionDocumental = require('../models/PublicacionDocumental');

/**
 * Método encargado de dar de alta una nueva publicación
 * @param {*} req Consultar para dar de alta una nueva publicación
 * @param {*} res Respuesta generada tras la consulta
 */
async function altaPublicacion(req, res) {
    const params = req.body;

    await Publicacion.create({
        dni_creacion: params.dni_creacion
    }).then(async function (publicacion) {
        if (!publicacion) {
            res.status(404).send({ message: 'No se ha podido dar de alta la publicación.' });
        } else {
            await PublicacionDocumental.create({ _id: publicacion.id_publicacion, titulo: params.titulo, descripcion: params.descripcion }, (err, doc) => {
                if (err) {
                    res.status(500).send({ message: 'Error al crear los datos documentales de la publicación.' });
                } else {
                    if (!doc) {
                        res.status(404).send({ message: 'No se han podido crear los datos documentales de la publicación.' });
                    } else {
                        res.status(200).send({ publicacion, doc });
                    }
                }
            });
        }
    }).catch((err) => {
        console.error(err)
        res.status(500).send({ message: 'Error al dar de alta la publicación.' });
    });
}

/**
 * Método encargado de obtener todas las publicaciones del sistema
 * @param {*} req Consulta para obtener todas las publicaciones
 * @param {*} res Respuesta generada tras la consulta
 */
async function listarPublicaciones(req, res) {
    await Publicacion.findAll().then(async function (publicaciones) {
        if (!publicaciones) {
            res.status(404).send({ message: 'No se han podido obtener todas las publicaciones.' });
        } else {
            await PublicacionDocumental.find((err, doc) => {
                if (err) {
                    res.status(500).send({ message: 'Error al obtener los datos documentales de las publicaciones.' });
                } else {
                    if (!doc) {
                        res.status(404).send({ message: 'No se han podido obtener los datos documentales de las publicaciones.' });
                    } else {
                        res.status(200).send({ publicaciones, doc });
                    }
                }
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al intentar obtener todas las publicaciones.' });
    });
}

/**
 * Método encargado de obtener una publicación
 * @param {*} req Consulta para obtener una publicación
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarPublicacion(req, res) {
    const idPost = req.params.id;

    await Publicacion.findByPk(idPost).then(async function (publicacion) {
        if (!publicacion) {
            res.status(404).send({ message: 'No se ha podido obtener la publicación.' });
        } else {
            await PublicacionDocumental.findById(idPost, (err, doc) => {
                if (err) {
                    res.status(404).send({ message: 'No se han podido obtener los datos documentales de la publicación.' });
                } else {
                    if (!doc) {
                        res.status(404).send({ message: 'No se han obtenido los datos documentales de la publicación.' });
                    } else {
                        res.status(200).send({ publicacion, doc });
                    }
                }
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al intentar obtener la publicación.' });
    });
}

/**
 * Método encargado de modificar una publicación
 * @param {*} req Consulta para modificar una publicación
 * @param {*} res Respuesta generada tras la consulta
 */
async function modificarPublicacion(req, res) {
    const params = req.body;

    await Publicacion.update({
        dni_modificacion: params.dni_modificacion
    }, { where: { id_publicacion: params.id_publicacion } }).then(async function (editPost) {
        if (!editPost) {
            res.status(404).send({ message: 'No se ha modificado la publicación.' });
        } else {
            await PublicacionDocumental.updateOne({ _id: params.id_publicacion }, { titulo: params.titulo, descripcion: params.descripcion }, (err, doc) => {
                if (err) {
                    console.error(err)
                    res.status(500).send({ message: 'Error al modificar los datos documentales de la publicación.' });
                } else {
                    if (!doc) {
                        res.status(404).send({ message: 'No se han modificado los datos documentales de la publicación.' });
                    } else {
                        res.status(200).send({ publicacion: editPost, doc });
                    }
                }
            });
        }
    }).catch((err) => {
        console.error(err)
        res.status(500).send({ message: 'Error al modificar la publicación.' });
    });
}

/**
 * Método encargado de dar de baja una publicación
 * @param {*} req Consulta para dar de baja una publicación
 * @param {*} res Respuesta generada tras la consulta
 */
async function bajaPublicacion(req, res) {
    const idPost = req.params.id;

    await Publicacion.destroy({ where: { id_publicacion: idPost } }).then(async function (deletedPost) {
        if (!deletedPost) {
            res.status(404).send({ message: 'No se ha podido dar de baja la publicación.' });
        } else {
            await PublicacionDocumental.deleteOne({ _id: idPost }, (err, doc) => {
                if (err) {
                    res.status(500).send({ message: 'Error al dar de baja los datos documentales de la publicación.' });
                } else {
                    if (!doc) {
                        res.status(404).send({ message: 'No se han podido dar de baja los datos documentales de la publicación.' });
                    } else {
                        res.status(200).send({ post: deletedPost, doc });
                    }
                }
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al dar de baja la publicación.' });
    });
}

module.exports = {
    altaPublicacion,
    listarPublicaciones,
    consultarPublicacion,
    modificarPublicacion,
    bajaPublicacion
}