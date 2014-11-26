/*---发送邮件---*/
var nodemailer = require("nodemailer");
var addSubscribe = require('./../models/subscribe.js');
var addContent = require('./../models/content.js');

//这里是初始化，需要定义发送的协议，还有你的服务邮箱，当然包括密码了
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "yitianchou@gmail.com",
        pass: "eric13864427782"
    }
});

//发送邮件计时器
main();
function main(){   //使用setInterval做计时器以及循环,每隔10分钟调用一次，超过当前小时则停止
   //取邮件地址计数
   var option = {
      sort:[['date', 1]],
      limit: 1,
      skip: 0
   };
   getMails(option);
   console.log('【开始发送邮件】：' + option.skip);
   option.skip = option.skip + 1;
   var timer = setInterval(function(){
      getMails(option);
      console.log('【开始发送邮件】：' + option.skip);
      option.skip = option.skip + 1;
   }, 1000*5);
}
//获取订阅用户的邮箱列表
function getMails(option){
   addSubscribe.find({open: true}, null, option, function(err, docs){
   //只取未退订的用户，且一次只取一个
   if (docs.length >= 1){
      addContent.find({city: docs[0].city, keys: {$in: docs[0].local}, date: '2014-10-10'}, 
      function(err, docs_2){
      if(docs_2.length >= 1){
         var html = '<h1>' + docs[0].mail + '</h1>';
         for (var j=0; j<=docs_2.length-1; j++){
            console.log('content_title: ' + docs[0].city + ' ' + docs_2[j].title);
            html = html + 
            '<p style="font-weight: bold; color: rgb(51, 119, 170);"><a href="' + 
            docs_2[j].url + '" target="_blank">' + 
            docs_2[j].title + '</a></p>'+
            '<p>【发帖时间】： ' + docs_2[j].uptime + '</p>' +
            '<p>【帖子正文】： ' + docs_2[j].text + '</p></br>';
         }
         sendMails(docs[0].mail, html);
      }else{
         console.log('今天没有内容可发哦');
      }     
      });
   }else{
      console.log('没有邮件地址可发送了');
   }
   });
}


function sendMails(whom, html){
//邮件配置，发送一下 unicode 符合的内容试试！
var mailOptions = {
    from: "租房这件小事",        // 发送地址
    to: whom,                   // 接收列表
    subject: "豆瓣租房汇总，来自租房这件小事",                             // 邮件主题
    text: "豆瓣租房汇总，来自租房这件小事",                          // 文本内容
    html: html                    // html内容
}
//开始发送邮件
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("邮件已经发送: " + response.message);
    }
    //如果还需要实用其他的 smtp 协议，可将当前回话关闭
    //smtpTransport.close();
});
}


/*--------------------我是华丽的分割线---------------------------*/

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








