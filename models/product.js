const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoria es obligatorio'],
        unique: true
    },
    desc: {
        type: String
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    precio: {
        type: Number,
        defult: 0.0
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

ProductSchema.methods.toJSON = function() {
    let { __v, _id, status, user=user, category=category, ...product } = this.toObject();
    product.id = _id;

    let pass, userFinal, categoryFinal;

    ({ __v, _id, pass, ...userFinal} = user);
    userFinal.uid = _id;

    ({__v, _id, status, ...categoryFinal} = category);
    categoryFinal.id = _id;

    product.user     = userFinal;
    product.category = categoryFinal;
    
    return product;
}

module.exports = model('Product', ProductSchema);
