const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');
const admin = require('./admin.m')


const app = new Schema({
    name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    },
    owner: {
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

app.plugin(dataTables);
module.exports = mongoose.model('app', app);























