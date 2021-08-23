'use strict'

// Importaciones
const request = require('supertest');
const app = require('../src/index');
const assert = require('assert');

// variable global para almacenar el token
let token = '';

const cita = {
    id_cita: '1',
    mascota: '1111111111',
    propietario: '30265512L',
    fecha: new Date(4629639986548),
    servicio: 2,
    veterinario: '30265512L',
    activa: 'N',
    motivo: 'Prueba de test'
};

/**
 *  Antes de nada, se obtiene el token de autenticación
 *  iniciando sesión con el usuario de pruebas
 */
before((done) => {
    request(app)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({ dni: '30265512L', pass: 'admin', gethash: true })
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
            token = `${res.body.token}`;
        });
});

describe('\n  CONTROLADOR DE CITAS =>', () => {

    /**
     * Creación de una nueva cita
     */
    describe('Nueva cita (POST -- /nueva-cita)', () => {

        it('devolver un json que contenga la cita creada', done => {
            request(app)
                .post('/api/nueva-cita')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(cita)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta todas las citas del sistema
     */
    describe('Consulta de todas las citas (GET -- /citas)', () => {

        it('devolver un json que contenga una lista con todas las citas', done => {
            request(app)
                .get('/api/citas')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta una cita en específico
     */
    describe('Consulta de una cita (GET -- /citas/:id)', () => {

        it('devolver un json que contenga una única cita', done => {
            request(app)
                .get('/api/citas/' + `${cita.id_cita}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta de todas las citas de una mascota
     */
    describe('Consulta todas las citas de una mascota (GET -- /citas-mascota/:idMascota)', () => {

        it('devolver un json que contenga todas las citas de una mascota', done => {
            request(app)
                .get('/api/citas-mascota/1111111111')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta de todas las citas de un propietario
     */
    describe('Consulta todas las citas de un propietario (GET -- /citas-propietario/:dni)', () => {

        it('devolver un json que contenga todas las citas de un propietario', done => {
            request(app)
                .get('/api/citas-propietario/11111111H')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Anula una cita en concreto
     */
    describe('Anulación de cita (PUT -- /anular-cita/:id)', () => {

        it('devolver un json que contenga la cita anulada', done => {
            request(app)
                .put('/api/anular-cita/' + `${cita.id_cita}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta el motivo de una cita
     */
    describe('Consulta el motivo de una cita (GET -- /obtener-motivo-cita/:id)', () => {

        it('devolver un json que contenga el motivo de una cita', done => {
            request(app)
                .get('/api/obtener-motivo-cita/' + `${cita.id_cita}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Elimina una cita en concreto
     */
    describe('Eliminar cita (DELETE -- /eliminar-cita/:id)', () => {

        it('devolver confirmación de eliminación', done => {
            request(app)
                .delete('/api/eliminar-cita/' + `${cita.id_cita}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(cita)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        assert(res.body.cita === 1)
                        done();
                    }
                });
        });

    });

});