const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');
const admin = require('./admin.m')


const permises_by_admin = new Schema({
    name: {
        type: String,
        required: false
    },
    crud: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: admin
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

permises_by_admin.plugin(dataTables);
module.exports = mongoose.model('permises_by_admin', permises_by_admin);























