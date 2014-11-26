/*
搜索  正式版
*/
var addContent          = require('./../models/content.js');
var addTempKeywords     = require('./../models/temp_keywords.js');
var addKeywords         = require('./../models/keywords.js');


exports.toIndex = function(req, res){
   res.redirect('/');
};

exports.searchEngine = function(req, res){
   var keyword = req.body.keyword;
   var localCity = '';
   if (req.params.city == 'beijing'){
      localCity = '北京';   
   }
   else if (req.params.city == 'shanghai'){
      localCity = '上海';   
   }
   else if (req.params.city == 'guangzhou'){
      localCity = '广州';   
   }
   console.log('【搜索关键词】： ' + req.body.keyword);
   console.log('【查询的城市】： ' + localCity);
   
   //在数组中检索，按照时间倒序排列
   var option = {
      sort:[['uptime', -1]],
      limit: 10
   };
   addContent.find(
      {city: localCity, keys: {$all: [keyword]}},
      null, 
      option, 
      function(err, docs){
      var result = '';
      if (docs.length == 0) {
         console.log('没搜索到');
         result = result + 
         '<p id="getnothing">暂时还没有人在此处发布房源</p>';
         
         addTempKeywords.findOne({city: localCity, keyword: req.body.keyword},function(err, doc){
            if (err) { console.log('err: ' + err); }
            if (!doc) {    //如果不在临时关键词库，则新建一个
               var newTemp = new addTempKeywords({
                  repeat: 1,               //记录此关键词被使用的次数
                  keyword: req.body.keyword,
                  city: localCity
               });
               newTemp.save(function(err, doc, num){
                  console.log('【添加临时关键词个数】：' + num);
               });
            }
            else {       //如果在临时关键词库，则将其从临时库移动到正式库（如果正式库不存在的话）
      
            addKeywords.findOne({city: localCity, keyword: req.body.keyword}, function(err, doc1){
               if (err) {console.log('err: ' + err);}
               if (!doc1){
                  var rekey = new Array();
                  rekey[0] = req.body.keyword;
                  var newKeyword = new addKeywords({
                     relative_keywords: rekey,
                     keyword: req.body.keyword,
                     city: localCity
                  });
                  newKeyword.save(function(err, doc2, num){
                     console.log('【新录入正式关键词】： ' + doc2.keyword);
                     addTempKeywords.update(
                        {keyword: req.body.keyword}, 
                        {repeat: 2},
                        {safe: true,multi: true}, 
                        function(err, num){
                           console.log('【提升临时关键词个数】： ' + num);
                     });
                  });
               } else {
                  console.log('【正式库已有关键词】： ' + req.body.keyword);
               } 
            });
            
            }
         });
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
            '</a></p>'+
            '</div>';
         }
      }
      //console.log(docs.length);
      res.render('search', {
         result: result,
         search_word: req.body.keyword,
         local_city: req.params.city
      });
   });
   
};



//按条件查询
exports.searchCondition = function(req, res){
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







