
/*
首页
 */
var addContent          = require('./../models/content.js');
var addIP               = require('./../models/ip.js');
var addIP_city          = require('./../models/ip_city.js');
var addTempKeywords     = require('./../models/temp_keywords.js');
var addKeywords         = require('./../models/keywords.js');


exports.index = function(req, res){
   console.log('城市： ' + req.params.city);
   //获取并记录ip
   var ip = getClientIp(req);
   if (ip){
      storeIP(ip);
   }
     res.render('index', {
        content: 'hello crawler',
     });

};

exports.city = function(req, res){
   console.log('城市： ' + req.params.city);
   //获取并记录访问某个城市的ip
   var ip = getClientIp(req);
   if (ip){
     storeIP_city(ip, req.params.city);
   }
   
   res.render('index_city', {
      local_city: req.params.city
   });
};

exports.today = function (req, res){
   //console.log(req.ip);
   var option = {
      sort:[['uptime', -1]],
      limit: 50
   };
   addContent.find({date: todayDate()}, null, option, function(err, docs){  //时间倒序排列，筛选出当天的
     var dics = '<p>最新更新于 ' + docs[0].uptime + '  共 ' + docs.length + ' 条</p></br>';
     for (var i=0; i<=docs.length-1; i++){
             dics = dics + 
            '</br><p style="font-weight:bold;">★★★' + docs[i].title + '★★★</p></br>'+
            '<p>【发帖时间】： ' + docs[i].uptime + '</p>' +
            '<p>【帖子正文】： ' + docs[i].text + '</p>' +
            '<p>【帖子链接】： <a href="' + docs[i].url + '" target="_blank">' + docs[i].url + 
            '</a></p></br>';
     }
     res.render('data', {
        content: dics,
     });
  });
};


function todayDate(){    //获得今天日期
   var today = new Date();
   var year = today.getFullYear();
   var month, date;
   
   if ((today.getMonth()+1) <= 9){
      month = '0' + (today.getMonth() + 1);  
   }else{
      month = today.getMonth() + 1;
   }
   if (today.getDate() <= 9){
      date = '0' + today.getDate();  
   }else{
      date = today.getDate();
   }
      
   today = year + '-' + month + '-' + date;
   return today;
}



function storeIP(ip){    //储存IP地址，为了知道独立访客有多少，日活有多少等等
   addIP.findOne({ip: ip}, function(err, doc){
      if (doc){  //如果有此ip，则记录此次访问时间
         var calltime = doc.calltime;
         calltime.push(new Date());
         addIP.update({ip: ip}, {calltime: calltime}, {safe: true,multi: true}, function(err, num){
            console.log('老用户又来了：' + calltime.length);
         });
      }
      else {   //如果无此ip，则新建文档储存此ip
         var thetime = new Array();
         thetime[0] = new Date();
         var newIP = new addIP({
            ip: ip,
            calltime: thetime
         });
         newIP.save(function(err, doc, num){
            console.log('又一个独立访客：'+ ip + '; ' + thetime);
         });
      }
   });
}

function storeIP_city(ip, localCity){    //储存访问某个城市的ip
   addIP_city.findOne({ip: ip, city: localCity}, function(err, doc){
      if (doc){  //如果有此ip，则记录此次访问时间
         var calltime = doc.calltime;
         calltime.push(new Date());
         addIP_city.update(
         {ip: ip}, 
         {calltime: calltime}, 
         {safe: true,multi: true}, 
         function(err, num){
            console.log('老用户又来了：' + calltime.length);
         });
      }
      else {   //如果无此ip，则新建文档储存此ip
         var thetime = new Array();
         thetime[0] = new Date();
         var newIP = new addIP_city({
            ip: ip,
            calltime: thetime,
            city: localCity
         });
         newIP.save(function(err, doc, num){
            console.log('又一个独立访客：'+ ip + '; ' + thetime);
         });
      }
   });
}

function getClientIp(req) {   //获取客户端IP的方法；
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for'); 
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};











