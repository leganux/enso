const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');
const admin = require('./admin.m')
const route = require('./routes.m')


const permission_by_admin = new Schema({
    route: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: route
    },
    admin: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: admin
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

permission_by_admin.plugin(dataTables);
module.exports = mongoose.model('permission_by_admin', permission_by_admin);























