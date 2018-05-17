import jwt from 'jsonwebtoken';


export let verificarToken = (req:any, res:any, next:any) => {
    console.log('Verificando el token');
    
    let token = req.get('token'); //con el get podemos obtener los headers
    if(!token){
        return res.status(400).json({
            exito:false,
            error:{
                message:'La solicitud no esta permitida.',
                codError:'tok_001'
            }
        });
    }

    let semilla:string = process.env.SEMILLA||'';
    jwt.verify(token, semilla, (error:any, decoded:any) => {
        if(error){
            return res.status(400).json({
                exito:false,
                error
            }); 
        }

        req.usuarioLogin= decoded.usuario;
        next();//con esto se ejecuta el codigo de la funcion que llama al middleware
    });
}

export let verificarUsuario = (req:any, res:any, next:any) => {
    let usuario = req.usuarioLogin;
    if(usuario.role != 'ADMIN_ROL'){
        return res.status(400).json({
            exito:false,
            error:{
                message: 'No tiene permiso para realizar esta accion.',
                codError: 'SEG_001'
            }
        });
    }

    next();
}