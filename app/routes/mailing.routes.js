const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const mails = require('../models/mails.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;
const nodemailer = require("nodemailer");

api_crud.all(router, mails, access_middleware, false, 'name');

//SMTP transporter
router.post('/:_app_id_/send_mail', async (req, res) => {
  let { body, params } = req;
  let { contacts, subject, html } = body;
  //console.log(contacts,subject,html);
  console.log(params);

  var mails = contacts.toString();
  let id = params._app_id_
  console.log(id)
  var appInfo = await app.findById(id)

  console.log(appInfo.name)
  console.log(appInfo.mail_host)


  try {
    var transporter = nodemailer.createTransport({
      host: appInfo.mail_host,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: appInfo.mail_user,
        pass: appInfo.mail_pass,
      },
      tls: {
        rejectUnauthorized: false
      },
    });

    var info = await transporter.sendMail({
      from: appInfo.mail_from,//'"Fred Foo 👻" <foo@example.com>' sender address
      bcc: mails, // list of receivers
      subject: body.subject, // Subject line
      //text: "Hello world?", // plain text body
      html: html, // html body

    });

    let ret = response_codes.code_200;
    ret.data = info;
    res.status(200).json(ret);
    return 0;



  } catch (e) {
    console.error(e)
    res.status(500).json(response_codes.code_500);
    return 0;
  }






});




module.exports = router;
