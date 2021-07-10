const { Router } = require('express');
const { check  } = require('express-validator');

// const { validateFields  } = require('../middlewares/validate-fields');
// const { validateJWT     } = require('../middlewares/validate-jwt');
// const { mustBeAdminRole, hasRole } = require('../middlewares/validate-roles');

const {
    validateFields,
    validateJWT,
    mustBeAdminRole,
    hasRole
} = require('../middlewares');

const { isValidRole,
    isValidNewEmail,
    validateUserIdMustExists } = require('../helpers/db-validators');

const { userGet,
    userPost,
    userPut,
    userPatch,
    userDelete } = require('../controllers/user');

const Role = require('../models/role');
    
const router = Router();

router.get('/', userGet);

router.post('/', [
    check('name' , 'El nombre es obligatorio'            ).not().isEmpty(),
    check('pass' , 'La clave debe ser de más de 8 letras').isLength({ min: 6 }),
    check('email', 'El correo no es valido'              ).isEmail(),
    check('email').custom(isValidNewEmail),
    check('rol'  ).custom(isValidRole    ),
    // check('rol'  , 'No es un rol válido'                 ).isIn(['ADMIN_ROLE', 'USER_ROLE']),
    // check('rol').custom((role) => isValidRole(role)),
    validateFields
], userPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id' ).custom( validateUserIdMustExists ),
    check('rol').custom( isValidRole              ),
    validateFields
], userPut);

router.patch('/', userPatch);

router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( validateUserIdMustExists ),
    validateFields
], userDelete);

module.exports = router;
