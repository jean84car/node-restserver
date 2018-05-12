"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const underscore_1 = __importDefault(require("underscore"));
const UsuarioSchema = require('../../modelos/usuarios');
exports.appUsuario = express_1.default();
exports.appUsuario.get('/consultarUsuario', (req, res) => {
    //parametros opcionales query:
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    //find({condicion}, 'columnas')
    UsuarioSchema.find({ estado: true }, 'nombre email role')
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {
        if (error) {
            return res.status(400).json({
                exito: false,
                error
            });
        }
        UsuarioSchema.count({ estado: true }, (error, count) => {
            res.json({
                ok: true,
                usuarios,
                registros: count
            });
        });
    });
});
exports.appUsuario.post('/registrarUsuario', (req, res) => {
    let usuario = req.body;
    if (usuario.nombre === undefined) {
        return res.status(400).json({
            exito: false,
            codError: "JC_001",
            mensaje: "El nombre es requerido para crear el usuario."
        });
    }
    let musuario = new UsuarioSchema({
        nombre: usuario.nombre,
        email: usuario.email,
        password: bcrypt_1.default.hashSync(usuario.clave, 10),
        role: usuario.role
    });
    musuario.save((error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                exito: false,
                error
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
exports.appUsuario.put('/actualizarUsuario/:id', function (req, res) {
    let id = req.params.id;
    let usuario = underscore_1.default.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado', 'password']); // con esta funcion hacemos una copia del objeto con solo los campos que estn en el arreglo
    if (usuario.password) {
        usuario.password = bcrypt_1.default.hashSync(usuario.password, 10);
    }
    UsuarioSchema.findByIdAndUpdate(id, usuario, { new: true, runValidators: true }, (error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                exito: false,
                error
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
//borrado fisico
exports.appUsuario.delete('/eliminarUsuario', function (req, res) {
    let body = req.body;
    console.log('Eliminando el usuario co el id: ' || body.id);
    UsuarioSchema.findByIdAndRemove(body.id, (error, usuarioRemove) => {
        if (error || usuarioRemove === null) {
            return res.status(400).json({
                exito: false,
                error: error || {
                    message: usuarioRemove === null ? 'Usuario no existe' : ''
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioRemove
        });
    });
});
//borrado logico
exports.appUsuario.delete('/eliminarUsuarioLogico', function (req, res) {
    let body = req.body;
    console.log(`Eliminando el usuario con el id: ${body.id}`);
    UsuarioSchema.findByIdAndUpdate(body.id, { estado: false }, { new: true, runValidators: true }, (error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                exito: false,
                error
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
