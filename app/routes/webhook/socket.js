const env = require('../../config/environment.config').environment;
var io = require('../../system/socket_server.system').io;
const axios = require("axios")
const request = require("request")

const moment = require('moment')

const modelEndpoint = require('../../models/chatbot.m');
const modelChatList = require('../../models/chat_list.m');
const modelChatConversation = require('../../models/chat_conversation');
const modelorigin = require('../../models/core/origin_chatbot')
//let dfFunctions = require('./dialogflowFunctions');

console.log("******", env.root_path)

var ensoSocket = {};
if (env.active_socket) {
    console.log(env.root_path)

    function makeid(length){
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    ensoSocket = io
        .of(env.root_path + '/ensoSocket')
        .on('connection', function (socket) {
            console.log("COnnectd socket")


            socket.on('chat_list:get_all', async function (id) {
                console.log("aqui")
                let listaDeChats = await modelChatList.find({
                    endpoint_id: id
                }).sort({last_time: 'asc'});

                socket.emit('chat_list_one:' + id, JSON.stringify(listaDeChats));
            });

            socket.on('chat_talk:send',async function (nuevo) {
                console.log("llego",nuevo)
                let mensaje = JSON.parse(nuevo)
                console.log("llego",mensaje)
                let listaDeChats = await modelChatList.findById(mensaje.chat)
                let chatbot = await modelEndpoint.findById(listaDeChats.endpoint_id)


                var mensaje_nuevo = new modelChatConversation({
                    message_id: makeid(10),
                    chatlist_id: mensaje.chat,
                    chat_id: listaDeChats.chat_id,
                    text: mensaje.text,
                    isRich: false,
                    who_says: 'me',
                    origin_chatbot: listaDeChats.origin_chatbot,
                    dt_reg: moment().format(),
                    app: mensaje.app

                })
                mensaje_nuevo.full_json = JSON.stringify(mensaje_nuevo),
                console.log(mensaje_nuevo)
                let messaje_save = await mensaje_nuevo.save()

                if (!messaje_save) {
                    return res.status(503).json({
                        success: false,
                        message: 'Can not save message'
                    });
                }
                if(listaDeChats.origin_chatbot == "6058bbb9dd3a3c2e46dbe2a1"){
                    let url = 'https://api.telegram.org/bot' + chatbot.telegram_token + '/sendMessage';

                    try {
                        let response = await axios.post(url,
                            {
                                chat_id:  listaDeChats.chat_id,
                                text: mensaje.text
                            })
                        console.log(response.data)

                    }catch (e) {
                        console.log(e)
                    }


                }else if(listaDeChats.origin_chatbot == "6058bb97dd3a3c2e46dbe2a0"){

                    let request_body = {
                        "messaging_type":"RESPONSE",
                        "recipient": {
                            "id":  listaDeChats.chat_id,
                            //"user_ref": "3909077815852238"
                        },
                        "message": {
                            "text": mensaje.text
                        }
                    }
                    console.log("requeste body ",request_body)
                    try {
                        let response = await request({
                            "uri": "https://graph.facebook.com/v10.0/me/messages",
                            "qs": {"access_token": chatbot.telegram_token},
                            "method": "POST",
                            "json": request_body
                        }, (err, res, body) => {
                            if (!err) {
                                console.log(body)
                                console.log('Mensaje enviado!')
                            } else {
                                console.error("No se puedo enviar el mensaje:" + err);
                            }
                        });

                    }catch (e) {
                        console.log("sucedio un error",e)
                    }

                }else if(listaDeChats.origin_chatbot == "6058bc38dd3a3c2e46dbe2a2"){
                    let obj = new modelChatConversation(mensaje_nuevo);
                    let rest = await obj.save();


                    socket.emit('DF_chatWeb:' + chatllistaDeChatsist.endpoint_id + ':' + mensaje_nuevo.chat_id, JSON.stringify(rest));
                }


                socket.emit('chat_talk_one:' + mensaje.chat, JSON.stringify(mensaje_nuevo));
            })
            socket.on('chat_talk:deactive_conversation', async function (id) {

                let converSation = await modelChatList.findById(id)
                converSation.active_conv = false;
                await converSation.save();

            });
            socket.on('disconnect', function () {

            });


            socket.on('chat_spy:conversation', async function (id) {

                let converSation = await modelChatList.findById(id)
                converSation.active_conv = true? true:false;
                await converSation.save();

                let listaDeElementos = await modelChatConversation.find({
                    chatlist_id: id
                }).sort({dt_reg: 'asc'});
                listaDeElementos.map((item, i) => {
                    socket.emit('chat_talk_one:' + id, JSON.stringify(item));
                })
            });
            socket.on('chat_speak:conversation', async function (id) {

                let converSation = await modelChatList.findById(id)
                converSation.active_conv = true;
                await converSation.save();

                let listaDeElementos = await modelChatConversation.find({
                    chatlist_id: id
                }).sort({dt_reg: 'asc'});
                listaDeElementos.map((item, i) => {
                    socket.emit('chat_talk_one:' + id, JSON.stringify(item));
                })
            });

            socket.on('chat_talk:conversation', async function (id) {

                let converSation = await modelChatList.findById(id)
                converSation.active_conv = true;
                await converSation.save();

                let listaDeElementos = await modelChatConversation.find({
                    chatlist_id: id
                }).sort({dt_reg: 'asc'});
                listaDeElementos.map((item, i) => {
                    dashFlowSocket.emit('chat_talk_one:' + id, JSON.stringify(item));
                })
            });


            socket.on('DF_chatWeb:GetALL', async function (message) {
                message = JSON.parse(message);

                let ChatList = await modelChatList.findOne({
                    endpoint_id: message.endpoint_id,
                    chat_id: message.chat_id,
                    platform: 'WEB'
                });

                if (!ChatList) {

                    return 0;
                }

                let conversations = await modelChatConversation.find({
                    chatlist_id: ChatList._id
                });

                if (!conversations || conversations.length == 0) {
                    console.error('conversaciones no encontrados o sin mensajes');
                    return 0;
                }
                conversations.map(function (conversation_, posConv) {
                    socket.emit('DF_chatWeb:' + message.endpoint_id + ':' + message.chat_id, JSON.stringify(conversation_));
                });


            });
            socket.on('DF_chatWeb:Send', async function (message) {

                message = JSON.parse(message);


                let endpoint = await modelEndpoint.findById(message.endpoint_id);

                if (!endpoint) {

                    return false;
                }

                let chatlist = await modelChatList.findOne({
                    endpoint_id: endpoint._id,
                    chat_id: message.chat_id,
                    platform: 'WEB'
                });


                if (!chatlist) {

                    let chatlist_nuevo = new modelChatList({
                        endpoint_id: endpoint._id,
                        chat_id: message.chat_id,
                        active_conv: false,
                        dt_reg: moment().format(),
                        platform: 'WEB'
                    });
                    chatlist = await chatlist_nuevo.save();
                }

                chatlist.last_message = message.text;
                chatlist.last_time = moment().format();
                await chatlist.save();


                var conv = new modelChatConversation({
                    chatlist_id: chatlist._id,
                    chat_id: message.chat_id,
                    text: message.text,
                    full_json: JSON.stringify(message),
                    who_says: 'external',
                    platform: 'WEB',
                    dt_reg: moment().format(),
                });

                let conversation = await conv.save();


                if (!conversation) {

                    return false;
                }

                dashFlowSocket.emit('chat_talk_one:' + chatlist._id, JSON.stringify(conversation));

                if (!chatlist.active_conv) {

                    console.log('SESSIONID', message.chat_id + '_' + endpoint._id)

                    let promise = dfFunctions.send(endpoint.df_json_project_id, message.text, message.chat_id + '_' + endpoint._id, JSON.parse(endpoint.df_json_private_key).data, endpoint.df_json_client_email, endpoint.df_config_lang)
                    promise.then(async (ret) => {
                        ret = ret[0];


                        let arrayResponses = ret.queryResult.fulfillmentMessages;
                        let StringArrayResponses = JSON.stringify(arrayResponses);

                        if (StringArrayResponses.includes('TELEGRAM')) {

                            var message_new = new modelChatConversation({
                                chatlist_id: chatlist._id,
                                chat_id: message.chat_id,
                                text: ret.queryResult.fulfillmentText,
                                full_json: JSON.stringify(arrayResponses),
                                isRich: true,
                                rich_kind: 'DF_CODE_RESPONSE',
                                url: '',
                                who_says: 'me',
                                platform: 'WEB',
                                dt_reg: moment().format(),
                            });

                        } else {
                            var message_new = new modelChatConversation({
                                chatlist_id: chatlist._id,
                                chat_id: message.chat_id,
                                text: ret.queryResult.fulfillmentText,
                                full_json: JSON.stringify(ret),
                                isRich: false,
                                rich_kind: 'unknown',
                                url: '',
                                who_says: 'me',
                                platform: 'WEB',
                                dt_reg: moment().format(),
                            });
                        }


                        let conversation_ = await message_new.save();

                        if (!conversation_) {
                            return false;
                        }

                        dashFlowSocket.emit('chat_talk_one:' + chatlist._id, JSON.stringify(conversation_));
                        dashFlowSocket.emit('DF_chatWeb:' + message.endpoint_id + ':' + message.chat_id, JSON.stringify(conversation_));


                    }).catch((error) => {
                        console.error(error)
                        return false;
                    });

                } else {
                    // usuario interactua
                }

            });
        })

}

module.exports = {
    ensoSocket : ensoSocket
};