const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const country = new Schema({
    id: {
        type: Number,
        required: false
    },
    shortname: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    phonecode: {
        type: Number,
        required: false,

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

country.plugin(dataTables);
module.exports = mongoose.model('country', country);















