const mongoose = require('mongoose');
const {Schema} = mongoose;
const user_role = require('./user_roles.m')
const app = require('./core/app.m')
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const user = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: 'https://source.unsplash.com/800x800/?face'
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: user_role
    },
    app: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: app
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

user.plugin(dataTables);
module.exports = mongoose.model('user', user);















