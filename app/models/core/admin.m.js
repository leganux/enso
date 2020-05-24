const Sequelize = require('sequelize');
const db = require('../../system/db/db_core_conection').SQLDB;
const admin_role = require('./admin_role.m')


const admin = db.define('admin', {
    id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}, {
    // options
});

admin.sync().then(() => {

});

//admin.hasOne(admin_role, {foreignKey: 'role_id'});


module.exports = admin;