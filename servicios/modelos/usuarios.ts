import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';

let rolesValidos = {
    values: ['USER_ROL', 'ADMIN_ROL'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;
let UsuarioSchema = new Schema({
    nombre : {
        type : String,
        required : [true, 'El nombre es requerido']
    },
    email : {
        type : String,
        unique : true,
        required : [true, 'El correo es requerido']
    },
    password : {
        type : String,
        required : [true, 'La clave es requerida']
    },
    img : {
        type : String
    },
    role : {
        type : String,
        default : 'USER_ROL',
        enum: rolesValidos
    },
    estado : {
        type : Boolean,
        default: true
    },
    google : {
        type : Boolean        
    }
});

UsuarioSchema.methods.toJSON = function() {

    let user= this.toObject();
    delete user.password;
    return user;

}

UsuarioSchema.plugin(uniqueValidator, {message:'{PATH} debe ser unico.'});

module.exports = mongoose.model('UsuarioSchema', UsuarioSchema);