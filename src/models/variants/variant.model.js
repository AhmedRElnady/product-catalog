const mongoose = require('mongoose'),
    {
        ObjectId
    } = mongoose.Schema.Types;


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

variantSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        ret.id = ret._id;

        delete ret.deleted;
        delete ret._id;
        delete ret.__v;
    }
})

mongoose.set('useFindAndModify', false);
const Variant = mongoose.model('Variant', variantSchema);
module.exports = Variant;