const express = require('express');
const router = express.Router();

let moment = require('moment');
let axios = require('axios');


const modelEndpoint = require('../../models/chatbot.m');
const modelorigin = require('../../models/core/origin_chatbot');
const modelChatList = require('../../models/chat_list.m');
const modelChatConversation = require('../../models/chat_conversation');

var facebook = require("./socket").ensoSocket;


let fnc_send_chatlists = async function (id) {
    let listaDeChats = await modelChatList.find({
        endpoint_id: id
    }).sort({last_time: 'desc'});
    facebook.emit('chat_list_one:' + id, JSON.stringify(listaDeChats));
}

router.get("/:app_id/:endpoint", async function (req, res) {
    var endpoint = req.params.endpoint
    var app = req.params.app_id

    try {
        var data = await modelEndpoint.findOne({
            origin_chatbot: '6058bb97dd3a3c2e46dbe2a0',
            name: endpoint.trim(),
            app: app.trim(),
        });
        let verify = data.telegram_token
        // Verificar la coincidendia del token
        if (req.query["hub.verify_token"] === verify) {
            // Mensaje de exito y envio del token requerido
            console.log("webhook verificado!");
            res.status(200).send(req.query["hub.challenge"]);
        } else {
            // Mensaje de fallo
            console.error("La verificacion ha fallado, porque los tokens no coinciden");
            res.sendStatus(403);
        }
    }catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: 'Internal error'
    });
}
});

// Todos eventos de mesenger sera apturados por esta ruta
router.post("/:app_id/:endpoint", async function (req, res) {
    // Verificar si el vento proviene del pagina asociada
    var endpoint = req.params.endpoint;
    var app = req.params.app_id
    var body = req.body;
    console.log(req.body)
    console.log("req",req.body.entry[0])
    console.log("req message",req.body.entry[0].messaging)
    try{
        let data = await modelEndpoint.findOne({
            origin_chatbot: '6058bb97dd3a3c2e46dbe2a0',
            name: endpoint.trim(),
            app: app.trim(),
        })

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Webhook path or method not found"
            });
        }

        console.log(data.origin_chatbot)
        var data_or = await modelorigin.findById(data.origin_chatbot)
        console.log(data_or)

        let chatlist = await modelChatList.findOne({
            endpoint_id: data._id,
            chat_id: body.entry[0].messaging[0].recipient.id,
            origin_chatbot: data_or._id
        });
        console.log("chatlist si o no", chatlist)
        if (!chatlist) {
            let chatlist_nuevo = new modelChatList({
                endpoint_id: data._id,
                chat_id: body.entry[0].messaging[0].recipient.id,
                sender: body.entry[0].messaging[0].sender.id,
                active_conv: false,
                dt_reg: moment().format(),
                origin_chatbot: data_or._id,
                app: app
            });
            console.log("cahtlist: ", chatlist_nuevo)
            //chatlist = await chatlist_nuevo.save();
        }
        chatlist.last_message = bodyentry[0].messaging[0].text;
        chatlist.last_time = moment().format();
        await chatlist.save();
        let isText = false;

        console.log("cahtlist: ", chatlist)


        /*if (body.message.text) {
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

        telegram.emit('chat_talk_one:' + chatlist._id, JSON.stringify(conversation));*/


        if (req.body.object == "page") {
            // Si existe multiples entradas entraas
            req.body.entry.forEach(function(entry) {
                // Iterara todos lo eventos capturados
                entry.messaging.forEach(function(event) {
                    if (event.message) {
                        process_event(event);
                    }
                });
            });
            res.sendStatus(200);
        }

        //res.sendStatus(200);

    }catch (err){
        console.log(err);
        return res.status(500).json({
        success: false,
        message: 'Internal error' })
    };


});


// Funcion donde se procesara el evento
function process_event(event){
    // Capturamos los datos del que genera el evento y el mensaje
    var senderID = event.sender.id;
    var message = event.message;

    // Si en el evento existe un mensaje de tipo texto
    if(message.text){
        // Crear un payload para un simple mensaje de texto
        var response = {
            "text": 'Enviaste este mensaje: ' + message.text
        }
    }

    // Enviamos el mensaje mediante SendAPI
    enviar_texto(senderID, response);
}


// Funcion donde el chat respondera usando SendAPI
function enviar_texto(senderID, response){
    // Construcicon del cuerpo del mensaje
    let request_body = {
        "recipient": {
            "id": senderID
        },
        "message": response
    }

    // Enviar el requisito HTTP a la plataforma de messenger
    axios({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('Mensaje enviado!')
        } else {
            console.error("No se puedo enviar el mensaje:" + err);
        }
    });
}

module.exports = router;