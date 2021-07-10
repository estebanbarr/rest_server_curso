const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Token required not found'
        });
    }

    try {
        // Valido el token y obtengo el uid que debería estar en el payload...
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Obtengo el usuario de la base de datos...
        const user = await User.findById(uid);

        // Valido que el usuario exista...
        if (!user) {
            throw `User with uid [${ uid }] not found`;
        }

        // Valido que el estado del usuario sea corresto (true)...
        if (!user.status) {
            throw `User with uid [${ uid }] exists with status false`;
        }

        //Coloco el usuario en el request para tenerlo en el controlador...
        req.user = user;

        // Esto es necesario porque es un middleware, sirve justamente para poder concatenarlos...
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        });
    }
}

module.exports = {
    validateJWT
}