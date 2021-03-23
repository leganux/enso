const env = require('./config/environment.config').environment;
const server = require('./system/server.system');
const app = server.app;
const https = require('https')
const http = require('http')

const auth = require('./auth/routing').router;

const io_ = require('./system/socket_server.system').io;
require('./system/logs/log_controller');

const api_routes = require('./routes/_api.routes')
const app_routes = require('./routes/_app.routes')
const view_engine = require('./views/view_engine')
const express = require('express');
const path = require('path');
let io = {};
if (env.active_socket) {
    io = io_

}

module.exports = {
    io: io
};

app.use(env.root_path + 'auth', auth);
app.use(env.root_path + 'api', api_routes);
app.use(env.root_path + 'app/api', app_routes);
app.use(env.root_path, view_engine);
app.use(env.root_path + 'content/', express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "views"));
app.locals.pretty = true;

const mongoose = require('./system/db/db_core_conection')
app.get(env.root_path + 'logout', function (req, res) {
    let options = {
        maxAge: 1000 * 60 * 60 * 24 * 10, // would expire after 15 minutes
        httpOnly: false, // The cookie only accessible by the web server
        signed: false // Indicates if the cookie should be signed
    }


    res.cookie('_APP_', false, options)

    req.session.destroy();
    req.logout();
    req.user = false;
    res.redirect(env.root_path);
});


//require("./routes/webhook/socket")
//app.use(env.root_path + 'api', require("./routes/webhook/telegram.routes"));
app.use(function (req, res) {
    res.status('404').json(
        {
            success: false,
            message: '404 not found'
        }
    );
});



