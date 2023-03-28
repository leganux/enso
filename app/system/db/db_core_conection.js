const mongoose = require('mongoose');
const env = require('./../../config/environment.config').environment


mongoose.connect(env.mongo_uri)
    .then(db => console.log('DB is connected'))
    .catch(error => console.error(error));


module.exports = mongoose;
