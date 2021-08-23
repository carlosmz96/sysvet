'use strict'

// Importaciones
const request = require('supertest');
const app = require('../src/index');
const assert = require('assert');
const fs = require('fs');

// variable global para almacenar el token
let token = '';

const mascota = {
    identificador: '1111111111',
    nombre: 'Mascota de prueba',
    especie: 'Especie de prueba',
    raza: 'Raza de prueba',
    sexo: 'M',
    color: 'Color de prueba',
    edad: 'Edad de prueba',
    altura: 0,
    peso: 0,
    esterilizado: 'N',
    propietario: null,
    veterinario: null,
    dni_creacion: '30265512L'
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

describe('CONTROLADOR DE MASCOTAS =>', () => {

    /**
     * Da de alta a una mascota
     * 1) Crea la mascota de prueba
     * 2) Antes de nada comprueba si la mascota está creada o no
     * 3) Si está ya creada, la borra
     * 4) Crea la mascota
     */
    describe('Alta de mascota (POST -- /alta-mascota) y Baja de mascota (DELETE -- /baja-mascota/:id)', () => {

        before((done) => {
            request(app)
                .get('/api/mascotas/' + `${mascota.identificador}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err) => {
                    if (err) {
                        done();
                    } else {
                        request(app)
                            .delete('/api/baja-mascota/' + `${mascota.identificador}`)
                            .set('Accept', 'application/json')
                            .set({ Authorization: `${token}` })
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end((err, res) => {
                                if (err) {
                                    done(err);
                                } else {
                                    assert(res.body.pet === 1);
                                    done();
                                }
                            });
                    }
                });
        });

        it('devolver un json que contenga la mascota registrada', done => {
            request(app)
                .post('/api/alta-mascota')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(mascota)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta todas las mascotas del sistema
     */
    describe('Consulta de todas las mascotas (GET -- /mascotas)', () => {

        it('devolver un json que contenga una lista con todas las mascotas', done => {
            request(app)
                .get('/api/mascotas')
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Consulta una mascota en específico
     */
    describe('Consulta de una mascota (GET -- /mascotas/:id)', () => {

        it('devolver un json que contenga una única mascota', done => {
            request(app)
                .get('/api/mascotas/' + `${mascota.identificador}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Modifica una mascota en específico
     */
    describe('Modificación de una mascota (PUT -- /modificar-mascota/:id)', () => {

        it('devolver un json que contenga la mascota modificada', done => {
            request(app)
                .put('/api/modificar-mascota/' + `${mascota.identificador}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send(mascota)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Subida de imagen de una mascota
     */
    describe('Subida de imagen de mascota (POST -- /subir-foto-mascota/:id)', () => {

        it('devolver un json que contenga la imagen subida y la mascota actualizada', done => {
            request(app)
                .post('/api/subir-foto-mascota/' + `${mascota.identificador}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .attach('imagen', fs.readFileSync(`${__dirname}/images/default-image.png`), 'tests/images/default_image.png')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Eliminación de imagen de una mascota
     */
    describe('Eliminación de imagen de una mascota (POST -- /eliminar-foto-mascota/:id)', () => {

        it('devolver un json que contenga la mascota actualizada', done => {
            request(app)
                .post('/api/eliminar-foto-mascota/' + `${mascota.identificador}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Obtener una imagen de una mascota
     */
    describe('Obtención de imagen de una mascota (GET -- /obtener-foto-mascota/:fotoMascota)', () => {

        it('devolver un fichero de tipo imagen', done => {
            request(app)
                .get('/api/obtener-foto-mascota/default-image.png')
                .set('Accept', 'application/json')
                .expect('Content-Type', 'image/png')
                .expect(200, done);
        });

    });

    /**
     * Obtener las observaciones de una mascota
     */
    describe('Obtención de observaciones de una mascota (GET -- /observaciones-mascota/:id)', () => {

        it('devolver un json que contenga las observaciones de la mascota', done => {
            request(app)
                .get('/api/observaciones-mascota/' + `${mascota.identificador}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Modificar las observaciones de una mascota
     */
    describe('Modificación de observaciones de una mascota (PUT -- /modificar-observaciones-mascota/:id)', () => {

        it('devolver un json que contenga las observaciones modificadas de la mascota', done => {
            request(app)
                .put('/api/modificar-observaciones-mascota/' + `${mascota.identificador}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .send({ observaciones: 'Probando test' })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    /**
     * Obtener el historial de una mascota
     */
    describe('Obtener el historial de una mascota (GET -- /historial-mascota/:id)', () => {

        it('devolver un json que contenga el historial de la mascota', done => {
            request(app)
                .get('/api/historial-mascota/' + `${mascota.identificador}`)
                .set('Accept', 'application/json')
                .set({ Authorization: `${token}` })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

});