'use strict'

// Importaciones
const request = require('supertest');
const app = require('../src/index');
const assert = require('assert');

// variable global para almacenar el token
let token = '';

const publicacion = {
    id_publicacion: 0,
    dni_creacion: '11111111H',
    titulo: 'Publicación de prueba',
    descripcion: 'Publicación de prueba'
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

describe('CONTROLADOR DE PUBLICACIONES =>', () => {

    /**
     * Creación de una nueva publicación
     */
    describe('Nueva publicación (POST -- /alta-publicacion)', () => {

        it('devolver un json que contenga la publicación creada', done => {
            request(app)
                .post('/api/alta-publicacion')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(publicacion)
                .expect('Content-Type', /json/)
                .expect(200, done)
                .expect((res) => {
                    publicacion.id_publicacion = `${res.body.publicacion.id_publicacion}`
                });
        });

    });

    /**
     * Consulta todas las publicaciones del sistema
     */
    describe('Consulta de todas las publicaciones del sistema (GET -- /publicaciones)', () => {

        it('devolver un json que contenga todas las publicaciones', done => {
            request(app)
                .get('/api/publicaciones')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta una publicación en específico
     */
    describe('Consulta de una publicación (GET -- /publicaciones/:id)', () => {

        it('devolver un json que contenga una única publicación', done => {
            request(app)
                .get('/api/publicaciones/' + `${publicacion.id_publicacion}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Modifica una publicación en concreto
     */
    describe('Modificación de publicación (PUT -- /modificar-publicacion)', () => {

        it('devolver un json que contenga la publicación modificada', done => {
            request(app)
                .put('/api/modificar-publicacion')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(publicacion)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Elimina una publicación en concreto
     */
    describe('Baja publicación (DELETE -- /baja-publicacion/:id)', () => {

        it('devolver confirmación de eliminación', done => {
            request(app)
                .delete('/api/baja-publicacion/' + `${publicacion.id_publicacion}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        assert(res.body.post === 1)
                        done();
                    }
                });
        });

    });

});