var express = require('express.io');
var app = express().http().io();
var port = 3700;
var host = 'localhost';
var App = require('./modules/App.js').App;

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.use(express.cookieParser());
app.use(express.session({
    secret: '1234567890'
}));

var index = require('./routes/index');

app.get('/', index);

app.get('/ver-0.0.1', function(reg, res) {
    res.render('ver001/layout');
});

app.get('/ver-0.0.2', function(reg, res) {
    res.render('ver002/layout');
});

app.use(express.static(__dirname + '/public'));

App.io = app.io;
app.io.route('selectTeam', function(req) {
    App.selectTeam(req);
});

app.io.route('getStep', function(req) {
    App.makeStep(req);
});

app.io.route('updateMatrix', function(req) {
    app.io.room(req.session.room).broadcast('matrix', req.data);
});

app.listen(port, host);
console.log('listening port ' + port);