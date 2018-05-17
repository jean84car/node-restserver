"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuarios_1 = require("./usuarios/usuarios");
const login_1 = require("./usuarios/login");
exports.appServicios = express_1.default();
exports.appServicios.use('/usuarios', usuarios_1.appUsuario);
exports.appServicios.use('/seguridad', login_1.appLogin);
