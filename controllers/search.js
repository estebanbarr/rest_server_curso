const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;

const User     = require('../models/user');
const Role     = require('../models/role');
const Category = require('../models/category');
const Product  = require('../models/product');

const searchUsers = async(term, res = response, limit, from) => {
    if (ObjectId.isValid(term)) {
        const user = await User.findById(term)
            .skip ( from  )
            .limit( limit );
        return res.json({
            total: 1,
            results: (user) ? [user] : []
        });
    }

    const regexp = new RegExp(term, 'i');

    const [total, users] = await Promise.all([
        User.countDocuments({
            $or: [{ name: regexp }, { email: regexp }],
            $and: [{ status: true }]
        }),
        User.find({
            $or: [{ name: regexp }, { email: regexp }],
            $and: [{ status: true }]
        })
        .skip ( from  )
        .limit( limit )
    ]);
    return res.json({
        total,
        results: users
    });
}

const searchCategories = async(term, res = response, limit, from) => {
    if (ObjectId.isValid(term)) {
        const category = await Category.findById(term).populate('user')
            .skip ( from  )
            .limit( limit );
        return res.json({
            total: 1,
            results: (category) ? [category] : []
        });
    }

    const regexp = new RegExp(term, 'i');

    const [total, categories] = await Promise.all([
        Category.countDocuments({
            $or: [{ name: regexp }, { desc: regexp }],
            $and: [{ status: true }]
        }),
        Category.find({
            $or: [{ name: regexp }, { desc: regexp }],
            $and: [{ status: true }]
        })
        .populate('user')
        .skip ( from  )
        .limit( limit )
    ]);
    return res.json({
        total,
        results: categories
    });
}

const searchProducts = async(term, res = response, limit, from) => {
    if (ObjectId.isValid(term)) {
        const product = await Product.findById(term)
            .populate('user')
            .populate('category')
            .skip ( from  )
            .limit( limit );
        return res.json({
            total: 1,
            results: (product) ? [product] : []
        });
    } 

    let total, products;
    if (!isNaN(term)) {
        const regexp = new RegExp(term, 'i');

        [total, products] = await Promise.all([
            Product.countDocuments({
                $or: [{ name: regexp }, { desc: regexp }, { precio: term }],
                $and: [{ status: true }]
                }),
            Product.find({
                $or: [{ name: regexp }, { desc: regexp }, { precio: term }],
                $and: [{ status: true }]
                })
                .populate('user')
                .populate('category')
                .skip ( from  )
                .limit( limit )
        ]);
    } else {
        const regexp = new RegExp(term, 'i');
    
        [total, products] = await Promise.all([
            Product.countDocuments({
                $or: [{ name: regexp }, { desc: regexp }],
                $and: [{ status: true }]
            }),
            Product.find({
                $or: [{ name: regexp }, { desc: regexp }],
                $and: [{ status: true }]
            })
            .populate('user')
            .populate('category')
            .skip ( from  )
            .limit( limit )
        ]);
    }

    return res.json({
        total,
        results: products
    });
}

const searchRoles = async(term, res = response, limit, from) => {
    if (ObjectId.isValid(term)) {
        const role = await Role.findById(term)
            .skip ( from  )
            .limit( limit );
        return res.json({
            total: 1,
            results: (role) ? [role] : []
        });
    }

    const regexp = new RegExp(term, 'i');

    const [total, roles] = await Promise.all([
        Role.countDocuments({
            $or: [{ role: regexp }, { desc: regexp }]
        }),
        Role.find({
            $or: [{ role: regexp }, { desc: regexp }]
        })
        .skip ( from  )
        .limit( limit )
    ]);
    return res.json({
        total,
        results: roles
    });
}

const allowedCollections = {
    'users': searchUsers,
    'categories': searchCategories,
    'products': searchProducts,
    'roles': searchRoles
};

const search = async(req, res) => {
    const { collection, term } = req.params;

    let { limit=5, from=0 } = req.query;

    limit = Number( limit );
    from  = Number( from  );

    if (!allowedCollections[collection]) {
        let allowedStr = '';
        Object.keys(allowedCollections).forEach((key) => {
            allowedStr += `, ${ key }`;
        })
        allowedStr = allowedStr.substr(2);
        return res.status(400).json({
            msg: `Las colecciones permitidas son: [${ allowedStr }]`
        });
    }

    allowedCollections[collection](term, res, limit, from);
}

module.exports = {
    search
}
