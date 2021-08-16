'use strict'

// Importaciones
const Cita = require('../models/Cita');
const CitaDocumento = require('../models/CitaDocumento');

/**
 * Método encargado de crear una nueva cita
 * @param {*} req Consulta con los datos de la cita a crear
 * @param {*} res Respuesta generada tras la creación de la cita
 */
async function nuevaCita(req, res) {
    const params = req.body;
    const fecha = new Date(params.fecha).valueOf();
    const fechaActual = new Date().valueOf();

    if ((fecha > fechaActual) && (params.mascota && params.propietario && params.fecha)) {

        const idCita = new Date().getTime().toString();

        await Cita.findOne({ where: { fecha: params.fecha, activa: 'S' } }).then(async function (cita) {
            if (!cita) {
                await Cita.create({
                    id_cita: idCita,
                    mascota: params.mascota,
                    propietario: params.propietario,
                    fecha: params.fecha,
                    servicio: params.servicio,
                    veterinario: params.veterinario,
                    activa: 'S'
                }).then(async function (cita) {
                    if (!cita) {
                        res.status(404).send({ message: 'No se ha creado la cita.' });
                    } else {
                        await CitaDocumento.create({ _id: idCita, motivo: params.motivo }, (err, doc) => {
                            if (err) {
                                res.status(500).send({ message: 'Error al establecer el motivo de la cita.' });
                            } else {
                                if (!doc) {
                                    res.status(404).send({ message: 'No se ha establecido el motivo de la cita.' });
                                } else {
                                    res.status(200).send({ cita, doc });
                                }
                            }
                        });
                    }
                }).catch((err) => {
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
async function listarCitas(req, res) {
    await Cita.findAll().then(function (citas) {
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
 * Método encargado de obtener una cita en específico
 * @param {*} req Consulta para obtener una cita
 * @param {*} res Respuesta generada tras la consulta
 */
async function consultarCita(req, res) {
    const idCita = req.params.id;

    await Cita.findOne({ where: { id_cita: idCita } }).then(function (cita) {
        if (!cita) {
            res.status(404).send({ message: 'No se ha podido encontrar la cita.' });
        } else {
            res.status(200).send({ cita });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al obtener la cita.' });
    });
}

/**
 * Método encargado de obtener las citas de una mascota que estén activas
 * @param {*} req Consulta de todas las citas de una mascota
 * @param {*} res Respuesta generada tras la consulta
 */
async function listarCitasMascota(req, res) {
    const petId = req.params.idMascota;

    await Cita.findAll({ where: { mascota: petId, activa: 'S' } }).then(function (citas) {
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
async function listarCitasPropietario(req, res) {
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
            id_cita: params.id_cita
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
        await Cita.destroy({
            where: {
                id_cita: params.id_cita
            }
        }).then(async function (citaDeleted) {
            if (!citaDeleted) {
                res.status(404).send({ message: 'No se ha podido eliminar la cita.' });
            } else {
                await CitaDocumento.deleteOne({ _id: params.id_cita }, (err, docDel) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al intentar eliminar la cita.' });
                    } else {
                        if (!docDel) {
                            res.status(404).send({ message: 'No se ha eliminado la cita correctamente.' });
                        } else {
                            res.status(200).send({ cita: citaDeleted });
                        }
                    }
                });
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error al eliminar la cita.' });
        });
    } else {
        res.status(500).send({ message: 'Para eliminar una cita primero debe estar anulada.' });
    }
}

/**
 * Método encargado de obtener el motivo de una cita mediante su id
 * @param {*} req Consulta para obtener el motivo de una cita
 * @param {*} res Respuesta generada tras la consulta
 */
async function obtenerMotivoCita(req, res) {
    const idCita = req.params.id;

    await CitaDocumento.findOne({ _id: idCita}, (err, doc) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener el motivo de la cita.' });
        } else {
            if (!doc) {
                res.status(404).send({ message: 'No se ha encontrado el motivo de la cita.' });
            } else {
                res.status(200).send({ doc });
            }
        }
    });
}

module.exports = {
    nuevaCita,
    listarCitas,
    consultarCita,
    listarCitasMascota,
    listarCitasPropietario,
    anularCita,
    eliminarCita,
    obtenerMotivoCita
}