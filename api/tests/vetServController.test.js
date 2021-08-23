'use strict'

// Importaciones
const request = require('supertest');
const app = require('../src/index');
const assert = require('assert');

// variable global para almacenar el token
let token = '';

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

describe('CONTROLADOR DE VETERINARIO_SERVICIO =>', () => {

    /**
     * Nueva asignación veterinario_servicio
     */
    describe('Nueva asignación veterinario_servicio (POST -- /asignar-especializacion-veterinario/:dni/:idServicio)', () => {

        it('devolver un json que contenga la asignación', done => {
            request(app)
                .post('/api/asignar-especializacion-veterinario/11111111H/2')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta de todas las especializaciones de un veterinario
     */
    describe('Consulta de todas las especializaciones de un veterinario (GET -- /especializaciones-veterinario/:dni)', () => {

        it('devolver un json que contenga una lista de servicios', done => {
            request(app)
                .get('/api/especializaciones-veterinario/11111111H')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta todos los veterinarios según la especialidad
     */
    describe('Consulta de todos los veterinarios según la especialidad (GET -- /veterinarios-por-especialidad/:id)', () => {

        it('devolver un json que contenga una lista de veterinarios', done => {
            request(app)
                .get('/api/veterinarios-por-especialidad/2')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Desasignación de relación veterinario_servicio
     */
    describe('Desasignación de relación veterinario_servicio (DELETE -- /desasignar-especializacion-veterinario/:dni/:idServicio)', () => {

        it('devolver confirmación de eliminación', done => {
            request(app)
                .delete('/api/desasignar-especializacion-veterinario/11111111H/2')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        assert(res.body.vet_ser === 1)
                        done();
                    }
                });
        });

    });

});