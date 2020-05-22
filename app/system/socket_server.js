const http_server = require('./server').http_server;
const env = require('./../config/environment').environment;

var io = {}

console.log('******', env.active_socket);
if (env.active_socket) {
    io = require('socket.io').listen(http_server,
        {
            path: env.root_path + env.socket_path
        })
}

module.exports = {io}