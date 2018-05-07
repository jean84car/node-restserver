"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("./config/config");
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.get('/consultarUsuario', (req, res) => {
    res.json("usuarios");
});
app.post('/registrarUsuario', (req, res) => {
    let usuario = req.body;
    if (usuario.nombre === undefined) {
        res.status(400).json({
            exito: false,
            codError: "JC_001",
            mensaje: "El nombre es requerido para crear el usuario."
        });
        return;
    }
    res.json({
        exito: true,
        usuario: usuario
    });
});
app.listen(process.env.PUERTO, () => {
    console.log('Poerto servicio : ', process.env.PUERTO);
});
