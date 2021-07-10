const { Router } = require('express');
const { check  } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');

// const { isValidRole,
//     isValidNewEmail,
//     validateUserIdMustExists } = require('../helpers/db-validators');

const { login, googleSignin } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('email' , 'El correo es obligatorio' ).isEmail(),
    check('pass' , 'La clave es obligatoria').not().isEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token' , 'El id_token de google es obligatorio' ).not().isEmpty(),
    validateFields
], googleSignin);

module.exports = router;