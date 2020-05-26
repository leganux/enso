const mongoose = require('mongoose');
const env = require('./../../config/environment.config').environment
const URI = 'mongodb://' + env.mongo_host + '/' + env.mongo_collection_name;
const autoIncrement = require('mongoose-auto-increment');

mongoose.connect(URI, {useNewUrlParser: true})
    .then(db => console.log('DB is connected'))
    .catch(error => console.error(error));
autoIncrement.initialize(mongoose);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = mongoose;