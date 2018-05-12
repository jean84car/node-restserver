import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import './config/config';
import { appUsuario } from './servicios/usuarios/usuarios';


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(require('./servicios/usuarios/usuarios'));
app.use(appUsuario);


mongoose.connect('mongodb://localhost:27017/cafe_db', (error) => {
    if(error)
        throw error;
    
    console.log("Conexion exitosa a la base de datos");
});


app.listen(process.env.PUERTO, () => {
    console.log('Poerto servicio : ', process.env.PUERTO);
});
