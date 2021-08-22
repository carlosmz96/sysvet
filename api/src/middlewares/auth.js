'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

/**
 * Método encargado de asegurar que exista la cabecera de autenticación
 * Si existe, devuelve los datos del usuario decodificado
 * @param {*} req Consulta de las cabeceras
 * @param {*} res Respuesta de los posibles mensajes de error
 * @param {*} next Permite pasar a la siguiente fase de la autenticación
 */
exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación.'});
    }else{
        const token = req.headers.authorization.replace(/['"]+/g, ''); // Elimina comillas simples y dobles del token

        try {
            const payload = jwt.decode(token, process.env.SECRET_KEY);
            // if(payload.exp <= moment.unix()){
            //     return res.status(401).send({message: 'El token ha expirado.'});
            // }
            req.user = payload;
            next();
        } catch(ex) {
            console.log(ex);
            return res.status(401).send({message: 'El token ha expirado.'});
        }
    }
}