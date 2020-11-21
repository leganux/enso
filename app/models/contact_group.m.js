const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');


const contact_group = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    description: {
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

contact_group.plugin(dataTables);
module.exports = mongoose.model('contact_group', contact_group);























