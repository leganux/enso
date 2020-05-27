const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');


const cdn = new Schema({
    url: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
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

cdn.plugin(dataTables);
module.exports = mongoose.model('cdn', cdn);























