const { Router } = require('express');
const { check  } = require('express-validator');

const { validateFields, hasFile } = require('../middlewares');

const { loadFile, updateImg, showImg, updateImgCloudinary } = require('../controllers/upload');

const { validateAllowedCollections } = require('../helpers');

const router = Router();

router.post('/', [
    hasFile,
    validateFields
], loadFile);

router.get('/:collection/:id', [
    check('id', 'Id invalido').isMongoId(),
    check('collection').custom(c => validateAllowedCollections(c, ['users', 'products'])),
    validateFields
], showImg);

router.put('/:collection/:id', [
    hasFile,
    check('id', 'Id invalido').isMongoId(),
    check('collection').custom(c => validateAllowedCollections(c, ['users', 'products'])),
    validateFields
//], updateImg);
], updateImgCloudinary);

module.exports = router;
