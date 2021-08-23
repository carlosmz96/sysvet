'use strict'

// Importaciones
const request = require('supertest');
const app = require('../src/index');
const assert = require('assert');

// variable global para almacenar el token
let token = '';

const entrada = {
    id_entrada: 0,
    id_historial: 1,
    descripcion: 'Entrada de prueba',
    dni_creacion: '11111111H'
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

describe('CONTROLADOR DE ENTRADAS =>', () => {

    /**
     * Creación de una nueva entrada
     */
    describe('Nueva entrada (POST -- /crear-entrada)', () => {

        it('devolver un json que contenga la entrada creada', done => {
            request(app)
                .post('/api/crear-entrada')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(entrada)
                .expect('Content-Type', /json/)
                .expect(200, done)
                .expect((res) => {
                    entrada.id_entrada = `${res.body.entrada.id_entrada}`
                });
        });

    });

    /**
     * Consulta todas las entradas de un historial
     */
    describe('Consulta de todas las entradas de un historial (GET -- /historial/:id)', () => {

        it('devolver un json que contenga todas las entradas de un historial', done => {
            request(app)
                .get('/api/historial/1')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta una entrada en específico
     */
    describe('Consulta de una entrada (GET -- /entradas/:id)', () => {

        it('devolver un json que contenga una única entrada', done => {
            request(app)
                .get('/api/entradas/' + `${entrada.id_entrada}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Modifica una entrada en concreto
     */
    describe('Modificación de entrada (PUT -- /modificar-entrada/:id)', () => {

        it('devolver un json que contenga la entrada modificada', done => {
            request(app)
                .put('/api/modificar-entrada/' + `${entrada.id_entrada}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(entrada)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta las descripciones de las entradas
     */
    describe('Consulta las descripciones de las entradas (GET -- /entradasByIds/:ids)', () => {

        it('devolver un json que contenga una lista con las descripciones de las entradas', done => {
            request(app)
                .get('/api/entradasByIds/' + `${entrada.id_entrada}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Elimina una entrada en concreto
     */
    describe('Eliminar entrada (DELETE -- /eliminar-entrada/:id)', () => {

        it('devolver confirmación de eliminación', done => {
            request(app)
                .delete('/api/eliminar-entrada/' + `${entrada.id_entrada}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        assert(res.body.entrada === 1)
                        done();
                    }
                });
        });

    });

});