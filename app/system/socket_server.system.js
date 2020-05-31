const http_server = require('./server.system').http_server;
const env = require('../config/environment.config').environment;

var io = {}


if (env.active_socket) {
    io = require('socket.io').listen(http_server,
        {
            path: env.root_path + env.socket_path
        })
}

module.exports = {io}