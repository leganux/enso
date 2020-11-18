const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const languages_list = new Schema({
    name: {
        type: String,
        required: false
    },
    lang_code: {
        type: String,
        required: false
    },
    flag_uc: {
        type: String,
        required: false
    },
    flag_img: {
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

languages_list.plugin(dataTables);
module.exports = mongoose.model('languages_list', languages_list);























