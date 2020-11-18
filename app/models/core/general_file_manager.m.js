const mongoose = require('mongoose');
const {Schema} = mongoose;
const admin = require('./admin.m')
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const file_admin = new Schema({
    url: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    original_name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: admin
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

file_admin.plugin(dataTables);
module.exports = mongoose.model('file_admin', file_admin);















