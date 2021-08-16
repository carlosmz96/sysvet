'use strict'

// Importaciones
const Veterinario_Servicio = require('../models/Veterinario_Servicio');

/**
 * Método encargado de obtener los servicios en los que se especializa un veterinario
 * @param {*} req Consulta a los servicios en los que se especializa un veterinario
 * @param {*} res Respuesta generada tras la consulta
 */
async function obtenerEspecializacionesVeterinario(req, res) {
    const vetDni = req.params.dni;

    await Veterinario_Servicio.findAll({ where: { dni: vetDni } }).then(function (servicios) {
        if (!servicios) {
            res.status(404).send({ message: 'No se pudieron obtener los servicios en los que se especializa el veterinario.' });
        } else {
            res.status(200).send({ servicios });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al intentar obtener los servicios en los que se especializa el veterinario.' });
    });
}

/**
 * Método encargado de obtener los veterinarios según una especialidad
 * @param {*} req Consulta a los veterinarios según una especialidad
 * @param {*} res Respuesta generada tras la consulta
 */
async function obtenerVeterinariosPorEspecialidad(req, res) {
    const idServicio = req.params.id;

    await Veterinario_Servicio.findAll({ where: { id_servicio: idServicio } }).then(function (relaciones) {
        if (!relaciones) {
            res.status(404).send({ message: 'No se pudieron obtener las relaciones.' });
        } else {
            res.status(200).send({ relaciones });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al intentar obtener las relaciones.' });
    });
}

/**
 * Método encargado de crear una asociación entre veterinario y servicio
 * @param {*} req Consulta para la creación de una asociación entre veterinario y servicio
 * @param {*} res Respuesta generada tras la consulta
 */
async function asignarEspecializacionAVeterinario(req, res) {
    const vetDni = req.params.dni;
    const idServicio = req.params.idServicio;

    await Veterinario_Servicio.create({
        dni: vetDni,
        id_servicio: idServicio
    }).then(function (vet_ser) {
        if (!vet_ser) {
            res.status(404).send({ message: 'No se pudo crear la asociación entre veterinario y servicio.' });
        } else {
            res.status(200).send({ vet_ser });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al asociar veterinario y servicio.' });
    });
}

/**
 * Método encargado de eliminar una asociación entre veterinario y servicio
 * @param {*} req Consulta para la eliminación de una asociación entre veterinario y servicio
 * @param {*} res Respuesta generada tras la consulta
 */
async function desasignarEspecializacionDeVeterinario(req, res) {
    const vetDni = req.params.dni;
    const idServicio = req.params.idServicio;

    await Veterinario_Servicio.destroy({
        where: {
            dni: vetDni,
            id_servicio: idServicio
        }
    }).then(function (vet_ser) {
        if (!vet_ser) {
            res.status(404).send({ message: 'No se pudo eliminar la asociación entre veterinario y servicio.' });
        } else {
            res.status(200).send({ vet_ser });
        }
    }).catch(() => {
        res.status(500).send({ message: 'Error al desasociar veterinario y servicio.' });
    });
}

module.exports = {
    obtenerEspecializacionesVeterinario,
    obtenerVeterinariosPorEspecialidad,
    asignarEspecializacionAVeterinario,
    desasignarEspecializacionDeVeterinario
}