const mongoose = require('mongoose');
const variables = require('./variables.js');
var URI
if (variables.mongo_password && variables.mongo_user && variables.mongo_user !== '' && variables.mongo_password !== '') {
    URI = 'mongodb://' + variables.mongo_user + ':' + variables.mongo_password + '@' + variables.mongo_host + ':' + variables.mongo_port + '/' + variables.mongo_database;
} else {
    URI = 'mongodb://' + variables.mongo_host + ':' + variables.mongo_port + '/' + variables.mongo_database;
}

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('DB is connected for ' + variables.mongo_database))
    .catch(error => console.error(error));


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

module.exports = mongoose;