const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');
const admin_role = require('./admin_role.m')
const route = require('./routes.m')


const permission_by_rol = new Schema({
    route: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: route
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: admin_role
    },
    see: {
        type: Boolean,
        required: true,
        default: true
    },
    create: {
        type: Boolean,
        required: true,
        default: true
    },
    read_me: {
        type: Boolean,
        required: true,
        default: true
    },
    read_all: {
        type: Boolean,
        required: true,
        default: true
    },
    update_me: {
        type: Boolean,
        required: true,
        default: true
    },
    update_all: {
        type: Boolean,
        required: true,
        default: true
    },
    delete_me: {
        type: Boolean,
        required: true,
        default: true
    },
    delete_all: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: moment().format()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: moment().format()
    },
});

permission_by_rol.plugin(dataTables);
module.exports = mongoose.model('permission_by_rol', permission_by_rol);























