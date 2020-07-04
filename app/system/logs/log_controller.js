const path = require('path');
const fs = require('fs')
const io = require('../socket_server.system').io;
const morgan = require('morgan');
const moment = require('moment');
const server = require('../server.system');
const app = server.app;
const env = require('../../config/environment.config').environment;

var dir = path.join(__dirname, '/logs');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}


const _privateLog = console.log;
const _privateError = console.error;
const _privateInfo = console.info;
const _privateWarn = console.warn;
const _privateDebug = console.debug;


console.log = function (message) {
    sendToWebConsole('table-success', message, arguments);
    _privateLog.apply(console, arguments);
    let streamLogFile = fs.createWriteStream(path.join(__dirname, '/logs/' + env.log_name), {flags: 'a'});
    streamLogFile.end(JSON.stringify(arguments) + '\r\n')
};
console.error = function (message) {
    sendToWebConsole('table-danger', message, arguments);
    _privateError.apply(console, arguments);
    let streamLogFile = fs.createWriteStream(path.join(__dirname, '/logs/' + env.log_name), {flags: 'a'});
    streamLogFile.end(JSON.stringify(arguments) + '\r\n')
};
console.info = function (message) {
    sendToWebConsole('table-primary', message, arguments);
    _privateInfo.apply(console, arguments);
    let streamLogFile = fs.createWriteStream(path.join(__dirname, '/logs/' + env.log_name), {flags: 'a'});
    streamLogFile.end(JSON.stringify(arguments) + '\r\n')
};
console.warn = function (message) {
    sendToWebConsole('table-warning', message, arguments);
    _privateWarn.apply(console, arguments);
    let streamLogFile = fs.createWriteStream(path.join(__dirname, '/logs/' + env.log_name), {flags: 'a'});
    streamLogFile.end(JSON.stringify(arguments) + '\r\n')
};
console.debug = function (message) {
    sendToWebConsole('table-dark', message, arguments);
    _privateDebug.apply(console, arguments);
    let streamLogFile = fs.createWriteStream(path.join(__dirname, '/logs/' + env.log_name), {flags: 'a'});
    streamLogFile.end(JSON.stringify(arguments) + '\r\n')
};

var consoleOnScreen = io.of('/console').on('connection', function (socket) {
    sendToWebConsole('table-default', '', '<h4>******** Connection established ******</h4>')
});

function sendToWebConsole(classe, message, data) {
    if (env.active_socket) {
        if (typeof data === "object") {
            let cad = '';
            for (var i in data) {
                var attrName = i;
                var attrValue = data[i];
                if (typeof attrValue === 'object') {
                    cad = cad + '  ' + JSON.stringify(attrValue)
                }
                cad = cad + ' &nbsp;&nbsp;&nbsp;&nbsp; ' + attrValue
            }
            consoleOnScreen.emit('consola:log', `<tr style="width: 100%"  class="${classe}"> <th class="">${cad}</th></tr>`);
        } else {
            consoleOnScreen.emit('consola:log', `<tr style="width: 100%"  class="${classe}"> <th class="">${data}</th></tr>`);
        }
    }
}

app.use(morgan(function (tokens, req, res) {


    let cadenamorgan = [
        moment().format('YYYY-MM-DD hh:mm:ss'),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        //tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join('  ');

    let METHOD = '';
    let PARAMS = JSON.stringify(req.params);
    let QUERY = '';
    let BODY = '';
    let HEADERS = JSON.stringify(req.headers);


    switch (tokens.method(req, res)) {
        case 'GET':
            METHOD = '<h4 class="text-info">GET</h4>';
            QUERY = JSON.stringify(req.query);
            break;
        case 'POST':
            METHOD = '<h4 class="text-primary">POST</h4>';
            BODY = JSON.stringify(req.body);
            break;

        case 'DELETE':
            METHOD = '<h4 class="text-danger">DELETE</h4>';

            break;

        case 'PUT':
            METHOD = '<h4 class="text-warning">PUT</h4>';
            BODY = JSON.stringify(req.body);
            break;

    }

    let cadenamorganWEB = '';
    let myurl = tokens.url(req, res).toLowerCase();
    if (myurl.includes('.css')
        || myurl.includes('.js')
        || myurl.includes('.jpg')
        || myurl.includes('.jpeg')
        || myurl.includes('.png')
        || myurl.includes('.ico')
        || myurl.includes('.pdf')
        || myurl.includes('.woff')
        || myurl.includes('.woff2')
        || myurl.includes('.tiff')
        || myurl.includes('.gif')
        || myurl.includes('.mp4')
        || myurl.includes('.mp3')
        || myurl.includes('.webm')
        || myurl.includes('.io')
        || myurl.includes('.map')
        || myurl.includes('.ttf')
        || myurl.includes('.doc')
        || myurl.includes('.docx')
        || myurl.includes('.xls')
        || myurl.includes('.xlsx')
        || myurl.includes('.json')
        || myurl.includes('.ppt')
        || myurl.includes('.pptx')
        || myurl.includes('.mov')
        || myurl.includes('.flv')
        || myurl.includes('.m3u')
        || myurl.includes('.eot')
        || myurl.includes('.svg')
        || myurl.includes('.htm')
        || myurl.includes('.html')

    ) {
        cadenamorganWEB = [
            moment().format('YYYY-MM-DD hh:mm:ss'),
            METHOD,
            tokens.url(req, res),
            tokens.status(req, res),
            tokens['response-time'](req, res), 'ms',
        ].join('  ')

    } else {
        cadenamorganWEB = [
            moment().format('YYYY-MM-DD hh:mm:ss'),
            METHOD,
            tokens.url(req, res),
            tokens.status(req, res),
            tokens['response-time'](req, res), 'ms',
            '<br> <h5> HEADERS</h5> ' + HEADERS,
            '<br> <h5> PARAMS</h5> ' + PARAMS,
            '<br> <h5> QUERY</h5> ' + QUERY,
            '<br> <h5> BODY</h5> ' + BODY,
        ].join('  ')
    }


    sendToWebConsole('table-ligth', 'morgan', cadenamorganWEB)


    let streamLogFile = fs.createWriteStream(path.join(__dirname, '/logs/' + env.log_name), {flags: 'a'});
    streamLogFile.end(cadenamorgan + '\r\n');

    return cadenamorgan;
}));


module.exports = {
    console_on_screen: consoleOnScreen,
    send_to_web_console: sendToWebConsole
}