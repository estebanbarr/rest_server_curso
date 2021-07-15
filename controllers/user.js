const { response, request } = require('express');

const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const userGet = async(req = request, res = response) => {
    let { limit=5, from=0 } = req.query;

    limit = Number( limit );
    from  = Number( from  );

    const query = { status: true };

    // const users = await User.find( query )
    //     .skip ( Number( from  ) )
    //     .limit( Number( limit ) );

    // const total = await User.countDocuments( query );

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find          ( query )
            .skip ( from  )
            .limit( limit )
    ]);

    res.json({
        total,
        limit,
        users
    });
}

const userPost = async(req, res = response) => {
    const { name, email, pass, img, rol, google } = req.body;
    const user = new User({ name, email, pass, img, rol, google });

    if (!google) {
        // Encriptar la clave del usuario...
        const salt = bcryptjs.genSaltSync();
        user.pass = bcryptjs.hashSync(pass, salt);
    } else {
        user.pass = ':P';
    }

    // Guardar en la BD
    await user.save();

    res.json({
        user
    });
}

const userPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, correo, ...residue} = req.body;

    //TODO validar contra DB

    if ( !residue.google && password ) {
        // Encriptar la clave del usuario...
        const salt = bcryptjs.genSaltSync();
        residue.pass = bcryptjs.hashSync(pass, salt);
    } else {
        residue.pass = ':P';
    }

    const user = await User.findByIdAndUpdate(id, residue, { new: true });

    res.json(user);
}

const userPatch = (req, res = response) => {
    res.json({
        msg: "patch api - controlador"
    });
}

const userDelete = async(req, res = response) => {
    const { id }   = req.params;

    // Eliminacion fisica...
    // const user = await User.findByIdAndDelete( id );

    // Eliminacion logica...
    const user = await User.findByIdAndUpdate( id, { status: false }, { new: true } );

    res.json(user);
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}