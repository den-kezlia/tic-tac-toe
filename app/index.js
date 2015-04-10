var express = require('express');
var app = express();
var port = 3700;

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/', function(reg, res) {
    res.render('layout');
});

app.get('/ver-0.0.1', function(reg, res) {
    res.render('ver001/layout');
});

app.get('/ver-0.0.2', function(reg, res) {
    res.render('ver002/layout');
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function(socket) {
    socket.emit('message', {message: 'welcome to the chat'});
    socket.on('send', function(data) {
        io.sockets.emit('message', data);
    });
});

console.log('listening port ' + port);