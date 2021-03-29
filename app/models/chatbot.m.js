const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const params = require("./webservice_params.m");
const chatbottype = require("./core/chetbot_type.m")
const origin = require("./core/origin_chatbot")

const app = require('./core/app.m');


const chatbot = new Schema({
    name: {
        type: String,
        require: false,
        unique: true
    },
    description: {
        type: String,
        required: false,
    },
    chatbot_type: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: chatbottype,
    },
    origin_chatbot: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: origin,
    },
    facebook_recipient: {
        type: String,
        required: false,
    },
    google_auth: {
        type: String,
        required: false,
    },
    google_password: {
        type: String,
        required: false,
    },
    private_key: {
        type: String,
        required: false,
    },
    public_key: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    telegram_token: {
        type: String,
        required: false
    },
    webhook: {
        type: String,
        required: false
    },
    name_collection_products: {
        type: String,
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

chatbot.plugin(dataTables);
module.exports = mongoose.model('chatbots', chatbot);