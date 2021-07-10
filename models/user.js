
const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo electronico es obligatorio'],
        unique: true
    },
    pass: {
        type: String,
        required: [true, 'La contrasenia es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, pass, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);
