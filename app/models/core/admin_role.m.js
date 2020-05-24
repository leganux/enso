const Sequelize = require('sequelize');
const db = require('../../system/db/db_core_conection').SQLDB;
const admin = require('./admin.m')


const admin_role = db.define('admin_role', {
    id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
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

admin_role.sync().then(() => {

});

//admin_role.belongsTo(admin,{foreignKey:'role_id'});


module.exports = admin_role;