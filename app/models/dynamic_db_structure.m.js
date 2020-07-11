const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');


const dynamic_db_structure = new Schema({
    name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },

    kind: {
        type: String, // string, number, boolean, objectID array, objectID single , Date, Buffer, mixed, array
        required: false
    },
    related: {
        type: String,
        required: false
    },
    mandatory: {
        type: Boolean,
        required: true,
        default: false
    },
    default: {
        type: Boolean,
        required: true,
        default: false
    },
    default_type: {
        type: String,
        required: false,
    },
    defult_custom: {
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
        default: moment().format()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: moment().format()
    },
});

dynamic_db_structure.plugin(dataTables);
module.exports = mongoose.model('dynamic_db_structure', dynamic_db_structure);























