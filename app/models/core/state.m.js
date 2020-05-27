const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const state = new Schema({
    id: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    country_id: {
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

state.plugin(dataTables);
module.exports = mongoose.model('state', state);















