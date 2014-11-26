/*退订的前端逻辑*/

$(document).ready(function(){
   //初始化
   var sub_content = {};
   sub_content.user_mail = '';
     
   //点击“订阅”
   $('button').bind('click', function(){
      //给sub_content赋值
      //取得用户邮箱
      sub_content.user_mail = $('.need_mail input').val();

      if (sub_content.user_mail == ''){
         alert('需要填写邮箱');
      }
      else{
         postSubscribe(sub_content);
      }
   });
});


//发送post
function postSubscribe(sub_content){
   $.post('/undo_subscribe', sub_content, function(data){
      alert(data);
      window.location.href="/subscribe";
   });
}








