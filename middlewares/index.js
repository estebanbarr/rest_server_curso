// Este archivo sirve para agrupar componentes, de esta manera luego no voy a necesitar hacer un require por cada archivo
// en este directorio, sino que simplemente haciendo el require del directorio basta, es del directorio porque este archivo
// se llama [index.js], eso es mucho muy importante...

const validateFields = require('./validate-fields');
const validateJWT    = require('./validate-jwt');
const validateRoles  = require('./validate-roles');

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles
}
