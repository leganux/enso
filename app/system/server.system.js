const express = require('express');
const app = express();
const fs = require('fs');
const env = require('../config/environment.config').environment;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var session = require('express-session');
var passport = require('./../auth/passport').passport;
const https = require('https');
const http = require('http');


var RedisStore = require('connect-redis')(session);

var Server_ = {};


/******
 *  Load ssl files
 *
 * */

var privateKey = {}
var certificate = {}
var ca = {}

if (env.active_ssl) {
    privateKey = fs.readFileSync(env.ssl_private_key, 'utf8');
    certificate = fs.readFileSync(env.ssl_cert, 'utf8');
    ca = fs.readFileSync(env.ssl_ca, 'utf8');
}

/******
 *  Load Body parser if need
 *  =>  most of times true
 * */

if (env.active_body_parser) {
    app.use(bodyParser.json(
        {
            limit: '100mb',
            type: 'application/json'
        }));
    app.use(bodyParser.urlencoded(
        {
            parameterLimit: 100000,
            limit: '100mb',
            extended: true
        }));
}

/******
 *  Sets view engine
 *  =>  you can choose the VE default is PUG
 * */
app.set("view engine", env.view_engine);

/******
 *  Sets cookie parser
 *
 * */
app.use(require('cookie-parser')());

/******
 * configure fileupload
 *
 * */


if (env.active_file_upload) {
    app.use(fileUpload(
        {
            limits:
                {
                    fileSize: env.max_fileupload_size * 1024 * 1024
                },
        }
    ));
}


/******
 * configure session mode
 *
 * */
if (env.session_server == 'redis') {
    app.use(session({
        store: new RedisStore({
            host: env.redis_host,
            port: env.redis_port,
            db: env.redis_no_db
        }),
        secret: env.cookie_secret,
        name: env.cookie_name,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: true},
        httpOnly: env.http_only
    }));
} else if (env.session_server == 'standalone') {
    app.use(session({
        secret: env.cookie_secret,
        name: env.cookie_name,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: true},
        httpOnly: env.http_only
    }))
}

/******
 *  initialize passpor for auth system
 *
 * */

app.use(passport.initialize());
app.use(passport.session());

/******
 *  active cors headers
 *
 * */

if (env.active_cors) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", env.cors_domain);
        res.header("Access-Control-Allow-Credentials", env.allow_credentials);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

/******
 *  creates server
 * */

if (env.active_ssl) {
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
    https.createServer(credentials, app)
        .listen(env.ssl_port, function () {
            console.log('Https Server started at ' + env.ssl_port + env.root_path + ' ')
        })

    Server_ = http.createServer(app)
        .listen(env.no_ssl_port, function () {
            console.log('Http server start at ' + env.no_ssl_port + env.root_path + '')
        })

} else {
    Server_ = http.createServer(app)
        .listen(env.no_ssl_port, function () {
            console.log('Http server start at ' + env.no_ssl_port + env.root_path + '')
        })
}


/******
 *  add express json functions
 *
 * */

app.use(express.json());


module.exports = {app, http_server: Server_};