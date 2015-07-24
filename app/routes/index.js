var express = require('express');
var router = express.Router();
var App = require('./../modules/App.js').App;

router.get('/', function(req, res, next) {
    var session = req.session;
    var playerStatus = App.getPlayerStatus(session);

    switch (playerStatus) {
        case 'onSelectTeam':
            res.render('pages/selectTeam');
            break;
        case 'onWaiting':
            res.render('pages/waiting');
            break;
        case 'onGame':
            res.render('pages/game');
            break;
    }
});

module.exports = router;