const mongoose = require('mongoose'),
    { ObjectId } = mongoose.Schema.Types;



const productSchema = new mongoose.Schema({

    category: {
        type: Number,
        required: true,
    },

    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,

    },
    name: {
        type: String,
        // trim: true,
        required: true,
        // unique: true
    },

}, {
    timestamps: true
});

productSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        ret.id = ret._id;

        delete ret.deleted;
        delete ret._id;
        delete ret.__v;
    }
})

mongoose.set('useFindAndModify', false);
const Product = mongoose.model('Product', productSchema);
module.exports = Product;