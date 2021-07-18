const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token...')
            } else {
                resolve(token);
            }
        })
    });
}

const validateJWT = async(token = '') => {
    try {
        if (token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);

        if (user && user.status) {
            return user;
        }

        return null;
    } catch (err) {
        return null;
    }
}

module.exports = {
    generarJWT,
    validateJWT
}
