import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UsuarioSchema = require('../../modelos/usuarios');
export const appLogin = express();

appLogin.post('/iniciarSesion', (req, res) =>{
    
    let body = req.body;

    console.log(`SEGURIDAD::/iniciarSesion::login: ${body.email} clave: ${body.password}`);
    UsuarioSchema.findOne({email: body.email}, (error:any, usuarioDB:any) =>{
        if(error) {
            return res.status(500).json({
                exito:false,
                error
            }); 
        }

        let mensaje;
        if(!usuarioDB){
            mensaje= 'Usuario no encontrado';
        }

        if(!mensaje && !bcrypt.compareSync(body.password, usuarioDB.password)){
            mensaje= 'Clave incorrecta.';
        }

        if(mensaje){
            return res.status(400).json({
                exito:false,
                error: error || {
                    message:mensaje
                }
            }); 
        }

        let token = jwt.sign({
            usuario:usuarioDB
        }, process.env.SEMILLA||'', {expiresIn: process.env.CADUCIDAD});

        res.json({
            ok : true,
            usuario : usuarioDB,
            token
        });
    });


});