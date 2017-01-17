var express = require('express');
var router = express.Router();

var User = require('../schemas/user');
var Challenge = require('../schemas/challenge');
var Organization = require('../schemas/organization');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
