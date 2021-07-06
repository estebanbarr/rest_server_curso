const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async(role = '') => {
    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`El rol [${ role }] no es un rol válido`);
    }
}

const existsEmail = async(email = '') => {
    const existEmail = await User.findOne({ email });
    if (existEmail)
        return true;

    return false;
}

const existsUser = async( id ) => {
    const existsUser = await User.findById(id);
    if (existsUser) {
        return true;
    }

    return false;
}

const validateUserIdMustExists = async( id ) => {
    if ( ! await existsUser(id) ) {
        throw new Error(`No se encontró un usuario para el id: [${ id }]`);
    }
}

const isValidNewEmail = async(email = '') => {
    if ( await existsEmail(email) ) {
        throw new Error(`El email [${ email }] ya está registrado`);
    }
}

module.exports = {
    isValidRole,
    isValidNewEmail,
    validateUserIdMustExists,
    existsEmail,
    existsUser
}