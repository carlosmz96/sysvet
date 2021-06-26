'use strict'

// Importaciones
const Cita = require('../models/Cita');

/**
 * Método encargado de crear una nueva cita
 * @param {*} req Consulta con los datos de la cita a crear
 * @param {*} res Respuesta generada tras la creación de la cita
 */
async function nuevaCita(req, res) {
    const params = req.body;
    const fecha = new Date(params.fecha).valueOf();
    const fechaActual = new Date().valueOf();

    if ((fecha > fechaActual) && (params.microchip && params.propietario && params.fecha)) {
        await Cita.findOne({ where: { fecha: params.fecha, activa: 'S' } }).then(async function (cita) {
            if (!cita) {
                await Cita.create({
                    microchip: params.microchip,
                    propietario: params.propietario,
                    fecha: params.fecha,
                    activa: 'S'
                }).then(function (cita) {
                    if (!cita) {
                        res.status(404).send({ message: 'No se ha creado la cita.' });
                    } else {
                        res.status(200).send({ cita });
                    }
                }).catch(() => {
                    res.status(500).send({ message: 'Error al crear una cita.' });
                });
            } else {
                res.status(500).send({ message: 'Ya hay una cita programada para esa fecha.' });
            }
        });
    } else {
        res.status(500).send({ message: 'La fecha debe de ser futura.' });
    }
}

/**
 * Método encargado de obtener todas las citas del sistema que estén activas
 * @param {*} req Consulta de todas las citas del sistema
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarCitas(req, res) {
    await Cita.findAll({ where: { activa: 'S' } }).then(function (citas) {
        if (!citas) {
            res.status(404).send({ message: 'No se han podido encontrar las citas.' });
        } else {
            res.status(200).send({ citas });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al consultar las citas.' });
    });
}

/**
 * Método encargado de obtener las citas de una mascota que estén activas
 * @param {*} req Consulta de todas las citas de una mascota
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarCitasMascota(req, res) {
    const petMicrochip = req.params.microchip;

    await Cita.findAll({ where: { microchip: petMicrochip, activa: 'S' } }).then(function (citas) {
        if (!citas) {
            res.status(404).send({ message: 'No se han podido encontrar las citas.' });
        } else {
            res.status(200).send({ citas });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al consultar las citas.' });
    });
}

/**
 * Método encargado de obtener las citas de un propietario que estén activas
 * @param {*} req Consulta de todas las citas de un propietario
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarCitasPropietario(req, res) {
    const dniPropietario = req.params.dni;

    await Cita.findAll({ where: { propietario: dniPropietario, activa: 'S' } }).then(function (citas) {
        if (!citas) {
            res.status(404).send({ message: 'No se han podido encontrar las citas.' });
        } else {
            res.status(200).send({ citas });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al consultar las citas.' });
    });
}

/**
 * Método encargado de anular una cita específica
 * @param {*} req Consulta para anular una cita
 * @param {*} res Respuesta generada tras la consulta
 */
async function anularCita(req, res) {
    const params = req.body;

    await Cita.update({ activa: 'N' }, {
        where: {
            microchip: params.microchip,
            propietario: params.propietario,
            fecha: params.fecha
        }
    }).then(function (citaCanceled) {
        if (!citaCanceled) {
            res.status(404).send({ message: 'No se ha podido anular la cita.' });
        } else {
            res.status(200).send({ cita: citaCanceled });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al anular la cita.' });
    });;
}

/**
 * Método encargado de eliminar un registro de cita de forma total, solo si está anulada
 * @param {*} req Consulta con los datos de la cita a eliminar
 * @param {*} res Respuesta generada tras la consulta
 */
async function eliminarCita(req, res) {
    const params = req.body;

    if (params.activa == 'N') {
        await Cita.destroy({ where: {
            fecha: params.fecha
        } }).then(function (citaDeleted) {
            if (!citaDeleted) {
                res.status(404).send({ message: 'No se ha podido eliminar la cita.' });
            } else {
                res.status(200).send({ cita: citaDeleted });
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error al eliminar la cita.' });
        });
    } else {
        res.status(500).send({ message: 'Para eliminar una cita primero debe estar anulada.' });
    }
}

module.exports = {
    nuevaCita,
    consultarCitas,
    consultarCitasMascota,
    consultarCitasPropietario,
    anularCita,
    eliminarCita
}