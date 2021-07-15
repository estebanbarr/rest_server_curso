const Role     = require('../models/role');
const User     = require('../models/user');
const Category = require('../models/category');
const Product  = require('../models/product');

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
    if (existsUser && existsUser.status) {
        return true;
    }

    return false;
}

const validateUserIdMustExists = async( id ) => {
    if ( ! await existsUser(id) ) {
        throw new Error(`No se encontró un usuario para el id: [${ id }]`);
    }
}

const existsCategory = async( id ) => {
    const existsCategory = await Category.findById(id);
    if (existsCategory && existsCategory.status) {
        return true;
    }

    return false;
}

const validateCategoryIDMustExists = async( id ) => {
    if ( ! await existsCategory(id) ) {
        throw new Error(`No se encontró una categoria para el id: [${ id }]`);
    }
}

const existsProduct = async( id ) => {
    const existsProduct = await Product.findById(id);
    if (existsProduct && existsProduct.status) {
        return true;
    }

    return false;
}

const validateProductIDMustExists = async( id ) => {
    if ( ! await existsProduct(id) ) {
        throw new Error(`No se encontró una producto para el id: [${ id }]`);
    }
}

const isValidNewEmail = async(email = '') => {
    if ( await existsEmail(email) ) {
        throw new Error(`El email [${ email }] ya está registrado`);
    }
}

const validateAllowedCollections = (collection, collections) => {
    const include = collections.includes(collection);
    if (!include) {
        throw new Error(`La coleccion [${ collection }] no esta permitida o soportada. Colecciones permitidas: [${ collections }]`);
    }

    return true;
}

module.exports = {
    isValidRole,
    isValidNewEmail,
    validateUserIdMustExists,
    validateCategoryIDMustExists,
    validateProductIDMustExists,
    existsEmail,
    existsUser,
    existsCategory,
    existsProduct,
    validateAllowedCollections
}