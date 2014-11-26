/*
微信请求处理程序
*/
var xml2js = require('xml2js');
var addContent          = require('./../models/content.js');
var addTempKeywords     = require('./../models/temp_keywords.js');
var addKeywords         = require('./../models/keywords.js');

//微信的token验证
exports.token = function(req, res){
   console.log(req.query.echostr);
   res.send(req.query.echostr);
};

//微信的自动回复
exports.get_message = function(req, res){
   //已在server里解析微信的xml为json，但注意最终为key:[value]结构，即value是个数组哦
   var city = '广州';
   var local = '白云';
   var url = 'http://zhaofangzi.duapp.com/weixin/search?city=' + city + '&local=' + local;
   var saysth = '戳这里开始搜索广州的房源吧\nhttp://zhaofangzi.duapp.com/local/guangzhou\n只需回复任意字符，就可以找到我哦 ：)'
   var first = '欢迎关注豆瓣租房搜索，戳这里开始搜索广州的房源吧\nhttp://zhaofangzi.duapp.com/local/guangzhou\n只需回复任意字符，就可以找到我哦 ：)';
   if (req.body.xml.MsgType[0] == 'event'){
      if (req.body.xml.Event[0] == 'subscribe'){
        saysth = first;
      }
   }
   
   //微信回复
   var obj = {
      xml:{
        ToUserName: req.body.xml.FromUserName,
        FromUserName: req.body.xml.ToUserName,
        CreateTime: req.body.xml.CreateTime,
        MsgType: 'text',
        Content: saysth
      }
   };
   
   var builder = new xml2js.Builder();
   var xml = builder.buildObject(obj);
   console.log('[return the xml:]' + xml);
   res.send(xml);
};
