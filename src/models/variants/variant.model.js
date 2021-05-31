const mongoose = require('mongoose'),
    {
        ObjectId
    } = mongoose.Schema.Types;

const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {
    USER
} = require('../../config');


const variantSchema = new mongoose.Schema({
    prodId:{
        type: ObjectId,
        ref: 'product',
        required: true,
    },
    attr: {
        type: Object,
        default: {},
    },
 
}, {
    timestamps: true
});

// userSchema.pre('save', function (next) {
//     const user = this;

//     if (!user.isModified('password')) return next();

//     bcrypt.genSalt(10, function (err, salt) {
//         if (err) return next(err);

//         bcrypt.hash(user.password, salt, function (err, hash) {
//             if (err) return next(err);
//             user.password = hash;
//             next();
//         });
//     });
// }); // end pre save

/// instnce method 
// userSchema.methods.generateAuthToken = async function () {
//     // Generate an auth token for the user
//     const user = this;

//     const token = jwt.sign({
//         _id: user._id
//     }, process.env.JWT_KEY); /// sign(payload, secret)

//     user.tokens = user.tokens.concat({
//         token
//     });

//     await user.save();
//     return token;
// }
/// model method 
variantSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({
        email
    });
    if (!user) return;

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return;

    return user;
}


/// second artic
// variantSchema.methods.comparePassword = function (password) {
//     return bcrypt.compareSync(password, this.password)
// };

// variantSchema.methods.generatePWDReset = function () {
//     this.resetPWDToken = crypto.randomBytes(20).toString('hex');
//     this.resetPWDExpires = Date.now() + 3600000; //expires in an hour
// };

variantSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        ret.id = ret._id;

        delete ret.deleted;
        delete ret._id;
        delete ret.__v;
    }
})

mongoose.set('useFindAndModify', false);
const User = mongoose.model('Variant', variantSchema);
module.exports = User;