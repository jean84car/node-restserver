"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
let rolesValidos = {
    values: ['USER_ROL', 'ADMIN_ROL'],
    message: '{VALUE} no es un rol valido'
};
let Schema = mongoose_1.default.Schema;
let UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'La clave es requerida']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROL',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean
    }
});
UsuarioSchema.methods.toJSON = function () {
    let user = this.toObject();
    delete user.password;
    return user;
};
UsuarioSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} debe ser unico.' });
module.exports = mongoose_1.default.model('UsuarioSchema', UsuarioSchema);
