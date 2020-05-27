const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const city = new Schema({
    id: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    state_id: {
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

city.plugin(dataTables);
module.exports = mongoose.model('city', city);















