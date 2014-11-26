
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
   
   if (req.body.city == 'beijing'){
      condition.city = '北京';   
   }
   else if (req.body.city == 'shanghai'){
      condition.city = '上海';   
   }
   else if (req.body.city == 'guangzhou'){
      condition.city = '广州';   
   }
   
   condition.keys = {$all: [req.body.searchWord]};

   if (req.body.room_size != ''){
      condition.room_size = req.body.room_size;
   }
   if (req.body.room_rent_way != ''){
      condition.rent_way = req.body.room_rent_way;
   }
   if (req.body.room_num != ''){
      condition.room_num = {$in: _num(req.body.room_num)};    //用于数组的or查询
   }
   
   console.log(condition);
   
   var option = {
      sort:[['uptime', -1]],
      limit: req.body.limit,
      skip: req.body.skip
   };
   
   addContent.find(condition, null, option, function(err, docs){
      console.log('查询结果:' + docs.length);
      var result = '';
      if (docs.length == 0){
         result = result + '<h2 id="getnothing">没有您要查询的内容 (〓￣(∵エ∵)￣〓) </h2>';
      }
      else {
         for (var i=0; i<=docs.length-1; i++) {
            result = result + '<div class="tiezi">';
            if ( docs[i].price.length != 0 ){
               result = result + 
               '<p id="price">★' + docs[i].price + '★</p>'
            }
            result = result +
            '<p class="tiezi_title">' + docs[i].title + '</p>'+
            '<p>【发帖时间】： ' + docs[i].uptime + '</p>' +
            '<p>【帖子正文】： ' + docs[i].text + '</p>' +
            '<p>【帖子链接】： <a href="' + docs[i].url + '" target="_blank">' + docs[i].url + 
            '</a></p></div>';
         }
      }
      
      res.send(result);
   });

};