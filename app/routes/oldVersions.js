var express = require('express');
var router = express.Router();

router.get('/ver-0.0.1', function(req, res, next) {
    res.render('ver001/layout');
});

router.get('//ver-0.0.2', function(req, res, next) {
    res.render('ver002/layout');
});

module.exports = router;