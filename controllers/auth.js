const { response, request } = require('express');

const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req = request, res = response) => {
    const { email, pass } = req.body;
    
    try {
        // Busco el usuario por email...
        const user = await User.findOne({ email });

        // Verifico que el usuario exista y este activo...
        if (!user || !user.status) {
            throw false;
        }

        // Valido la clave del usuario...
        const isPassOk = bcryptjs.compareSync(pass, user.pass);
        if (!isPassOk) {
            throw false;
        }

        // Genero el JWT...
        const jwt = await generarJWT(user.id);
    
        res.json({
            user,
            jwt
        });
    } catch (error) {
        if (error === false) {
            res.status(400).json({
                msg: 'Invalid user or password'
            });
        } else {
            console.log(error);
            res.status(500).json({
                msg: "Error interno. Por favor contáctese con el administrador."
            });
        }
    }
}

module.exports = { login }
