const { validationResult } = require('express-validator');

const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    // Esto es necesario porque es un middleware, sirve justamente para poder concatenarlos...
    next();
}

module.exports = {
    validateFields
}