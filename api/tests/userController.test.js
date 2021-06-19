'use strict'

// Importaciones
const request = require('supertest');
const app = require('../src/index');
const assert = require('assert');
const fs = require('fs');

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
        .send({ dni: '11111111H', pass: '123', gethash: true })
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
            token = `${res.body.token}`;
        });
});

/**
 * Da de alta a un usuario
 * 1) Crea el usuario de prueba
 * 2) Antes de nada comprueba si el usuario está creado o no
 * 3) Si está ya creado, lo borra
 * 4) Crea el usuario
 */
describe('Alta de usuario (POST -- /registro) y Baja de usuario (DELETE -- /baja-usuario/:dni)', () => {

    const user = {
        dni: '11111111H',
        nombre: 'Usuario',
        apellidos: 'de prueba',
        email: 'usertest@sysvet.com',
        pass: '123',
        rol: 'administrador'
    };

    before((done) => {
        request(app)
            .get('/api/usuarios/' + `${user.dni}`)
            .set('Accept', 'application/json')
            .set({ Authorization: `${token}` })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if (err) {
                    done();
                } else {
                    request(app)
                        .delete('/api/baja-usuario/'+ `${user.dni}`)
                        .set('Accept', 'application/json')
                        .set({ Authorization: `${token}` })
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            } else {
                                assert(res.body.user === 1);
                                done();
                            }
                        })
                }
            })
    })

    it('devolver un json que contenga el usuario registrado', done => {
        request(app)
        .post('/api/registro')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200, done)
    });

})

/**
 * Inicia sesión con los parámetros dni y contraseña
 */
describe('Inicio de sesión (POST -- /login)', () => {
    
    it('devolver un json que contenga el token de autenticación', done => {
        request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({ dni: '30265512L', pass: 'admin', gethash: true })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert(res.body.token !== undefined);
                    done();
                }
            });
    });

});

/**
 * Consulta todos los usuarios del sistema
 */
describe('Consulta de todos los usuarios (GET -- /usuarios)', () => {

    it('devolver un json que contenga una lista con todos los usuarios', done => {
        request(app)
            .get('/api/usuarios')
            .set('Accept', 'application/json')
            .set({ Authorization: `${token}` })
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

});

/**
 * Consulta un usuario en específico
 */
describe('Consulta de un usuario (GET -- /usuarios/:dni)', () => {

    it('devolver un json que contenga un único usuario', done => {
        request(app)
            .get('/api/usuarios/11111111H')
            .set('Accept', 'application/json')
            .set({ Authorization: `${token}` })
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

});

/**
 * Modifica un usuario en específico
 */
describe('Modificación de un usuario (PUT -- /modificar-usuario/:dni)', () => {

    const user = {
        nombre: 'Usuario',
        apellidos: 'de prueba',
        email: 'usertest@sysvet.com',
        rol: 'administrador',
        telefono: '666666666',
        direccion: 'Dirección de prueba'
    };

    it('devolver un json que contenga el usuario modificado', done => {
        request(app)
            .put('/api/modificar-usuario/11111111H')
            .set('Accept', 'application/json')
            .set({ Authorization: `${token}` })
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

});

/**
 * Subida de foto de perfil de un usuario
 */
describe('Subida de foto de perfil de usuario (POST -- /subir-foto-perfil/:dni)', () => {

    it('devolver un json que contenga la foto subida y el usuario actualizado', done => {
        request(app)
            .post('/api/subir-foto-perfil/11111111H')
            .set('Accept', 'application/json')
            .set({ Authorization: `${token}` })
            .attach('imagen', fs.readFileSync(`${__dirname}/images/default-image.png`), 'tests/images/default_image.png')
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

});

/**
 * Eliminación de foto de perfil de un usuario
 */
describe('Eliminación de foto de perfil de usuario (POST -- /eliminar-foto-perfil/:dni)', () => {

    it('devolver un json que contenga el usuario actualizado', done => {
        request(app)
            .post('/api/eliminar-foto-perfil/11111111H')
            .set('Accept', 'application/json')
            .set({ Authorization: `${token}` })
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

});

/**
 * Obtener una foto de perfil
 */
describe('Obtención de foto de perfil de usuario (GET -- /obtener-foto-perfil/:fotoPerfil)', () => {

    it('devolver un fichero de tipo imagen', done => {
        request(app)
            .get('/api/obtener-foto-perfil/default-image.png')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'image/png')
            .expect(200, done)
    });

});

/**
 * Comprobar contraseña de usuario
 */
describe('Comprobación de contraseña (GET -- /comprobar-clave/:dni/:pass)', () => {

    it('devolver un json confirmando si es válida o no', done => {
        request(app)
            .get('/api/comprobar-clave/11111111H/123')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

})

/**
 * Recordar contraseña de usuario
 */
describe('Recordar la contraseña de usuario (POST -- /recordar-contrasena)', () => {

    it('devolver un json con un mensaje de información y el usuario solicitante', done => {
        request(app)
            .post('/api/recordar-contrasena')
            .set('Accept', 'application/json')
            .send({ email: 'usertest@sysvet.com' })
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

});

/**
 * Modificar contraseña de usuario
 */
describe('Modificar la contraseña de un usuario (PUT -- /modificar-clave-usuario/:dni', () => {

    it('devolver un json con el usuario actualizado', done => {
        request(app)
            .put('/api/modificar-clave-usuario/11111111H')
            .set('Accept', 'application/json')
            .send({ pass: '123' })
            .expect('Content-Type', /json/)
            .expect(200, done)
    })

});