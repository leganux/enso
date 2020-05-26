const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const admin_role = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
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

admin_role.plugin(dataTables);
module.exports = mongoose.model('admin_role', admin_role);























