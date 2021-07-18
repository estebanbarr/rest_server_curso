const { response, request } = require('express');

const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleTokenVerify } = require('../helpers/google-token-verify');

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
            res.status(401).json({
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

const googleSignin = async(req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, email, img } = await googleTokenVerify(id_token);

        // Busco el usuario por el email en la base de datos...
        let user = await User.findOne({ email });

        // Verifico que exista el usuario y que tenga un estado valido...
        if (!user || !user.status) {
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
            res.status(401).json({
                msg: 'Invalid user'
            });
        } else {
            console.log(error);
            res.status(400).json({
                msg: "Invalid Google token."
            });
        }
    }
}

const renovateToken = async(req = request, res = response) => {
    const { user } = req;

    // Genero el JWT...
    const jwt = await generarJWT(user.id);

    res.json({
        user,
        jwt
    });
}


module.exports = { login, googleSignin, renovateToken }
