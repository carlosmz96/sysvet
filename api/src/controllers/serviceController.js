'use strict'

// Importaciones
const Servicio = require('../models/Servicio');

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
    }).then(function (servicio) {
        if (!servicio) {
            res.status(404).send({ message: 'No se ha creado el servicio.' });
        } else {
            res.status(200).send({ servicio });
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
    const codigoServicio = req.params.codigo;

    await Servicio.findOne({ where: { codigo: codigoServicio } }).then(function (servicio) {
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
    const codigoServicio = req.params.codigo;
    const params = req.body;

    await Servicio.update({
        nombre: params.nombre
    }, { where: { codigo: codigoServicio } }).then(function (servicio) {
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
    const codigoServicio = req.params.codigo;

    await Servicio.destroy({ where: { codigo: codigoServicio }}).then(function(servicio) {
        if(!servicio) {
            res.status(404).send({ message: 'No se ha encontrado el servicio a eliminar.' });
        } else {
            res.status(200).send({ servicio });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al eliminar el servicio.' });
    });
}

module.exports = {
    altaServicio,
    consultarServicios,
    consultarServicio,
    modificarServicio,
    bajaServicio
}