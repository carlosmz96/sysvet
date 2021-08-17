'use strict'

const { sequelize } = require('../database/db');
// Importaciones
const Entrada = require('../models/Entrada');
const EntradaDocumental = require('../models/EntradaDocumental');

/**
 * Método encargado de crear una entrada en el historial de una mascota
 * @param {*} req Consulta para crear una nueva entrada
 * @param {*} res Respuesta generada tras la consulta
 */
async function crearEntrada(req, res) {
    const params = req.body;

    await Entrada.create({
        id_historial: params.id_historial,
        dni_creacion: params.dni_creacion
    }).then(async function (entrada) {
        if (!entrada) {
            res.status(404).send({ message: 'No se ha podido crear la entrada.' });
        } else {
            await EntradaDocumental.create({ _id: entrada.id_entrada, descripcion: params.descripcion }, (err, doc) => {
                if (err) {
                    res.status(500).send({ message: 'Error al crear los datos documentales de la entrada.' });
                } else {
                    if (!doc) {
                        res.status(404).send({ message: 'No se han podido crear los datos documentales de la entrada.' });
                    } else {
                        res.status(200).send({ entrada, doc });
                    }
                }
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al crear la entrada.' });
    });
}

/**
 * Método encargado de obtener todas las entradas del historial de una mascota
 * @param {*} req Consulta de todas las entradas del historial de una mascota
 * @param {*} res Respuesta generada tras la consulta
 */
async function listarEntradas(req, res) {
    const idHistorial = req.params.id;

    await Entrada.findAll({ where: { id_historial: idHistorial } }).then(async function (entradas) {
        if (!entradas) {
            res.status(404).send({ message: 'No se han podido encontrar las entradas del historial.' });
        } else {
            res.status(200).send({ entradas });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al consultar las entradas del historial.' });
    });
}

/**
 * Método encargado de obtener una entrada en específico
 * @param {*} req Consulta para obtener una entrada
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarEntrada(req, res) {
    const idEntrada = req.params.id;

    await Entrada.findOne({ where: { id_entrada: idEntrada } }).then(async function (entrada) {
        if (!entrada) {
            res.status(404).send({ message: 'No se ha podido encontrar la entrada.' });
        } else {
            await EntradaDocumental.findOne({ _id: idEntrada }, (err, doc) => {
                if (err) {
                    res.status(500).send({ message: 'Error al obtener la descripción de la entrada.' });
                } else {
                    if (!doc) {
                        res.status(404).send({ message: 'No se ha encontrado la descripción de la entrada.' });
                    } else {
                        res.status(200).send({ entrada, doc });
                    }
                }
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al obtener la entrada.' });
    });
}

/**
 * Método encargado de modificar una entrada del historial de una mascota
 * @param {*} req Consulta para modificar una entrada
 * @param {*} res Respuesta generada tras la consulta
 */
async function modificarEntrada(req, res) {
    const idEntrada = req.params.id;
    const params = req.body;

    await Entrada.update({
        dni_modificacion: params.dni_modificacion
    }, { where: { id_entrada: idEntrada } }).then(async function(entryUpdate) {
        if (!entryUpdate) {
            res.status(404).send({ message: 'No se ha actualizado la entrada del historial.' });
        } else {
            await EntradaDocumental.updateOne({ _id: idEntrada }, { descripcion: params.descripcion }, { upsert: true }, async function (err) {
                if (err) {
                    res.status(500).send({ message: 'Error al actualizar los datos.' });
                } else {
                    await EntradaDocumental.findById({ _id: idEntrada }, (err, doc) => {
                        if (err) {
                            res.status(500).send({ message: 'Error al obtener los datos.' });
                        } else {
                            res.status(200).send({ entrada: entryUpdate, doc });
                        }
                    });
                }
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al intentar actualizar la entrada del historial.' });
    });
}

/**
 * Método encargado de eliminar una entrada del historial de la mascota
 * @param {*} req Consulta de eliminación de entrada
 * @param {*} res Respuesta generada tras la consulta
 */
async function eliminarEntrada(req, res) {
    const idEntrada = req.params.id;

    await Entrada.destroy({ where: { id_entrada: idEntrada } }).then(async function(entryDel) {
        if (!entryDel) {
            res.status(404).send({ message: 'No se ha podido eliminar la entrada.' });
        } else {
            await EntradaDocumental.deleteOne({ _id: idEntrada }, (err, docDel) => {
                if (err) {
                    res.status(500).send({ message: 'Error al intentar eliminar los datos.' });
                } else {
                    if (!docDel) {
                        res.status(404).send({ message: 'No se han eliminado los datos.' });
                    } else {
                        res.status(200).send({ entrada: entryDel, docDel });
                    }
                }
            });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al intentar eliminar una entrada del historial.' });
    });
}

module.exports = {
    crearEntrada,
    listarEntradas,
    consultarEntrada,
    modificarEntrada,
    eliminarEntrada
}