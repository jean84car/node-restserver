"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verificarToken = (req, res, next) => {
    console.log('Verificando el token');
    let token = req.get('token'); //con el get podemos obtener los headers
    if (!token) {
        return res.status(400).json({
            exito: false,
            error: {
                message: 'La solicitud no esta permitida.',
                codError: 'tok_001'
            }
        });
    }
    let semilla = process.env.SEMILLA || '';
    jsonwebtoken_1.default.verify(token, semilla, (error, decoded) => {
        if (error) {
            return res.status(400).json({
                exito: false,
                error
            });
        }
        req.usuarioLogin = decoded.usuario;
        next(); //con esto se ejecuta el codigo de la funcion que llama al middleware
    });
};
exports.verificarUsuario = (req, res, next) => {
    let usuario = req.usuarioLogin;
    if (usuario.role != 'ADMIN_ROL') {
        return res.status(400).json({
            exito: false,
            error: {
                message: 'No tiene permiso para realizar esta accion.',
                codError: 'SEG_001'
            }
        });
    }
    next();
};
