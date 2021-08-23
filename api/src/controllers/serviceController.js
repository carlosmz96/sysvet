'use strict'

// Importaciones
const Servicio = require('../models/Servicio');
const ServicioDocumental = require('../models/ServicioDocumental');

/**
 * Método encargado de dar de alta un nuevo servicio
 * @param {*} req Consulta para crear un nuevo servicio mediante unos datos
 * @param {*} res Respuesta generada tras la consulta
 */
async function altaServicio(req, res) {
    const params = req.body;

    await Servicio.create({
        codigo: params.codigo,
        nombre: params.nombre
    }).then(async function (servicio) {
        if (!servicio) {
            res.status(404).send({ message: 'No se ha creado el servicio.' });
        } else {
            await ServicioDocumental.create({ _id: servicio.id_servicio, descripcion: params.descripcion }, (err, doc) => {
                if (err) {
                    res.status(500).send({ message: 'Error al establecer la descripción del servicio.' });
                } else {
                    if (!doc) {
                        res.status(404).send({ message: 'No se ha establecido la descripción del servicio.' });
                    } else {
                        res.status(200).send({ servicio, doc });
                    }
                }
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al crear el servicio.' });
    });
}

/**
 * Método encargado de obtener todos los servicios del sistema
 * @param {*} req Consulta para obtener todos los servicios
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarServicios(req, res) {
    await Servicio.findAll().then(function (servicios) {
        if (!servicios) {
            res.status(404).send({ message: 'No se han encontrado los servicios.' });
        } else {
            res.status(200).send({ servicios });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al obtener los servicios.' });
    });
}

/**
 * Método encargado de obtener un servicio en particular
 * @param {*} req Consulta de un servicio mediante su código
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarServicio(req, res) {
    const idServicio = req.params.id;

    await Servicio.findOne({ where: { id_servicio: idServicio } }).then(function (servicio) {
        if (!servicio) {
            res.status(404).send({ message: 'No se ha encontrado el servicio.' });
        } else {
            res.status(200).send({ servicio });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al obtener el servicio.' });
    });
}

/**
 * Método encargado de modificar un servicio en específico
 * @param {*} req Consulta para modificar un servicio
 * @param {*} res Respuesta generada tras la consulta
 */
async function modificarServicio(req, res) {
    const idServicio = req.params.id;
    const params = req.body;

    await Servicio.update({
        codigo: params.codigo,
        nombre: params.nombre
    }, { where: { id_servicio: idServicio } }).then(function (servicio) {
        if (!servicio) {
            res.status(404).send({ message: 'No se ha encontrado el servicio a modificar.' });
        } else {
            res.status(200).send({ servicio });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al modificar el servicio.' });
    });
}

/**
 * Método encargado de eliminar un servicio en concreto
 * @param {*} req Consulta para eliminar un servicio
 * @param {*} res Respuesta generada tras la consulta
 */
async function bajaServicio(req, res) {
    const idServicio = req.params.id;

    await Servicio.destroy({ where: { id_servicio: idServicio } }).then(async function (servicio) {
        if (!servicio) {
            res.status(404).send({ message: 'No se ha encontrado el servicio a eliminar.' });
        } else {
            await ServicioDocumental.deleteOne({ _id: idServicio }, (err, docDel) => {
                if (err) {
                    res.status(500).send({ message: 'Error al intentar eliminar los datos.' });
                } else {
                    if (!docDel) {
                        res.status(404).send({ message: 'No se han eliminado los datos.' });
                    } else {
                        res.status(200).send({ servicio, docDel });
                    }
                }
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al eliminar el servicio.' });
    });
}

/**
 * Método encargado de obtener la descripción de un servicio mediante su id
 * @param {*} req Consulta para obtener la descripción de un servicio
 * @param {*} res Respuesta generada tras la consulta
 */
async function obtenerDescripcionServicio(req, res) {
    const idServicio = req.params.id;

    await ServicioDocumental.findOne({ _id: idServicio }, (err, doc) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener la descripción del servicio.' });
        } else {
            if (!doc) {
                res.status(404).send({ message: 'No se ha encontrado la descripción del servicio.' });
            } else {
                res.status(200).send({ doc });
            }
        }
    });
}

/**
 * Método encargado de modificar la descripción del servicio
 * Nota: si no está creada, se crea
 * @param {*} req Consulta para modificar la descripción del servicio
 * @param {*} res Respuesta generada tras la consulta
 */
async function modificarDescripcionServicio(req, res) {
    const serviceId = req.params.id;
    const params = req.body;

    await ServicioDocumental.updateOne({ _id: serviceId }, { descripcion: params.descripcion }, { upsert: true }, async function (err) {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar los datos.' });
        } else {
            await ServicioDocumental.findById({ _id: serviceId }, (err, servicio) => {
                if (err) {
                    res.status(500).send({ message: 'Error al obtener los datos.' });
                } else {
                    res.status(200).send({ servicio });
                }
            });
        }
    });
}

/**
 * Método encargado de obtener los servicios mediante unos ids específicos
 * @param {*} req Consulta para obtener los servicios
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarServiciosByIds(req, res) {
    const idsServicios = req.params.ids;

    const array = idsServicios.split(",");

    await Servicio.findAll({
        where: {
            id_servicio: array
        }
    }).then(function (servicios) {
        if (!servicios) {
            res.status(404).send({ message: 'No se han encontrado los servicios.' });
        } else {
            res.status(200).send({ servicios });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al obtener los servicios.' });
    });
}

module.exports = {
    altaServicio,
    consultarServicios,
    consultarServicio,
    modificarServicio,
    bajaServicio,
    obtenerDescripcionServicio,
    modificarDescripcionServicio,
    consultarServiciosByIds
}