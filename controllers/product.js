const { response, request } = require('express');

const User     = require('../models/user');
const Category = require('../models/category');
const Product  = require('../models/product');

const productsGet = async(req = request, res = response) => {
    let { limit=5, from=0 } = req.query;

    limit = Number( limit );
    from  = Number( from  );

    const query = { status: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find          ( query )
            .populate('user')
            .populate('category')
            .skip ( from  )
            .limit( limit )
    ]);

    res.json({
        total,
        limit,
        products
    });
}

const productGet = async(req = request, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('user')
        .populate('category');

    res.json({
        product
    });
}

const productPost = async(req, res = response) => {
    const name = req.body.name.toUpperCase();
    const user = req.user;
    const { desc, precio, available, category } = req.body;

    let product = await Product.findOne({ name });

    // Valido que no exista la categoria...
    if (product) {
        return res.status(400).json({
            msg: `Product [${ product.name }] already exists`
        });
    }

    product = new Product({ name, desc, precio, available, category, user: user._id });

    // Guardar en la BD
    await product.save();

    res.status(201).json({
        product
    });
}

const productPut = async(req, res = response) => {
    const { id } = req.params;
    const user   = req.user;

    let { name, desc, precio, available, category } = req.body;

    let product = await Product.findById(id);

    // Reviso si vino el nombre para hacer validaciones extras...
    if (name) {
        //Lo pongo en mayuscula...
        name = name.toUpperCase();

        // Busco si hay una categoria con el mismo nombre...
        const otherProduct = await Product.findOne({ name });

        // Verifico que el producto con el mismo nombre no sea el actual,
        // es decir no cambiaron el nombre, lo mantuvieron...
        if (otherProduct && otherProduct._id != id) {
            return res.status(400).json({
                msg: `Ya existe un producto con el nombre [${ name }].`
            });
        }
    } else {
        name = product.name;
    }

    if (!available) { available = product.available }
    if (!precio   ) { precio    = product.precio    }

    product = await Product.findByIdAndUpdate(id, { name, desc, precio, available, category, user: user.id }, { new: true })
        .populate('user')
        .populate('category');

    res.json(product);
}

const productDelete = async(req, res = response) => {
    const { id } = req.params;
    const user   = req.user;

    // Eliminacion logica...
    const product = await Product.findByIdAndUpdate(id, { status: false, user: user._id }, { new: true })
        .populate('user')
        .populate('category');

    res.json(product);
}

module.exports = {
    productsGet,
    productGet,
    productPost,
    productPut,
    productDelete
}