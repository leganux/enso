const mongoose = require('mongoose');
const {Schema} = mongoose;

const Endpoint = require('./chatbot.m')
const app = require('./core/app.m');
const origin = require("./core/origin_chatbot")

const chatListSchema = new Schema({
    endpoint_id: {type: Schema.Types.ObjectId, required: false, ref: Endpoint},
    chat_id: {type: String, required: false},
    active_conv: {type: Boolean, required: true, default: false},
    app: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: app
    },
    origin_chatbot: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: origin,
    },
    dt_reg: {type: Date, required: true},
    last_message: {type: String, required: false},
    last_time: {type: Date, required: false},

});

module.exports = mongoose.model('chat_list', chatListSchema);
