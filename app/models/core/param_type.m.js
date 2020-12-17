const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');


const paramType = new Schema({
    name: {
        type: String,
        require: false
    },
    description: {
        type: String,
        required: false,
    },
    key: {
        type: Number,
        required: false,
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

paramType.plugin(dataTables);
module.exports = mongoose.model('paramType', paramType);