import express from "express";
import bodyParser from "body-parser";
import './config/config';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/consultarUsuario', (req, res) => {
    res.json("usuarios");
});

app.post('/registrarUsuario', (req, res) => {
    let usuario= req.body;

    if(usuario.nombre === undefined){
        res.status(400).json({
            exito:false,
            codError:"JC_001",
            mensaje:"El nombre es requerido para crear el usuario."
        });
        return;
    }

    res.json({
        exito:true,
        usuario:usuario
    });
}); 

app.listen(process.env.PUERTO, () => {
    console.log('Poerto servicio : ', process.env.PUERTO);
});
