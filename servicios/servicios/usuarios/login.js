"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UsuarioSchema = require('../../modelos/usuarios');
exports.appLogin = express_1.default();
exports.appLogin.post('/iniciarSesion', (req, res) => {
    let body = req.body;
    console.log(`SEGURIDAD::/iniciarSesion::login: ${body.email} clave: ${body.password}`);
    UsuarioSchema.findOne({ email: body.email }, (error, usuarioDB) => {
        if (error) {
            return res.status(500).json({
                exito: false,
                error
            });
        }
        let mensaje;
        if (!usuarioDB) {
            mensaje = 'Usuario no encontrado';
        }
        if (!mensaje && !bcrypt_1.default.compareSync(body.password, usuarioDB.password)) {
            mensaje = 'Clave incorrecta.';
        }
        if (mensaje) {
            return res.status(400).json({
                exito: false,
                error: error || {
                    message: mensaje
                }
            });
        }
        let token = jsonwebtoken_1.default.sign({
            usuario: usuarioDB
        }, process.env.SEMILLA || '', { expiresIn: process.env.CADUCIDAD });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});
