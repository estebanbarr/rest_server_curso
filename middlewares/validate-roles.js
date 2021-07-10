const { response, request } = require('express');

const mustBeAdminRole = (req = request, res = response, next) => {
    const user = req.user;

    if (!user) {
        return res.status(500).json({
            msg: 'Se quiere validar el rol antes de validar el token'
        });
    }

    const { rol, name } = user;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `El usuario [${ name }] no es administrador`
        });
    }

    next();
}

const hasRole = ( ...roles ) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(500).json({
                msg: 'Se quiere validar el rol antes de validar el token'
            });
        }

        const { rol } = user;
    
        if (!roles.includes(rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: [${ roles }]`
            });
        }

        next();
    }
}

module.exports = {
    mustBeAdminRole,
    hasRole
}