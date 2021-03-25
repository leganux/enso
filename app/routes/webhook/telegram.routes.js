const express = require('express');
const router = express.Router();

//let dfFunctions = require('./dialogflowFunctions');


let moment = require('moment');
let axios = require('axios');


const modelEndpoint = require('../../models/chatbot.m');
const modelorigin = require('../../models/core/origin_chatbot');
const modelChatList = require('../../models/chat_list.m');
const modelChatConversation = require('../../models/chat_conversation');

var telegram = require("./socket").ensoSocket;


let fnc_send_chatlists = async function (id) {
    let listaDeChats = await modelChatList.find({
        endpoint_id: id
    }).sort({last_time: 'desc'});
    telegram.emit('chat_list_one:' + id, JSON.stringify(listaDeChats));
}

let getUrlFile = async function (token, fileid) {

    let urlToGetPath = 'https://api.telegram.org/bot' + token + '/getFile?file_id=' + fileid;
    let url_to_public_path = ' https://api.telegram.org/file/bot' + token + '/';

    console.log('urlToGetPath', urlToGetPath)

    let res = await axios.get(urlToGetPath);
    let data = res.data;

    let for_url = url_to_public_path + data.result.file_path;

    return for_url;

}

router.post('/:app_id/:endpoint', async (req, res) => {
    var endpoint = req.params.endpoint;
    var app = req.params.app_id
    console.log("body", req.body)
    console.log("params", req.params.endpoint)
    console.log("app", req.params.app_id)
    var body = req.body;

    if (!body || !body.message || !body.message.chat.id) {
        return res.status(402).json({
            success: false,
            message: 'Incomplete request'
        });
    }

    try {
        var data = await modelEndpoint.findOne({
            name: endpoint.trim(),
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Webhook path or method not found'
            });
        }
        console.log(data.origin_chatbot)
        var data_or = await modelorigin.findById(data.origin_chatbot)
        console.log(data_or)

        let chatlist = await modelChatList.findOne({
            endpoint_id: data._id,
            chat_id: body.message.chat.id,
            origin_chatbot: data_or._id
        });
        console.log("chatlist si o no", chatlist)
        if (!chatlist) {
            let chatlist_nuevo = new modelChatList({
                endpoint_id: data._id,
                chat_id: body.message.chat.id,
                active_conv: false,
                dt_reg: moment().format(),
                origin_chatbot: data_or._id,
                app: app
            });
            console.log("cahtlist: ", chatlist_nuevo)
            chatlist = await chatlist_nuevo.save();
        }
        chatlist.last_message = body.message.text;
        chatlist.last_time = moment().format();
        await chatlist.save();
        let isText = false;

        console.log("cahtlist: ", chatlist)


        if (body.message.text) {
            isText = true;
            var conv = new modelChatConversation({
                message_id: body.update_id,
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: body.message.text,
                full_json: JSON.stringify(body),
                who_says: 'external',
                origin_chatbot: data_or._id,
                dt_reg: moment().format(),
                app: app,
            });
        } else if (body.message.sticker) {

            let fileUrl = await getUrlFile(data.telegram_token, body.message.sticker.thumb.file_id)

            var conv = new modelChatConversation({
                message_id: body.update_id,
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: body.message.sticker.emoji,
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'sticker',
                url: fileUrl,
                who_says: 'external',
                origin_chatbot: data_or._id,
                dt_reg: moment().format(),
                app: app
            });

        } else if (body.message.voice) {

            let fileUrl = await getUrlFile(data.telegram_token, body.message.voice.file_id)

            var conv = new modelChatConversation({
                message_id: body.update_id,
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: '',
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'voice',
                url: fileUrl,
                who_says: 'external',
                origin_chatbot: data_or._id,
                dt_reg: moment().format(),
                app: app
            });

        } else if (body.message.audio) {

            let fileUrl = await getUrlFile(data.telegram_token, body.message.audio.file_id)

            var conv = new modelChatConversation({
                message_id: body.update_id,
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: '',
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'voice',
                url: fileUrl,
                who_says: 'external',
                origin_chatbot: data_or._id,
                dt_reg: moment().format(),
                app: app
            });

        } else if (body.message.animation) {

            let fileUrl = await getUrlFile(data.telegram_token, body.message.animation.file_id)

            var conv = new modelChatConversation({
                message_id: body.update_id,
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: '',
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'animation',
                url: fileUrl,
                who_says: 'external',
                origin_chatbot: data_or._id,
                dt_reg: moment().format(),
                app: app
            });

        } else if (body.message.video_note) {

            let fileUrl = await getUrlFile(data.telegram_token, body.message.video_note.file_id)

            var conv = new modelChatConversation({
                message_id: body.update_id,
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: '',
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'animation',
                url: fileUrl,
                who_says: 'external',
                origin_chatbot: data_or._id,
                dt_reg: moment().format(),
                app: app
            });

        } else if (body.message.document) {

            let fileUrl = await getUrlFile(data.telegram_token, body.message.document.file_id)

            var conv = new modelChatConversation({
                message_id: body.update_id,
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: '',
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'document',
                url: fileUrl,
                who_says: 'external',
                origin_chatbot: data_or._id,
                dt_reg: moment().format(),
                app: app
            });

        } else if (body.message.photo) {
            console.log(body.message.photo)
            let fileUrl = await getUrlFile(data.telegram_token, body.message.photo[body.message.photo.length - 1].file_id)

            var conv = new modelChatConversation({
                message_id: body.update_id,
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: body.message.caption,
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'photo',
                url: fileUrl,
                who_says: 'external',
                origin_chatbot: data_or._id,
                dt_reg: moment().format(),
                app: app
            });

        } else if (body.message.video) {

            let fileUrl = await getUrlFile(data.telegram_token, body.message.video.file_id)

            var conv = new modelChatConversation({
                message_id: body.update_id,
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: body.message.caption,
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'animation',
                url: fileUrl,
                who_says: 'external',
                origin_chatbot: data_or._id,
                dt_reg: moment().format(),
                app: app
            });

        }

        var OBJCHAT = body.message;


        console.log("conv:", conv)
        let conversation = await conv.save();


        if (!conversation) {
            return res.status(503).json({
                success: false,
                message: 'Can not save conversation'
            });
        }

        fnc_send_chatlists(chatlist.endpoint_id);

        telegram.emit('chat_talk_one:' + chatlist._id, JSON.stringify(conversation));


        var REQID = chatlist._id + '_lx_data_id_telegram';


        /*if (!chatlist.active_conv) {

            let Myurl = 'https://bots.dialogflow.com/telegram/' + data.df_id + '/webhook';

            axios.post(Myurl, body)
                .then((response) => {

                    if (data.df_json_private_key && data.df_json_client_email && data.df_config_lang && isText && data.df_json_private_key != "" && data.df_json_client_email != "" && data.df_config_lang != "") {
                        let promise = dfFunctions.send(data.df_json_project_id, conversation.text, REQID, JSON.parse(data.df_json_private_key).data, data.df_json_client_email, data.df_config_lang)
                        promise.then(async (ret) => {
                            ret = ret[0];

                            var message_new = new modelChatConversation({
                                chatlist_id: chatlist._id,
                                chat_id: body.message.chat.id,
                                text: ret.queryResult.fulfillmentText,
                                full_json: JSON.stringify(ret),
                                isRich: false,
                                rich_kind: 'unknown',
                                url: '',
                                who_says: 'me',
                                platform: 'TELEGRAM',
                                dt_reg: moment().format(),
                            });

                            // let conversation_ = await message_new.save();

                            if (!conversation_) {
                                return res.status(503).json({
                                    success: false,
                                    message: 'Can not save conversation from DF response'
                                });
                            }
                            //console.log('########conversation_', conversation_)

                            telegram.emit('chat_talk_one:' + chatlist._id, JSON.stringify(conversation_));

                            return res.status(200).json({
                                success: true,
                                message: 'ok - sended to DF',
                            });

                        }).catch((error) => {

                            console.error('**************error****************', error)
                            res.status(200).json({
                                success: false,
                                message: 'DF error',

                            });

                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'ok - sended to DF',
                        });
                    }

                }).catch((error) => {
                console.error('**************error****************', error)
                return res.status(505).json({
                    success: false,
                    message: 'Axios error',

                });
            });
        } else {
            return res.status(200).json({
                success: true,
                message: 'ok'
            });
        }*/
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Internal error'
        });
    }
    //busca el endpoit

    res.status(200).json({})

});

/*router.get('/:endpoint', async (req, res) => {
    var endpoint = req.params.endpoint;

    var body = req.body;

    if (!body || !body.message || !body.message.chat.id) {
        return res.status(402).json({
            success: false,
            message: 'Incomplete request'
        });
    }

    try {

        //busca el endpoit
        var data = await modelEndpoint.findOne({
            platform: 'TELEGRAM',
            path_endpoint: endpoint.trim(),
            method: 'GET'
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Webhook path or method not found'
            });
        }

        let chatlist = await modelChatList.findOne({
            endpoint_id: data._id,
            chat_id: body.message.chat.id,
            platform: 'TELEGRAM'
        });


        if (!chatlist) {
            let chatlist_nuevo = new modelChatList({
                endpoint_id: data._id,
                chat_id: body.message.chat.id,
                active_conv: false,
                dt_reg: moment().format(),
                platform: 'TELEGRAM'
            });
            chatlist = await chatlist_nuevo.save();


        }

        chatlist.last_message = body.message.text;
        chatlist.last_time = moment().format();
        await chatlist.save();
        let isText = false;

        if (body.message.text) {
            isText = true;
            var conv = new modelChatConversation({
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: body.message.text,
                full_json: JSON.stringify(body),
                who_says: 'external',
                platform: 'TELEGRAM',
                dt_reg: moment().format(),
            });
        } else if (body.message.sticker) {

            let fileUrl = await getUrlFile(data.token, body.message.sticker.thumb.file_id)

            var conv = new modelChatConversation({
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: body.message.sticker.emoji,
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'sticker',
                url: fileUrl,
                who_says: 'external',
                platform: 'TELEGRAM',
                dt_reg: moment().format(),
            });

        } else if (body.message.voice) {

            let fileUrl = await getUrlFile(data.token, body.message.voice.file_id)

            var conv = new modelChatConversation({
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: '',
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'voice',
                url: fileUrl,
                who_says: 'external',
                platform: 'TELEGRAM',
                dt_reg: moment().format(),
            });

        } else if (body.message.audio) {

            let fileUrl = await getUrlFile(data.token, body.message.audio.file_id)

            var conv = new modelChatConversation({
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: '',
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'voice',
                url: fileUrl,
                who_says: 'external',
                platform: 'TELEGRAM',
                dt_reg: moment().format(),
            });

        } else if (body.message.animation) {

            let fileUrl = await getUrlFile(data.token, body.message.animation.file_id)

            var conv = new modelChatConversation({
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: '',
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'animation',
                url: fileUrl,
                who_says: 'external',
                platform: 'TELEGRAM',
                dt_reg: moment().format(),
            });

        } else if (body.message.video_note) {

            let fileUrl = await getUrlFile(data.token, body.message.video_note.file_id)

            var conv = new modelChatConversation({
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: '',
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'animation',
                url: fileUrl,
                who_says: 'external',
                platform: 'TELEGRAM',
                dt_reg: moment().format(),
            });

        } else if (body.message.document) {

            let fileUrl = await getUrlFile(data.token, body.message.document.file_id)

            var conv = new modelChatConversation({
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: '',
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'document',
                url: fileUrl,
                who_says: 'external',
                platform: 'TELEGRAM',
                dt_reg: moment().format(),
            });

        } else if (body.message.photo) {

            let fileUrl = await getUrlFile(data.token, body.message.photo[body.message.photo.length - 1].file_id)

            var conv = new modelChatConversation({
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: body.message.caption,
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'photo',
                url: fileUrl,
                who_says: 'external',
                platform: 'TELEGRAM',
                dt_reg: moment().format(),
            });

        } else if (body.message.video) {

            let fileUrl = await getUrlFile(data.token, body.message.video.file_id)

            var conv = new modelChatConversation({
                chatlist_id: chatlist._id,
                chat_id: body.message.chat.id,
                text: body.message.caption,
                full_json: JSON.stringify(body),
                isRich: true,
                rich_kind: 'animation',
                url: fileUrl,
                who_says: 'external',
                platform: 'TELEGRAM',
                dt_reg: moment().format(),
            });

        }

        console.log(body.message)


        let conversation = await conv.save();


        if (!conversation) {
            return res.status(503).json({
                success: false,
                message: 'Can not save conversation'
            });
        }

        fnc_send_chatlists(chatlist.endpoint_id);

        telegram.emit('chat_talk_one:' + chatlist._id, JSON.stringify(conversation));

        var REQID = chatlist._id + '_lx_data_id_telegram';

        if (!chatlist.active_conv) {

            let Myurl = 'https://bots.dialogflow.com/telegram/' + data.df_id + '/webhook';

            axios.post(Myurl, body)
                .then((response) => {

                    if (data.df_json_private_key && data.df_json_client_email && data.df_config_lang && isText && data.df_json_private_key != "" && data.df_json_client_email != "" && data.df_config_lang != "") {
                        let promise = dfFunctions.send(data.df_json_project_id, conversation.text, REQID, JSON.parse(data.df_json_private_key).data, data.df_json_client_email, data.df_config_lang)
                        promise.then(async (ret) => {
                            ret = ret[0];

                            var message_new = new modelChatConversation({
                                chatlist_id: chatlist._id,
                                chat_id: body.message.chat.id,
                                text: ret.queryResult.fulfillmentText,
                                full_json: JSON.stringify(ret),
                                isRich: false,
                                rich_kind: 'unknown',
                                url: '',
                                who_says: 'me',
                                platform: 'TELEGRAM',
                                dt_reg: moment().format(),
                            });

                            let conversation_ = await message_new.save();

                            if (!conversation_) {
                                return res.status(503).json({
                                    success: false,
                                    message: 'Can not save conversation from DF response'
                                });
                            }
                            //console.log('########conversation_', conversation_)

                            telegram.emit('chat_talk_one:' + chatlist._id, JSON.stringify(conversation_));

                            return res.status(200).json({
                                success: true,
                                message: 'ok - sended to DF',
                            });

                        }).catch((error) => {

                            console.error('**************error****************', error)
                            res.status(200).json({
                                success: false,
                                message: 'DF error',

                            });

                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'ok - sended to DF',
                        });
                    }

                }).catch((error) => {
                console.error('**************error****************', error)
                return res.status(505).json({
                    success: false,
                    message: 'Axios error',

                });
            });
        } else {
            return res.status(200).json({
                success: true,
                message: 'ok'
            });
        }


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Internal error'
        });
    }


});*/


module.exports = router;