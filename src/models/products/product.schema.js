const { PRODUCTS_CATEGORIES: { COFFEE_MACHINES, COFFEE_PODS }, TYPES: { LARGE, SMALL, ESPRESSO } } = require('../../config/index'),
    { FLAVOR: { VANILLA, CARAMEL, PSL, MOCHA, HAZELNUT }, SIZE: { dozen_1, dozen_3, dozen_5, dozen_7 }} = COFFEE_PODS;

module.exports = {
    PRODUCT_BODY: {

    },
    PRODUCT_QUERY: {
        required: ['cate'],

        properties: {
            cate: {
                type: 'string',
                enum: [COFFEE_MACHINES.NAME, COFFEE_PODS.NAME],
                example: 'CM', // will used in docs too
            },
            type: {
                type: 'string',
                enum: [LARGE, SMALL, ESPRESSO],
            },
            waterCom: {
                type: 'boolean',
            },
            flavor: {
                type: 'string',
                enum: [VANILLA, CARAMEL, PSL, MOCHA, HAZELNUT],
            },
            size: {
                type: 'integer',
                enum: [dozen_1, dozen_3, dozen_5, dozen_7]
            }
        }
    },
}