const { Router } = require('express');
const { check  } = require('express-validator');

const {
    validateFields,
    validateJWT,
    hasRole
} = require('../middlewares');

const { validateCategoryIDMustExists,
    validateProductIDMustExists } = require('../helpers/db-validators');

const { productsGet,
    productGet,
    productPost,
    productPut,
    productDelete } = require('../controllers/product');

const Role = require('../models/role');
    
const router = Router();

router.get('/', productsGet);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( validateProductIDMustExists ),
    validateFields
], productGet);

router.post('/', [
    validateJWT,
    check('name' , 'El nombre es obligatorio').not().isEmpty(),
    check('category' , 'El id de la categoria no es valido').isMongoId(),
    validateFields
], productPost);

router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( validateProductIDMustExists ),
    check('category' , 'El id de la categoria no es valido').isMongoId(),
    check('category').custom( validateCategoryIDMustExists ),
    validateFields
], productPut);

router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( validateProductIDMustExists ),
    validateFields
], productDelete);

module.exports = router;
