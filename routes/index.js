
/*
首页
 */
var addContent          = require('./../models/content.js');
var addIP               = require('./../models/ip.js');
var addIP_city          = require('./../models/ip_city.js');
var addTempKeywords     = require('./../models/temp_keywords.js');
var addKeywords         = require('./../models/keywords.js');


exports.index = function(req, res){
   res.render('index', {
     content: '【接口调试：豆瓣租房】'
   });
};


exports.search = function(req, res){
   console.log();
};