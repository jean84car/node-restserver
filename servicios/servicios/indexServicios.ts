import express from "express";
import { appUsuario } from './usuarios/usuarios';
import { appLogin } from './usuarios/login';


export const appServicios = express();
appServicios.use('/usuarios', appUsuario);
appServicios.use('/seguridad', appLogin);