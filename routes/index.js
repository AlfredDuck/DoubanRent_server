
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


exports.search_keyword = function(req, res){
   console.log(req.body);
   res.send(req.body);
};

exports.search_condition = function(req, res){
   console.log(req.body);
   
   var condition = {};
   
   condition.city = req.body.city;
   condition.keys = {$all: [req.body.keyword]};

   if (req.body.room_size != ''){
      condition.room_size = req.body.room_size;
   }
   if (req.body.rent_way != ''){
      condition.rent_way = req.body.rent_way;
   }
   if (req.body.room_number != ''){
      condition.room_num = {$in: _num(req.body.room_number)};    //用于数组的or查询
   }
   
   console.log(condition);
   
   var option = {
      sort:[['uptime', -1]],
      limit: 10,
      skip: (req.body.page - 1)*10
   };
   
   var result = {
      err: 'no',
      content: {},
      empty: 'no'
   };
   
   addContent.find(condition, null, option, function(err, docs){
      if (err){
         console.log('err' + err);
         result.err = 'yes';
         res.send(result);
         return;
      }
      
      if (docs.length == 0){
         result.empty = 'yes';
      }
      else {
         var contentArray = [];
         for (var i=0; i<=docs.length-1; i++) {
            var tiezi = {
               _id: docs[i]._id,
               title: docs[i].title,
               uptime: docs[i].uptime,
               text: docs[i].text,
               url: docs[i].url,
               price: docs[i].price
            };
            contentArray.push(tiezi);
         }
         result.content = contentArray;
      }
      
      res.send(result);
   });
};


//对room_num的简易封装
function _num(num){
   var arr = new Array();
   if (num == '一室'){
      return arr = ['一居','一室','1居','1室'];
   }
   if (num == '两室'){
      return arr = ['二居','两居','2居','二室','两室','2室'];
   }
   if (num == '三室'){
      return arr = ['三居','三室','3居','3室'];
   }
   if (num == '四室'){
      return arr = ['四居','四室','4居','4室'];
   }
   if (num == '五室'){
      return arr = ['五居','五室','5居','5室'];
   }
}

