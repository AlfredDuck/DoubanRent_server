/*
订阅subscribe
*/
var addSubscribe = require('./../models/subscribe.js');

exports.subscribe = function(req, res){
   res.render('subscribe');
};

exports.un_subscribe = function(req, res){
   res.render('un_subscribe');
};

exports.undo_subscribe = function(req, res){
   console.log(req.body);
   addSubscribe.update(
     {mail: req.body.user_mail},
     {open: false},
     function(err, num){
        res.send('退订成功');
        console.log('un_subscribe successfully');
   });
}

exports.do_subscribe = function(req, res){
   console.log(req.body);
   addSubscribe.findOne({mail: req.body.user_mail}, function(err, doc){
      if (err){console.log('err: ' + err);}
      if (doc){
         //修改已有用户的订阅信息
         updateSub(req, res);
      }
      else{
         //创建新的订阅用户
         createNewSub(req, res);
      }
   });
   //res.send('subscribe successfully');
};

/*--创建新的订阅用户--*/
function createNewSub(req, res){
   var newSub = new addSubscribe({
     mail: req.body.user_mail,              //用户邮箱
     city: req.body.city,
     local: req.body.local,               //关键词数组
     open: true,             //是否退订
     room_num: req.body.room_num,           //房间数量数组（一居）
     room_size: req.body.room_size,          //房间大小（主卧，整租，次卧）
     rent_way: req.body.room_rent_way,           //租赁方式（求租，合租）
     date: new Date()               //第一次订阅的时间
   });
   newSub.save(function(err, doc, num){
      res.send('订阅成功');
      console.log('add one subscribe');
   });
}

/*--修改已有用户的订阅信息--*/
function updateSub(req, res){
   var up_content = {
     city: req.body.city,
     local: req.body.local,               //关键词数组
     room_num: req.body.room_num,           //房间数量数组（一居）
     room_size: req.body.room_size,          //房间大小（主卧，整租，次卧）
     rent_way: req.body.room_rent_way,           //租赁方式（求租，合租）
     open: true             //是否退订
   };
   addSubscribe.update(
     {mail: req.body.user_mail},
     up_content,
     function(err, num){
        res.send('您已成功修改订阅设置');
        console.log('update successfully');
   });
}