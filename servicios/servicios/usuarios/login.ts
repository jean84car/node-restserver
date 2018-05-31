import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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


//----------------google
async function verify(token:any) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google:true
    }
}

appLogin.post('/google', async (req, res) =>{
    let token = req.body.idtoken;

    let userGoogle = await verify(token);

    UsuarioSchema.findOne({email: userGoogle.email }, (error:any, usuarioDB:any) =>{
        if(error) {
            return res.status(500).json({
                exito:false,
                error
            }); 
        }
        
        if(usuarioDB){
            
            if(usuarioDB.google === false){
                return res.status(400).json({
                    exito:false,
                    error: {
                        message: 'La autenticacion debe ser desde el usuario y clave registradas.'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEMILLA||'', {expiresIn: process.env.CADUCIDAD});
        
                res.json({
                    ok : true,
                    usuario : usuarioDB,
                    token
                });
            }

        } else {
            let musuario = new UsuarioSchema({
                nombre : userGoogle.nombre,
                email : userGoogle.email,
                password : bcrypt.hashSync('notieneporsergoogle', 10),
                img : userGoogle.img,
                google: true
            });

            musuario.save((error:any, usuarioDB:any) => {
                if(error) {
                    return res.status(400).json({
                        exito:false,
                        error
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
        }

    });

});