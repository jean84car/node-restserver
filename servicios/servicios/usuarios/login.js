"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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
//----------------google
function verify(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return {
            nombre: payload.name,
            email: payload.email,
            img: payload.picture,
            google: true
        };
    });
}
exports.appLogin.post('/google', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let token = req.body.idtoken;
    let userGoogle = yield verify(token);
    UsuarioSchema.findOne({ email: userGoogle.email }, (error, usuarioDB) => {
        if (error) {
            return res.status(500).json({
                exito: false,
                error
            });
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    exito: false,
                    error: {
                        message: 'La autenticacion debe ser desde el usuario y clave registradas.'
                    }
                });
            }
            else {
                let token = jsonwebtoken_1.default.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA || '', { expiresIn: process.env.CADUCIDAD });
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        }
        else {
            let musuario = new UsuarioSchema({
                nombre: userGoogle.nombre,
                email: userGoogle.email,
                password: bcrypt_1.default.hashSync('notieneporsergoogle', 10),
                img: userGoogle.img,
                google: true
            });
            musuario.save((error, usuarioDB) => {
                if (error) {
                    return res.status(400).json({
                        exito: false,
                        error
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
        }
    });
}));
