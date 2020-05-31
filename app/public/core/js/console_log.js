var socket = io.connect('/console', {
    reconnection: true,
    reconnectionDelay: 10000,
    reconnectionDelayMax: 50000,
    reconnectionAttempts: Infinity,
    path: general_socket_path
});

socket.on('connect', function () {
    console.log('conectado')
});
socket.on('consola:log', function (msg) {
    $('#sp4console_').append(msg)
});

$('#btn_clear').click(function () {
    $('#sp4console_').html('');
})