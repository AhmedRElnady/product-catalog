const Products = require("../models/products/product.model");

module.exports = {
    getProducts: async(query) => {
        const {cate, type, waterCom, flavor, size}= query; 
        
        const joinedCollectionQuery = {
            ...(type) && {'attr.type': type},
            ...(waterCom) && {'attr.waterCom' : waterCom},
            ...(flavor) && {'attr.flavor': flavor},
            ...(size) && {'attr.size': size},
        };
        console.log(">>> joinColled >>>", joinedCollectionQuery);


        const searchRes = await Products.aggregate([
            { "$match": { "category": cate } },
            {
                $lookup:
                   {
                     from: "variants",
                     let: { productId: '$_id' },
                     pipeline: [
                        { $match:
                           { $expr:
                              { 
                                  $eq: ['$prodId', '$$productId']
                              }
                           }
                        },

                        { $match: joinedCollectionQuery },
                        { $project: { attr: 1, _id: 0 } }
                     ],
                     as: "variants"
                   }
            },
            // { $skip: (+1 - 1) * +10 },
            // { $limit: +10 },

            // {
            //     '$facet': {
            //         totalCount: [{ $count : "count"}],
            //         x: [{ $skip: (+1 - 1) * +10 }, { $limit: +10 } ]
            //       }
            // },

            { $addFields: {
                SKU: {
                    $map: {
                        input: "$variants.attr",
                        as: "result",
                        in: {
                            type: "$$result.type",
                            waterCom: "$$result.waterCom",
                            model: "$$result.model",
                            flavor: "$$result.flavor",
                            size: "$$result.size"
                        }
                    }
                }
            }},
            { $project: { SKU: 1, _id: 0 } },
            
        ]);
        return searchRes[0].SKU;
    },
} 


// /// final aggregation shape.

// db.getCollection('products').aggregate([
//     { "$match": { "category": "CM" } },
//     {
//         $lookup:
//            {
//              from: "variants",
//              let: { productId: '$_id' }, // from main collection
//              pipeline: [
//                 { $match:
//                    { $expr:
//                       { 
//                           $eq: ['$prodId', '$$productId']
                     
//                       }
//                    }
//                 },

//                 { $match: {  "attr.type" : "small" }},

//                 { $project: { attr: 1, _id: 0 } }
//              ],
//              as: "variants"
//            }
//     },
// //     { $skip: (+1 - 1) * +10 },
// //     { $limit: +10 },
    
// //     {
// //         '$facet': {
// //             totalCount: [{ $count : "count"}],
// //             x: [{ $skip: (+1 - 1) * +10 }, { $limit: +10 } ]
// //           }
// //     },

//     { $addFields: {
//         SKU: {
//             $map: {
//                 input: "$variants.attr",
//                 as: "result",
//                 in: {
//                     type: "$$result.type",
//                     waterCom: "$$result.waterCom",
//                     model: "$$result.model",
//                     flavor: "$$result.flavor",
//                     size: "$$result.size"
//                 }
//             }
//         }
//     }},
//     { $project: { SKU: 1, _id: 0 } },

// ]);

