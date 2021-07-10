const { Router } = require('express');
const { check  } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');

// const { isValidRole,
//     isValidNewEmail,
//     validateUserIdMustExists } = require('../helpers/db-validators');

const { login } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('email' , 'El correo es obligatorio' ).isEmail(),
    check('pass' , 'La clave es obligatoria').not().isEmpty(),
    validateFields
], login);

module.exports = router;