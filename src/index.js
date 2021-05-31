const bootstrap = require('./server');
const mongoose = require('mongoose'),
    { ObjectId } = mongoose.Types;
const dotenv = require('dotenv');
dotenv.config();


const Products = require('../src/models/products/product.model');

const port = process.env.PORT;

async function runApp() {
    const app = await bootstrap(port);
    ////////////////////////////////////
    /////// TEST SECTION ////
    ////////////////////////////////////
    console.log("... TEST SECTION ...");

    // const x = await Products.find({});
    // console.log(">>> x >>>", x);
    return app;
}

(async () => {
    await runApp();
})();

module.exports = runApp;