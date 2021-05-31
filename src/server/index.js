const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const connect = require('../config/mongoose');
let cors = require('cors')
// const cartsRoutes = require('../api/controllers/cart.controller');



function bootstrap(port) {
    return new Promise(async (resolve, reject) => {
        const dbInstance = await connect();

        app.use('/', (req, res, next) => {

            let contype = req.headers['content-type'];
            if (contype && !((contype.includes('application/json') || contype.includes('multipart/form-data'))))
                return res.status(415).send({
                    error: 'Unsupported Media Type (' + contype + ')'
                });

            next();
        });

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');

        app.use(bodyParser.json({
            limit: '100mb'
        }));
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        app.use(cookieParser());

        app.get('/', function (req, res) {
            res.status(200).send(`Welcom to JFC-API v1`);
        })

        // Enable CORS from client-side
        app.use(cors());

        // app.use(function (req, res, next) {
        //     res.setHeader("Access-Control-Allow-Origin", "*");
        //     res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        //     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
        //     res.setHeader("Access-Control-Allow-Credentials", "true");
        //     next();
        // });

        app.use('/api/v1', require('../api/controllers'));

        process.on('uncaughtException', (err) => {
            console.log(">>>> err ", err);
        });

        process.on('unhandledRejection', (err) => {
            console.log(">>> .... err .... >>>>", err);
        })

        const server = app.listen(port, () => {
            console.log(`.... JFC server started on port ${port} ....`)

        })
        resolve(server);

    })
}

module.exports = bootstrap;