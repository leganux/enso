const mongoose = require('mongoose');
const {Schema} = mongoose;
const admin_role = require('./admin_role.m')
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const admin = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: admin_role
    },
    active: {
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

admin.plugin(dataTables);
module.exports = mongoose.model('admin', admin);















