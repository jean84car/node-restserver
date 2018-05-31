import express from "express";
import bcrypt from 'bcrypt';
import _ from 'underscore';
import { verificarToken, verificarUsuario } from '../../middlewares/autenticacion';

const UsuarioSchema = require('../../modelos/usuarios');
export const appUsuario = express();


appUsuario.get('/consultarUsuario', verificarToken, (req, res) => {
    
    //parametros opcionales query:
    let desde:number = Number(req.query.desde || 0);
    let limite:number = Number(req.query.limite || 5);

    //find({condicion}, 'columnas')
    UsuarioSchema.find({estado:true}, 'nombre email role')
        .skip(desde)
        .limit(limite)
        .exec((error:any, usuarios:any) => {
            if(error) {
                return res.status(400).json({
                    exito:false,
                    error
                }); 
            }

            UsuarioSchema.count({estado:true}, (error:any, count:number) => {
                res.json({
                    ok : true,
                    usuarios,
                    registros:count
                });            
            })
                
        });

});

appUsuario.post('/registrarUsuario', [verificarToken, verificarUsuario], (req:any, res:any) => {
    let usuario= req.body;

    if(usuario.nombre === undefined){
        return res.status(400).json({
            exito:false,
            codError:"JC_001",
            mensaje:"El nombre es requerido para crear el usuario."
        });
    }


    let musuario = new UsuarioSchema({
        nombre : usuario.nombre,
        email : usuario.email,
        password : bcrypt.hashSync(usuario.clave, 10),
        role : usuario.role
    });

    musuario.save((error:any, usuarioDB:any) => {
        if(error) {
            return res.status(400).json({
                exito:false,
                error
            }); 
        }

        res.json({
            ok : true,
            usuario : usuarioDB
        });
    });
    
}); 

appUsuario.put('/actualizarUsuario/:id', [verificarToken, verificarUsuario], function(req:any, res:any) {
    let id= req.params.id;
    let usuario= _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado', 'password']); // con esta funcion hacemos una copia del objeto con solo los campos que estn en el arreglo
    if(usuario.password){
        usuario.password = bcrypt.hashSync(usuario.password, 10);
    }

    UsuarioSchema.findByIdAndUpdate(id, usuario, { new:true, runValidators:true }, (error:any, usuarioDB:any) => {
        if(error) {
            return res.status(400).json({
                exito:false,
                error
            }); 
        }

        res.json({
            ok : true,
            usuario : usuarioDB
        });
    });

});

//borrado fisico
appUsuario.delete('/eliminarUsuario', [verificarToken,verificarUsuario], function(req:any, res:any){

    let body = req.body;

    console.log('Eliminando el usuario co el id: '||body.id);
    UsuarioSchema.findByIdAndRemove(body.id, (error:any, usuarioRemove:any) => {
        if(error || usuarioRemove === null) {
            return res.status(400).json({
                exito:false,
                error: error || {
                    message: usuarioRemove ===null?'Usuario no existe':'' 
                }
            }); 
        }

        res.json({
            ok : true,
            usuario : usuarioRemove
        });
    });

});

//borrado logico
appUsuario.delete('/eliminarUsuarioLogico', verificarToken, function(req, res){

    let body = req.body;

    console.log(`Eliminando el usuario con el id: ${ body.id }`);
    UsuarioSchema.findByIdAndUpdate(body.id, {estado : false}, { new:true, runValidators:true }, (error:any, usuarioDB:any) => {
        if(error) {
            return res.status(400).json({
                exito:false,
                error
            }); 
        }

        res.json({
            ok : true,
            usuario : usuarioDB
        });
    });

});