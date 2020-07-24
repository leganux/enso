const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');


const mail = new Schema({
    subject: {
        type: String,
        required: true,
        unique: false
    },
    content: {
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

mail.plugin(dataTables);
module.exports = mongoose.model('mail', mail);























