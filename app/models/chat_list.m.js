const mongoose = require('mongoose');
const {Schema} = mongoose;

const Endpoint = require('./chatbot.m')

const chatListSchema = new Schema({
    endpoint_id: {type: Schema.Types.ObjectId, required: false, ref: Endpoint},
    chat_id: {type: String, required: false},
    platform: {type: String, required: false},
    active_conv: {type: Boolean, required: true, default: false},
    dt_reg: {type: Date, required: true},
    last_message: {type: String, required: false},
    last_time: {type: Date, required: false},

});

module.exports = mongoose.model('chat_list', chatListSchema);
