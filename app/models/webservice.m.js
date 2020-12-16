const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const params = require("./webservice_params.m");

const app = require('./core/app.m');


const webservice = new Schema({
    name: {
        type: String,
        require: false
    },
    description: {
        type: String,
       required: false,
    },
    url: {
        type: String,
        required: false,
    },
    urltwo: {
        type: String,
        required: false,
    },
    urlthree: {
        type: String,
        required: false,
    },
    method: {
        type: String,
        required: false
    },
    params: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: params
    }],
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

webservice.plugin(dataTables);
module.exports = mongoose.model('webservice', webservice);