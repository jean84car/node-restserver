"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
require("./config/config");
const indexServicios_1 = require("./servicios/indexServicios");
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(indexServicios_1.appServicios);
//habilitar la carpeta publica para acceder a la paginas html
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../public')));
mongoose_1.default.connect('mongodb://localhost:27017/cafe_db', (error) => {
    if (error)
        throw error;
    console.log("Conexion exitosa a la base de datos");
});
app.listen(process.env.PUERTO, () => {
    console.log('Poerto servicio : ', process.env.PUERTO);
});
