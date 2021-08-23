'use strict'

// Importaciones
const request = require('supertest');
const app = require('../src/index');
const assert = require('assert');

// variable global para almacenar el token
let token = '';

const servicio = {
    id_servicio: 0,
    codigo: 'TEST',
    nombre: 'Test de prueba',
    descripcion: 'Test de prueba'
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

describe('CONTROLADOR DE SERVICIOS =>', () => {

    /**
     * Alta de un nuevo servicio
     */
    describe('Alta servicio (POST -- /alta-servicio)', () => {

        it('devolver un json que contenga el servicio creado', done => {
            request(app)
                .post('/api/alta-servicio')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(servicio)
                .expect('Content-Type', /json/)
                .expect(200, done)
                .expect((res) => {
                    servicio.id_servicio = `${res.body.servicio.id_servicio}`;
                });
        });

    });

    /**
     * Consulta todos los servicios del sistema
     */
    describe('Consulta de todos los servicios (GET -- /servicios)', () => {

        it('devolver un json que contenga una lista con todos los servicios', done => {
            request(app)
                .get('/api/servicios')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta un servicio en específico
     */
    describe('Consulta de un servicio (GET -- /servicios/:id)', () => {

        it('devolver un json que contenga un único servicio', done => {
            request(app)
                .get('/api/servicios/' + `${servicio.id_servicio}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Modifica un servicio en específico
     */
    describe('Modificación de un servicio (PUT -- /modificar-servicio/:id)', () => {

        it('devolver un json que contenga el servicio modificado', done => {
            request(app)
                .put('/api/modificar-servicio/' + `${servicio.id_servicio}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(servicio)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta la descripción de un servicio
     */
    describe('Consulta la descripción de un servicio (GET -- /obtener-descripcion-servicio/:id)', () => {

        it('devolver un json que contenga la descripción de un servicio', done => {
            request(app)
                .get('/api/obtener-descripcion-servicio/' + `${servicio.id_servicio}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Modificar la descripción de un servicio
     */
    describe('Modificación de la descripción de un servicio (PUT -- /modificar-descripcion-servicio/:id)', () => {

        it('devolver un json que contenga la descripción modificada de un servicio', done => {
            request(app)
                .put('/api/modificar-descripcion-servicio/' + `${servicio.id_servicio}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send({ descripcion: 'Probando test' })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta varios servicios mediante una lista de ids
     */
    describe('Consulta varios servicios mediante una serie de ids (GET -- /serviciosByIds/:ids)', () => {

        it('devolver un json que contenga los servicios consultados', done => {
            request(app)
                .get('/api/serviciosByIds/' + `${servicio.id_servicio}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Elimina un servicio en concreto
     */
    describe('Baja servicio (DELETE -- /baja-servicio/:id)', () => {

        it('devolver confirmación de eliminación', done => {
            request(app)
                .delete('/api/baja-servicio/' + `${servicio.id_servicio}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(servicio)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        assert(res.body.servicio === 1)
                        done();
                    }
                });
        });

    });

});