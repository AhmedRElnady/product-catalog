const mongoose = require('mongoose'),
    { ObjectId } = mongoose.Schema.Types;

const bcrypt = require('bcrypt');
// const validator = require('validator');
// const jwt = require('jsonwebtoken');

// const { USER } = require('../../config');


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

productSchema.pre('save', function (next) {
    const admin = this;

    if (!admin.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(admin.password, salt, function (err, hash) {
            if (err) return next(err);
            admin.password = hash;
            next();
        });
    });
}); // end pre save

/// instnce method 
productSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the admin
    const admin = this;

    const token = jwt.sign({
        _id: admin._id
    }, process.env.JWT_ADMIN_KEY); /// sign(payload, secret)

    admin.tokens = admin.tokens.concat({
        token
    });

    await admin.save();
    return token;
}
/// model method 
productSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const admin = await Admin.findOne({
        email
    });
    if (!admin) return;

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) return;

    return admin;
}

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