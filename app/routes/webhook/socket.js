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
        .of(env.root_path + 'ensoSocket')
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
                console.log("nuevo ",nuevo)

                let mensaje = JSON.parse(nuevo)

                let listaDeChats = await modelChatList.findById(mensaje.chat)
                let chatbot = await modelEndpoint.findById(listaDeChats.endpoint_id)
                let origin = await modelorigin.findById(listaDeChats.origin_chatbot)



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
                mensaje_nuevo.full_json = JSON.stringify(mensaje_nuevo)


                listaDeChats.last_message = mensaje.text;
                listaDeChats.last_time = moment().format();
                await listaDeChats.save();


                let messaje_save = await mensaje_nuevo.save()


                if (!messaje_save) {
                    return res.status(503).json({
                        success: false,
                        message: 'Can not save message'
                    });
                }
                if(origin.name == "Origin Telegram"){
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


                }else if(origin.name == "Origin Facebook"){

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

                }else if(origin.name == "Origin Web"){

                    try{
                        /* TODO
                        *   terminar sockets para web */
                        let url = 'https://11c79550c24a.ngrok.io/enso/app/api/webhook/web/5ed553401c73b503b759fba9/pruebas_web/'
                        let response = await  axios.post(url,{
                            endpoint:listaDeChats.endpoint_id,
                            chat_id:listaDeChats.chat_id,
                            message: JSON.stringify(messaje_save)
                        })

                        console.log(response.data)
                        console.log(messaje_save)
                        socket.emit('enso_chatWeb:' + listaDeChats.endpoint_id + ':' + listaDeChats.chat_id, JSON.stringify(messaje_save));
                    }catch (e) {
                        console.log(e)
                    }

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
            socket.on('enso_chatWeb:Send', async function (message) {

                message = JSON.parse(message);
                console.log(message)


                let endpoint = await modelEndpoint.findById(message.endpoint_id);

                if (!endpoint) {
                    return false;
                }


                let chatlist = await modelChatList.findOne({
                    endpoint_id: endpoint._id,
                    chat_id: message.chat_id,
                    origin_chatbot: "6058bc38dd3a3c2e46dbe2a2"
                });


                if (!chatlist) {

                    let chatlist_nuevo = new modelChatList({
                        endpoint_id: endpoint._id,
                        chat_id: message.chat_id,
                        active_conv: false,
                        dt_reg: moment().format(),
                        origin_chatbot: "6058bc38dd3a3c2e46dbe2a2",
                        app: message.app
                    });
                    chatlist = await chatlist_nuevo.save();
                }

                chatlist.last_message = message.text;
                chatlist.last_time = moment().format();
                await chatlist.save();

                console.log(chatlist)

               var conv = new modelChatConversation({
                    chatlist_id: chatlist._id,
                    chat_id: message.chat_id,
                    text: message.text,
                    full_json: JSON.stringify(message),
                    who_says: 'external',
                    origin_chatbot: "6058bc38dd3a3c2e46dbe2a2",
                    dt_reg: moment().format(),
                   app: message.app
                });

                let conversation = await conv.save();


                if (!conversation) {
                    return false;
                }
                console.log(chatlist._id)
                socket.emit('chat_talk_one:' + chatlist._id, JSON.stringify(conversation));

            });
        })

}


module.exports = {
    ensoSocket : ensoSocket
};