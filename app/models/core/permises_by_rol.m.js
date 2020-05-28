const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');
const admin_role = require('./admin_role.m')


const permises_by_rol = new Schema({
    name: {
        type: String,
        required: false
    },
    crud: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: admin_role
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

permises_by_rol.plugin(dataTables);
module.exports = mongoose.model('permises_by_rol', permises_by_rol);























