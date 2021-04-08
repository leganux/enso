const express = require('express');
const router = express.Router();

var web = require("./socket").ensoSocket;


router.get('/:app_id/:endpoint', async (req, res) => {

    return res.status(403).json({
        success: false,
        message: 'FORBIDDEN -- Error 403 This service is only authorized for WEB chatbot credentials.'
    });

});
router.post('/:app_id/:endpoint', async (req, res) => {
    console.log("llego a peticion web")
    let {endpoint,chat_id,message} = req.body
    console.log(req.body)
    console.log(endpoint,chat_id)
    web.emit('enso_chatWeb:'+endpoint+":"+chat_id,message)
    //web.emit('test3',message)


});


module.exports = router;