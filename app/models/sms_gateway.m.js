const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');


const sms = new Schema({
    Number: {
        type: Number,
        require: false
    },
    phonecode: {
        type: String,
        required: false,
        unique: false
    },
    messageText: {
        type: String,
        required: false,
    },
    sended: {
        type: Boolean,
        required: false
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

sms.plugin(dataTables);
module.exports = mongoose.model('sms', sms);

