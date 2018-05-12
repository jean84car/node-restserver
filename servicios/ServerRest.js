"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
require("./config/config");
const usuarios_1 = require("./servicios/usuarios/usuarios");
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
//app.use(require('./servicios/usuarios/usuarios'));
app.use(usuarios_1.appUsuario);
mongoose_1.default.connect('mongodb://localhost:27017/cafe_db', (error) => {
    if (error)
        throw error;
    console.log("Conexion exitosa a la base de datos");
});
app.listen(process.env.PUERTO, () => {
    console.log('Poerto servicio : ', process.env.PUERTO);
});
