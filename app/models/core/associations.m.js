var db = {};

db.Admin = require('./admin.m')
db.Admin_role = require('./admin_role.m')


db.Admin.hasOne(db.Admin_role, {sourceKey: 'role_id', foreignKey: 'id'});
//db.Admin_role.belongsTo(db.Admin, {sourceKey: 'role_id', foreignKey: 'id'})

module.exports = db;