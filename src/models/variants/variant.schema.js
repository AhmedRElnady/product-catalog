const { PRODUCTS_CATEGORIES: { COFFEE_MACHINES, COFFEE_PODS }, TYPES: { LARGE, SMALL, ESPRESSO } } = require('../../config/index'),
    { MODEL: { BASE, PREMIUM, DULUXE }} = COFFEE_MACHINES,
    { FLAVOR: { VANILLA, CARAMEL, PSL, MOCHA, HAZELNUT }, SIZE: { dozen_1, dozen_3, dozen_5, dozen_7 }} = COFFEE_PODS;

module.exports = {
    OBJ_ID_PARAM: {
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            // isObjectId: true,
            example: '5d5d2dcc6bf2413950f9bd0a',
          },
        },
    },
    VARIANT_BODY: {
        required: ['attr'],

        properties: {
            prodId: {
                type: 'string',
                // isObjectId: true,
                example: '5d5d2dcc6bf2413950f9bd0b'
            },

            attr: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        enum: [LARGE, SMALL, ESPRESSO],
                    },
                    waterCom: {
                        type: 'boolean',
                    },
                    model: {
                        type: 'string',
                        enum: [BASE, PREMIUM, DULUXE],
                    },
                    flavor: {
                        type: 'string',
                        enum: [VANILLA, CARAMEL, PSL, MOCHA, HAZELNUT],
                    },
                    size: {
                        type: 'integer',
                        enum: [dozen_1, dozen_3, dozen_5, dozen_7]
                    }
                },
                anyOf: [
                    { required: ['type', 'waterCom',] },
                    { required: ['type', 'flavor', 'size'] },
                  ],

            },
            
        }
    }
}