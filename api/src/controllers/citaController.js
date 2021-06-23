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
    const fechaActual = new Date();

    const cita = new Cita();
    cita.microchip = params.microchip;
    cita.propietario = params.propietario;
    cita.fecha = params.fecha;
    cita.activa = 'S';

    if (cita.fecha > fechaActual) {
        if (cita.microchip != null && cita.propietario != null && cita.fecha != null) {
            await cita.save((err, citaStored) => {
                if (err) {
                    res.status(500).send({ message: 'Error al crear la cita.' });
                } else {
                    if (!citaStored) {
                        res.status(404).send({ message: 'No se ha creado la cita.' });
                    } else {
                        res.status(200).send({ cita: citaStored });
                    }
                }
            });
        }
    } else {
        res.status(500).send({ message: 'La fecha debe de ser futura.' });
    }
}

/**
 * Método encargado de obtener todas las citas del sistema que estén activas
 * @param {*} req Consulta de todas las citas del sistema
 * @param {*} res Respuesta generada tras la consulta
 */
async function obtenerCitas(req, res) {
    await Cita.find({ activa: 'S' }, (err, citas) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener todas las citas.' });
        } else {
            if (!citas) {
                res.status(404).send({ message: 'No se han podido obtener todas las citas.' });
            } else {
                res.status(200).send({ citas });
            }
        }
    });
}

/**
 * Método encargado de obtener las citas de una mascota que estén activas
 * @param {*} req Consulta de todas las citas de una mascota
 * @param {*} res Respuesta generada tras la consulta
 */
async function obtenerCitasMascota(req, res) {
    const petMicrochip = req.params.microchip;

    await Cita.find({ microchip: petMicrochip, activa: 'S' }, (err, citas) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener las citas de la mascota.' });
        } else {
            if (!citas) {
                res.status(404).send({ message: 'No se han podido obtener las citas de la mascota.' });
            } else {
                res.status(200).send({ citas });
            }
        }
    });
}

/**
 * Método encargado de obtener las citas de un propietario que estén activas
 * @param {*} req Consulta de todas las citas de un propietario
 * @param {*} res Respuesta generada tras la consulta
 */
async function obtenerCitasPropietario(req, res) {
    const dniPropietario = req.params.dni;

    await Cita.find({ propietario: dniPropietario, activa: 'S' }, (err, citas) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener las citas del propietario.' });
        } else {
            if (!citas) {
                res.status(404).send({ message: 'No se han podido obtener las citas del propietario.' });
            } else {
                res.status(200).send({ citas });
            }
        }
    });
}

/**
 * Método encargado de anular una cita específica
 * @param {*} req Consulta para anular una cita
 * @param {*} res Respuesta generada tras la consulta
 */
async function anularCita(req, res) {
    const params = req.body;

    await Cita.updateOne({
        microchip: params.microchip,
        propietario: params.propietario,
        fecha: params.fecha
    }, {
        activa: 'N'
    }, (err, cita) => {
        if (err) {
            res.status(500).send({ message: 'Error al intentar anular la cita.' });
        } else {
            if(!cita) {
                res.status(404).send({ message: 'No se ha podido anular la cita.' });
            } else {
                res.status(200).send({ cita });
            }
        }
    });
}

/**
 * Método encargado de eliminar un registro de cita de forma total, solo si está anulada
 * @param {*} req Consulta con los datos de la cita a eliminar
 * @param {*} res Respuesta generada tras la consulta
 */
async function eliminarCita(req, res) {
    const params = req.body;

    if (params.activa == 'N') {
        await Cita.deleteOne({
            microchip: params.microchip,
            propietario: params.propietario,
            fecha: params.fecha
        }, (err, cita) => {
            if (err) {
                res.status(500).send({ message: 'Error al intentar eliminar la cita.' });
            } else {
                if(!cita) {
                    res.status(404).send({ message: 'No se ha podido eliminar la cita.' });
                } else {
                    res.status(200).send({ cita });
                }
            }
        });
    } else {
        res.status(500).send({ message: 'Para eliminar una cita primero debe estar anulada.' });
    }
}

module.exports = {
    nuevaCita,
    obtenerCitas,
    obtenerCitasMascota,
    obtenerCitasPropietario,
    anularCita,
    eliminarCita
}