const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');
const user_role = require('./user_roles.m')
const route = require('./routes_user.m')
const app = require('./core/app.m')


const user_permission_by_rol = new Schema({
    route: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: route
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: user_role
    },
    app: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: app
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

user_permission_by_rol.plugin(dataTables);
module.exports = mongoose.model('user_permission_by_rol', user_permission_by_rol);























