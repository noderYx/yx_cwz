/* 
  全局的工具函数库
  包含以下函数：
    -- url字符串处理函数：获取请求参数，删除请求参数；
    -- 当前页面的微信分享地址生成；
    -- 当前时间的格式化字符串；
    -- 生成随机整数
    -- http getJSON / http postJSON
*/

var http = require("http");
var urltool = require('url');
var logger = require("./radio8.logger.js").logger('radio8.common');

var Ut = {
  /*
  从当前页面url中解析请求参数

  示例： var radioid = Ut.QueryString("radioid");
  */
  queryString: function (key) {/////////?????????????
    return (document.location.search.match(new RegExp("(?:^\\?|&)" + key + "=(.*?)(?=&|$)")) || ['', null])[1];
  },

  /*
  删除url中包含的某个请求参数
  示例： var href = Ut.deleteParam(href, 'openid');
  */
  deleteParam: function (url, name) {
    var i = url;
    var reg = new RegExp("([&\?]?)" + name + "=[^&]+(&?)", "g")

    var newUrl = i.replace(reg, function (a, b, c) {
      if (c.length == 0) {
        return '';
      } else {
        return b;
      }
    });
    return newUrl;
  },

  /*
  从当前页面url地址中去除openid，comopenid参数，生成用于微信分享的地址
  示例： var share_url = Ut.genShareUrl();
  */
  genShareUrl: function () {
    var href = document.location.href;

    href = Ut.deleteParam(href, 'openid');
    href = Ut.deleteParam(href, 'comopenid');

    return href;
  }, //?????????????????

  /*
  生成格式化的当前时间: yyyy-MM-dd HH:mm:ss
  示例： var str = Ut.now();
  */
  now: function () {

    // 将数字格式化为两位长度的字符串
    var fmtTwo = function (number) {
      return (number < 10 ? '0' : '') + number;
    }

    var date = new Date();

    var yyyy = date.getFullYear();
    var MM = fmtTwo(date.getMonth() + 1);
    var dd = fmtTwo(date.getDate());

    var HH = fmtTwo(date.getHours());
    var mm = fmtTwo(date.getMinutes());
    var ss = fmtTwo(date.getSeconds());

    return '' + yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;
  },
  //获取时间格式为:yyyyMMddhhmmss
  formatterDateTime: function () {
    var date = new Date();
    var dateTime = date.getFullYear()
           + ""// "年"
           + ((date.getMonth() + 1) < 10 ?  "0"+ (date.getMonth() + 1):(date.getMonth() + 1))
           + ""// "月"
           + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
           + ""
           + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours())
           + ""
           + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
           + ""
           + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    return dateTime;
  },
  // 生成格式化的当天日期： yyyyMMdd
  today: function () {
    // 将数字格式化为两位长度的字符串
    var fmtTwo = function (number) {
      return (number < 10 ? '0' : '') + number;
    }

    var date = new Date();

    var yyyy = date.getFullYear();
    var MM = fmtTwo(date.getMonth() + 1);
    var dd = fmtTwo(date.getDate());

    return yyyy + MM + dd;
  },

  /*
  生成一个 1 ~ K 的随机数
  示例： var num = Ut.random(100);
  */
  random: function (K) {
    return Math.ceil(Math.random() * K);
  },

  /*
  从某个url地址获取json数据
  */
  getJSON: function (url, next) {
    http.get(url, function (res) {
      var data = '';

      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        var obj = JSON.parse(data);
        console.log(data);
        console.log(obj);
        next(null, obj);
      });
    }).on('error', function (err) {
      logger.error("http get error: " + err.message + ", url = " + url);
      next(err, null);
    });
  },

  /*
  向某个url地址post发送json数据
  */
  postJSON: function (url, json, next) {//??????
    var postData = JSON.stringify(json);

    var url_info = urltool.parse(url);

    var options = {
      hostname: url_info.host,
      port: 80,
      path: url_info.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    var req = http.request(options, function (res) {
      var data = '';

      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        var obj = JSON.parse(data);

        next(null, obj);
      })
    });

    req.on('error', function (err) {
      logger.error("post json error: " + err.message + ", url = " + url);
      next(err, null);
    });

    // write data to request body
    req.write(postData);
    req.end();
  },
  postJSONforTraffic: function (url, postData, onResult) {
    var url_info = urltool.parse(url);
    var options = {
      hostname: url_info.hostname,
      port: url_info.port,
      path: url_info.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Content-Length': postData.length
      }
    };
    var req = http.request(options, function (res) {
      var data = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        //var obj = JSON.stringify(data);
   
        onResult(data);
      })
    });
    req.on('error', function (e) {
      logger.error("http post error: " + e.message + ", url = " + url);
    });
    req.write(postData);
    req.end();
  },



  getHdInfo: function (RadioId, HdId, OpenId, callback) {
    var url = appCfg.radio8_server + '/service/sys/get_hd_info.aspx?radioid=' + radioid + '&hdid=' + hdid; //问岩哥？ ？？
    Ut.getJSON(url, callback);
  }
};

module.exports = Ut;
