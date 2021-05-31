const mongoose = require('mongoose');

function connect() {
    return new Promise((resolve, reject) => {
        console.log(">>> env >>>", process.env.MONGODB);
        mongoose.connect(process.env.MONGODB, { useNewUrlParser: true,  useUnifiedTopology: true })
            .then(db=> {
                console.log(".... DB connected successfully ....");
                resolve(db);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = connect;