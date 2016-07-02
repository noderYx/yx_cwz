/* 
  基于 Express 的 http 服务器设置
  Express 4.x api文档: http://expressjs.com/4x/api.html
*/

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var ut = require('./radio8.common.js');
var logger = require("./radio8.logger.js").logger('express');
var appCfg = require('../app.config.js');
var path = require('path');
var cookieParser = require('cookie-parser');
var app = express();

console.log(typeof app);
// 设置ejs模板引擎： 当执行 res.render('hello') 时，对应由 ejs 动态展示 /views/hello.ejs 模板文件
// app.engine('html', require('ejs').renderFile);
app.set('views', appCfg.dir_root + '/views');
app.set('view engine', 'ejs');

// 以下是express 的各种中间件配置，注意各中间件的顺序

// 处理res路径下的http请求时，所有文件作为静态文件返回
app.use(appCfg.url_root + '/res', express.static(path.join(__dirname, '../res')));
// body parser -- for parsing application/json
app.use(bodyParser.json());
// body parser -- for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// body parser -- for parsing multipart/form-data
app.use(multer());
// cookie parser
app.use(cookieParser());


// 动态页面和服务的响应路由
var router = require('./express.router.js');
app.use(appCfg.url_root, router);

// 最后的请求处理函数：所有未被处理的请求在这里回复
app.use(function (req, res) {
  // req.get('Host') 会将指定的端口号也带上， req.host不带端口号
  // req.full_url = req.protocol + '://' + req.get('Host') + req.url;

  req.errorMsg = '您请求的页面不存在，是不是地址写错了？';

  res.status(404).render('page-error', req);
});

module.exports = app;
