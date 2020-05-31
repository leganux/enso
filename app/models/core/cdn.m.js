const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');


const cdn = new Schema({
    url: {
        type: String,
        required: false
    },
    path: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
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























