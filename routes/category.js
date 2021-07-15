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
    validateUserIdMustExists,
    validateCategoryIDMustExists } = require('../helpers/db-validators');

const { categoriesGet,
    categoryGet,
    categoryPost,
    categoryPut,
    categoryDelete } = require('../controllers/category');

const Role = require('../models/role');
    
const router = Router();

router.get('/', categoriesGet);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( validateCategoryIDMustExists ),
    validateFields
], categoryGet);

router.post('/', [
    validateJWT,
    check('name' , 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], categoryPost);

router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( validateCategoryIDMustExists ),
    validateFields
], categoryPut);

router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( validateCategoryIDMustExists ),
    validateFields
], categoryDelete);

module.exports = router;
