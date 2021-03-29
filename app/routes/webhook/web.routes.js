const express = require('express');
const router = express.Router();


router.get('/:app_id/:endpoint', async (req, res) => {

    return res.status(403).json({
        success: false,
        message: 'FORBIDDEN -- Error 403 This service is only authorized for WEB chatbot credentials.'
    });

});
router.post('/:app_id/:endpoint', async (req, res) => {

    return res.status(403).json({
        success: false,
        message: 'FORBIDDEN -- Error 403 This service is only authorized for WEB chatbot credentials.'
    });

});


module.exports = router;