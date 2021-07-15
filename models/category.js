const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

CategorySchema.methods.toJSON = function() {
    let { __v, _id, status, user=user, ...category } = this.toObject();
    category.id = _id;

    let pass, userFinal;

    ({ __v, _id, pass, ...userFinal} = user);

    userFinal.uid = _id;
    category.user = userFinal;

    return category;
}

module.exports = model('Category', CategorySchema);
