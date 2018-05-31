import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import './config/config';
import {appServicios} from './servicios/indexServicios';
import path from 'path';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(appServicios);

//habilitar la carpeta publica para acceder a la paginas html
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect('mongodb://localhost:27017/cafe_db', (error) => {
    if(error)
        throw error;
    
    console.log("Conexion exitosa a la base de datos");
});


app.listen(process.env.PUERTO, () => {
    console.log('Poerto servicio : ', process.env.PUERTO);
});
