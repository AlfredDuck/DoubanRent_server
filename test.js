/*解析xml的例程
var xml2js = require('xml2js');
var parseString = xml2js.parseString;

var xml = "<hello><root>Hello xml2js!</root><kk>bicht</kk></hello>"
parseString(xml, function (err, result) {
    console.log(result.hello.root);
    var obj = result;

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    console.log(xml);
});
*/

/*---发送邮件的例程---*/
/*
var nodemailer = require("nodemailer");
//这里是初始化，需要定义发送的协议，还有你的服务邮箱，当然包括密码了
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "yitianchou@gmail.com",
        pass: "eric13864427782"
    }
});
//邮件配置，发送一下 unicode 符合的内容试试！
var mailOptions = {
    from: "租房这件小事",       // 发送地址
    to: "cangbe@qq.com, zhaoyingzong@gmail.com",         // 接收列表
    subject: "Hello alfred",                             // 邮件主题
    text: "Hi alfredduck",                          // 文本内容
    html: "<h1>哈哈，第n次哦</h1>"                    // html内容
}
//开始发送邮件
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("邮件已经发送: " + response.message);
    }
    //如果还需要实用其他的 smtp 协议，可将当前回话关闭
    smtpTransport.close();
});
*/
/*---测试订阅数据库---*/
var addSubscribe = require('./models/subscribe.js');
var addIP = require('./models/ip.js');
test();
function test(){
  /*
  addSubscribe.remove({mail: 'cangbe'},function(err, num){
     console.log(num);
  });
  */
    addSubscribe.find(function(err, docs){
     var count = 0;
     for (var i=0; i<=docs.length-1; i++){
        console.log(docs[i].city);
        count = count + 1;
     }
     console.log(count);
  });
}

//ips();
function ips(){
   addIP.find(function(err, docs){
      for (var i=0; i<=docs.length-1; i++){
         var kk = docs[i].calltime.length;
         console.log(docs[i].ip + "---" + kk + i);
      }
   });
}

//console.log(todayDate());
//通用函数-获得今天日期
function todayDate(){    
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
