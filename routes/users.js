var express = require('express');
var router = express.Router();
var User = require('../models/User');
var crypto = require('crypto'); 
var async = require('async'); 
var nodemailer = require('nodemailer'); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({'message':'success'});
});

module.exports = router;
