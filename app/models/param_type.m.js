const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');


const paramType = new Schema({
    name: {
        type: String,
        require: false
    },
    description: {
        type: String,
        unique: false
    },
    key: {
        type: String,
        required: false,
    },
    app: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: app
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