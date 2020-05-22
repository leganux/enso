const Sequelize = require('sequelize');
const path = require('path');

var dir_sqlite = path.join(__dirname, '/db/core.sqlite');

var SQLDB = new Sequelize({
    storage: dir_sqlite,
    dialect: 'sqlite',
    logging: false
});

SQLDB.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {SQLDB};