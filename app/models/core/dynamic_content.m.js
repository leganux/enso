const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');
const language_list = require('./languages_list.m');

const dynamic_content = new Schema({
    language: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: language_list
    },
    reference: {
        type: String,
        required: false
    },
    content: {
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
        default: moment
    },
    updatedAt: {
        type: Date,
        required: true,
        default: moment
    },
});

dynamic_content.plugin(dataTables);
module.exports = mongoose.model('dynamic_content', dynamic_content);























