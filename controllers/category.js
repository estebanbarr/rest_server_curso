const { response, request } = require('express');

const User     = require('../models/user');
const Category = require('../models/category');

const categoriesGet = async(req = request, res = response) => {
    let { limit=5, from=0 } = req.query;

    limit = Number( limit );
    from  = Number( from  );

    const query = { status: true };

    // const users = await User.find( query )
    //     .skip ( Number( from  ) )
    //     .limit( Number( limit ) );

    // const total = await User.countDocuments( query );

    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find          ( query )
            .populate('user')
            .skip ( from  )
            .limit( limit )
    ]);

    res.json({
        total,
        limit,
        categories
    });
}

const categoryGet = async(req = request, res = response) => {
    const { id } = req.params;

    const category = await Category.findById(id).populate('user');

    res.json({
        category
    });
}

const categoryPost = async(req, res = response) => {
    const name     = req.body.name.toUpperCase();
    const { desc } = req.body;
    const user     = req.user;

    let category = await Category.findOne({ name });

    // Valido que no exista la categoria...
    if (category) {
        return res.status(400).json({
            msg: `Category [${ category.name }] already exists`
        });
    }

    category = new Category({ name, desc, user: user._id });

    // Guardar en la BD
    await category.save();

    res.status(201).json({
        category
    });
}

const categoryPut = async(req, res = response) => {
    const { id }         = req.params;
    let   { name, desc } = req.body;
    const user           = req.user;

    let category = await Category.findById( id );

    // Reviso si vino el nombre para hacer validaciones extras...
    if (name) {
        //Lo pongo en mayuscula...
        name = name.toUpperCase();

        // Busco si hay una categoria con el mismo nombre...
        const otherCategory = await Category.findOne({ name });
    
        // Verifico que la categoria con el mismo nombre no sea la actual,
        // es decir no cambiaron el nombre, lo mantuvieron...
        if (otherCategory && otherCategory._id != id) {
            return res.status(400).json({
                msg: `Ya existe una categoria con el nombre [${ name }].`
            });
        }
    } else {
        name = category.name;
    }

    category = await Category.findByIdAndUpdate(id, { name, desc, user: user.id }, { new: true }).populate('user');

    res.json(category);
}

const categoryDelete = async(req, res = response) => {
    const { id } = req.params;
    const user   = req.user;

    // Eliminacion logica...
    const category = await Category.findByIdAndUpdate( id, { status: false, user: user._id }, { new: true } ).populate('user');

    res.json(category);
}

module.exports = {
    categoriesGet,
    categoryGet,
    categoryPost,
    categoryPut,
    categoryDelete
}