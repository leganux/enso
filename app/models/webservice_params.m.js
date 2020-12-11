const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const paramtype = require("./param_type.m");

const app = require('./core/app.m');


const webserviceParam = new Schema({
    name: {
        type: String,
        require: false
    },
    description: {
        type: String,
        unique: false
    },
    format: {
        type: String,
        required: false,
    },
    default: {
        type: Schema.Types.Mixed,
        required: false,
    },
    paramtype:{
        type: Schema.Types.ObjectId,
        required: false,
        ref: paramtype
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

webserviceParam.plugin(dataTables);
module.exports = mongoose.model('webservice_params', webserviceParam);