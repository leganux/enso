const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');


const cloud_functions = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: false,
    },
    method: { // POST, GET, PUT, DELETE
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        required: true,
        default: true
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

cloud_functions.plugin(dataTables);
module.exports = mongoose.model('cloud_functions', cloud_functions);























