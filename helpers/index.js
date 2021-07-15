const dbValidators = require('./db-validators');
const generarJWT   = require('./generar-jwt');
const googleVerify = require('./google-token-verify');
const files        = require('./file');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...files
}
