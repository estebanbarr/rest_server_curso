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
    const { name, email, pass, img, rol } = req.body;
    const user = new User({ name, email, pass, img, rol });

    // Encriptar la clave del usuario...
    const salt = bcryptjs.genSaltSync();
    user.pass = bcryptjs.hashSync(pass, salt);

    // Guardar en la BD
    await user.save();

    res.json({
        user
    });
}

const userPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...residue} = req.body;

    //TODO validar contra DB

    if ( password ) {
        // Encriptar la clave del usuario...
        const salt = bcryptjs.genSaltSync();
        residue.pass = bcryptjs.hashSync(pass, salt);
    }

    await User.findByIdAndUpdate(id, residue);
    const user = await User.findById( id );

    res.json(user);
}

const userPatch = (req, res = response) => {
    res.json({
        msg: "patch api - controlador"
    });
}

const userDelete = async(req, res = response) => {
    const { id } = req.params;

    // Eliminacion fisica...
    // const user = await User.findByIdAndDelete( id );

    // Eliminacion logica...
    await User.findByIdAndUpdate( id, { status: false } );
    const user = await User.findById( id );

    res.json(user);
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}