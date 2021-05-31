const express = require('express'),
    router = express.Router();

const validate = require('../middlewares/validation/validate.middleware');
const { PRODUCT_QUERY } = require('../../models/products/product.schema'),
    { OBJ_ID_PARAM, VARIANT_BODY } = require('../../models/variants/variant.schema');


const { getProducts } = require('../../services/product.service'),
    { createVariant } = require('../../services/variant.service');

router.post('/', async (req, res, next)=> {
    try {
    } catch (err) {
        console.log(">>> err >>>", err);
        
    }
});

router.post('/:id/variants', validate({ params: OBJ_ID_PARAM, body: VARIANT_BODY }), async(req, res, next)=> {
    try {
        const {id: prodId} = req.params,
            { attr} = req.body;

        const variantObj = {
            prodId,
            attr,
        }
        console.log(">>> attr >>>", attr);

        const createdVariant = await createVariant(variantObj);
        console.log(">> createdVariant >>", createdVariant);

        res.status(201).json({
            createdVariant,
            message: "variant created successfully",
            success: true,
        });

 
    } catch (err) {
        console.log(">>> err >>>", err);

    }
});

router.get('/', validate({ query: PRODUCT_QUERY }), async (req, res, next) => {
    try {
       
        const { cate, type, waterCom, flavor, size } = req.query; 
        console.log("... req.query ...", req.query);

        const skuList  = await getProducts(req.query); 
        console.log(">>> skuList >>>", skuList);

        res.status(200).json({
            skuList,
            message: "Found successfully",
            success: true,
        });
    } catch (err) {
        console.log(">>> err >>>", err);
        res.status(400).json({
            message: 'Duplicated school Name, Please choose another name!',
            success: false,
        });
    }


});


module.exports = router;