const mongoose = require('mongoose');
const {Schema} = mongoose;
const user = require('./users.m')
const app = require('./core/app.m')
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const app_file_admin = new Schema({
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
        required: false,
        ref: user
    },
    app: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: app
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

app_file_admin.plugin(dataTables);
module.exports = mongoose.model('app_file_admin', app_file_admin);















