
/**
 * Module dependencies.
 */

var express = require('express');
/*-----分离路由，方便管理和阅读-------------*/
var routes = require('./routes/index.js');
var _search = require('./routes/search_2.js');
var check_data = require('./routes/check_data.js');
var controller = require('./routes/controller.js');
var weixin = require('./routes/weixin.js');
var subscribe = require('./routes/subscribe.js');

/*其他核心模块*/
var http = require('http');
var path = require('path');
var ejs = require('ejs');

/*-------------提供会话支持（1）---------------*/
var SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
  url:"mongodb://<user>:<password>@emma.mongohq.com:10051/alfredmongodb/session",
  //本地数据库
  //url: "mongodb://localhost/session",
  interval: 120000
});

var app = express();

/*---用于提供处理微信的xml格式的post--*/
var utils = require('express/node_modules/connect/lib/utils'), xml2js = require('xml2js');
 
function xmlBodyParser(req, res, next) {
    if (req._body) return next();
    req.body = req.body || {};
    // ignore GET
    if ('GET' == req.method || 'HEAD' == req.method) return next();
    // check Content-Type
    if ('text/xml' != utils.mime(req)) return next(); 
    // flag as parsed
    req._body = true; 
    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ buf += chunk });
    req.on('end', function(){  
      var parseString = xml2js.parseString;
      parseString(buf, function(err, json) {
        if (err) {
            err.status = 400;
            next(err);
        } else {
            req.body = json;
            next();
        }
      });
    });
};
/*-------------*/

// all environments
app.set('port', process.env.PORT || 18080);
app.set('views', __dirname + '/views');
app.engine('.html',ejs.__express);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(express.bodyParser({uploadDir:'./temporary_store'}));
app.use(xmlBodyParser);   //用于处理微信的xml格式的post
app.use(express.methodOverride());
/*------------用于提供会话支持（2）----------------*/
app.use(express.cookieParser());
app.use(express.cookieSession({secret : 'fens.me'}));
app.use(express.session({
  secret : 'fens.me',
  store: store,
  cookie: { maxAge: 900000 }
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//事件处理程序调度(路由器)
app.get('/',                                        routes.index);
app.get('/local/:city',                             routes.city);
app.get('/today',                                   routes.today);
app.get('/search',                                  _search.toIndex);
app.get('/search/:city',                            _search.toIndex);
app.post('/search/:city',                           _search.searchEngine);
app.post('/search_condition',                       _search.searchCondition);
app.get('/alfredduck_database',                     check_data.database);
app.get('/alfredduck_ip',                           check_data.IP);
app.get('/alfredduck_keywords',                     check_data.keywords);
app.get('/alfredduck_tempkeywords',                 check_data.tempkeywords);
app.get('/alfredduck_tempkeywords_2',               check_data.tempkeywords_2);
app.get('/alfredduck_controller',                   controller.keywords);
app.post('/controller/del_keyword',                 controller.del_keyword);

//weixin API
app.get('/weixin', weixin.token);
app.post('/weixin', weixin.get_message);

//订阅
app.get('/subscribe', subscribe.subscribe);
app.post('/do_subscribe', subscribe.do_subscribe);
app.get('/un_subscribe', subscribe.un_subscribe);
app.post('/undo_subscribe', subscribe.undo_subscribe);


//端口监听
if (!module.parent){
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
}
module.exports = app;
/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
*/