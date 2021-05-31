const Variant = require('../models/variants/variant.model');

module.exports = {
    createVariant: async (variantObj)=> {
        //Todo: make sure it's a unique combination for this product, add ORM hook 'pre' save
        return await Variant.create(variantObj);

    },
}