const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const mails = require('../models/mails.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const {fork} = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;
const nodemailer = require("nodemailer");

api_crud.all(router, mails, access_middleware, false, 'name');

//SMTP transporter
router.post('/:_app_id_/send_mail',async(req,res)=>{
  let {body,params} = req;
  let {contacts,subject,html} = body;
  console.log(contacts,subject,html);
  console.log(body,params);
  res.send('recived');
  var mails = contacts.toString();
  
  
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'evans9@ethereal.email', // generated ethereal user prube
      pass: '9jqw7MNG7jxDnxBfvJ' // generated ethereal password prube
    },
    tls: {
      rejectUnauthorized: false
    },
  });    

    var info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      bcc: "'" + mails + "'", // list of receivers
      subject: body.subject, // Subject line
      text: "Hello world?", // plain text body
      html: html, // html body
     
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou... */
       
      
});  




module.exports = router;
