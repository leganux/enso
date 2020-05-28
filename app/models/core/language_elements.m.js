const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');
const language_list = require('./languages_list.m');

const languages_elements = new Schema({
    language: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: language_list
    },
    element_ref: {
        type: String,
        required: false
    },
    element_text: {
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

languages_elements.plugin(dataTables);
module.exports = mongoose.model('languages_elements', languages_elements);























