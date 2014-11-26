
/*
控制后台，用于增删关键词
*/
var addTempKeywords     = require('./../models/temp_keywords.js');
var addKeywords         = require('./../models/keywords.js');

exports.keywords = function(req, res){
   var wordList = '';
   addKeywords.find(null, null, {sort:[['_id', -1]]}, function(err, docs){
      for (var i=0; i<=docs.length-1; i++) {
         wordList = wordList + 
                    '<p class="del_keyword" title="' + docs[i].keyword + '">' 
                    + docs[i].keyword + '-----' + docs[i].city + '</p></br>';
      }
      //console.log(wordList)
      res.render('controller', {
         show_keywords: wordList,
      });
   });
};

exports.del_keyword = function (req, res){
   var keyword = req.body.keyword;
   addKeywords.remove({keyword: keyword}, function(err, num){
      console.log('delete_keyword: ' + num);
      res.send(keyword);
   });
};

