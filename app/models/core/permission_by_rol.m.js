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
        default: false
    },
    create: {
        type: Boolean,
        required: true,
        default: false
    },
    read_me: {
        type: Boolean,
        required: true,
        default: false
    },
    read_all: {
        type: Boolean,
        required: true,
        default: false
    },
    update_me: {
        type: Boolean,
        required: true,
        default: false
    },
    update_all: {
        type: Boolean,
        required: true,
        default: false
    },
    delete_me: {
        type: Boolean,
        required: true,
        default: false
    },
    delete_all: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: moment
    },
    updatedAt: {
        type: Date,
        required: true,
        default: moment
    },
});

permission_by_rol.plugin(dataTables);
module.exports = mongoose.model('permission_by_rol', permission_by_rol);























