/*
查看数据
 */
var addContent          = require('./../models/content.js');
var addIP               = require('./../models/ip.js');
var addIP_city          = require('./../models/ip_city.js');
var addKeywords         = require('./../models/keywords.js');
var addTempKeywords     = require('./../models/temp_keywords.js');


exports.database = function (req, res){
   addContent.find({city: '上海'}, function(err, docs_1){
      addContent.find({city: '广州'}, function(err, docs_2){
         res.send('【目前数据库容量】： 上海：' + docs_1.length + '; 广州：' + docs_2.length);
      });
   });
};


exports.IP = function (req, res){
   addIP.find(function(err, docs_1){
      var ips = 0;
      for (var i=0; i<=docs_1.length-1; i++) {
         ips = ips + docs_1[i].calltime.length;
      }
      addIP_city.find({city: 'shanghai'}, function(err, docs_2){
         addIP_city.find({city: 'guangzhou'}, function(err, docs_3){
            res.send('[IP num]: ' + docs_1.length + 
                     '; [index calltime]: '    + ips + 
                     '; [IP shanghai]: '       + docs_2.length + 
                     '; [IP guangzhou]: '      + docs_3.length
                     );
         });
      });
      
   });
};


exports.keywords = function (req, res){
   addKeywords.find(null, null, {sort:[['_id', -1]]},function(err, docs){
     /*
      var wee = '';
      for (var i=0; i<=docs.length-1; i++) {
         wee = wee + docs[i].keyword + ' ';
      }
      */
      res.send(docs);
   });
};

//查看临时关键词
exports.tempkeywords = function(req, res){
   addTempKeywords.find(null, null, {sort:[['_id', -1]]}, function(err, docs){
      res.send(docs);
   });
};

//查看被录入的临时关键词
exports.tempkeywords_2 = function(req, res){
   addTempKeywords.find({repeat: 2}, null, {sort:[['_id', -1]]}, function(err, docs){
      res.send(docs);
   });
};







