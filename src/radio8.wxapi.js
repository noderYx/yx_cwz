var jsSHA = require("jssha");
var http = require('http');
var fs = require('fs');
var appCfg = require('../app.config.js');
var redis = appCfg.redis;
var ut = require('./radio8.common.js');
var logger = require("./radio8.logger.js").logger('wxapi');

// 统一封装fmradio8微信开发需要的各类接口
// 包括：微信JS签名，微信授权，微信用户信息获取，电台信息获取...
var WxApi = {};

// 为url生成微信js签名
WxApi.genSignature = function (radioid, url, next) {
  if (!radioid || !url) {
    return next("请求参数为空");
  }

  // 获取 js ticket 和 appid
  var ticket_url = "http://radio2.unitrue.com.cn/service/sys/get_wxjs_sign.aspx?radioid=" + radioid;
  ut.getJSON(ticket_url, function (err, retObj) {
    if (err) {
      return next(err);
    }

    var data = {
      appid: retObj.appid,
      url: url
    };

    // 微信JS签名：生成随机字符串（16位长度）和时间戳
    data.nonceStr = Math.random().toString(36).substr(2, 16);
    data.timestamp = '' + parseInt(new Date().getTime() / 1000);

    var str = 'jsapi_ticket=' + retObj.ticket
            + '&noncestr=' + data.nonceStr
            + '&timestamp=' + data.timestamp
            + '&url=' + url;

    var shaObj = new jsSHA(str, 'TEXT');
    data.signature = shaObj.getHash('SHA-1', 'HEX');

    next(null, data);
  });
}

// 获取微信用户的信息
/* 返回的json数据示例：
//
{
"nickname":"halowb",
"headicon":"http://wx.qlogo.cn/mmopen/Q3auHgzwzM5yibXskDmFLhRzRw1ADeXwmziawRbT1tsjYI93fcjnKjW6rFOSr2Csft3Q0m1T7s1d3bSR7dq3uH3A/0",
"subscribe":"1",
"realname":"谢文彬",
"mobile":"13818907904",
"membertime":"2015-05-20 16:56:50"
}
*/
WxApi.getUserInfo = function (radioid, openid, next) {
  if (!radioid || !openid) {
    return next('缺少请求参数');
  }

  var url = appCfg.radio8_server + '/service/sys/get_wx_user.aspx'
      + '?radioid=' + radioid
      + '&openid=' + openid;

  ut.getJSON(url, next);
};

// 获取电台的信息
WxApi.getRadioInfo = function (radioid, next) {
  if (!radioid) {
    return next('缺少请求参数');
  }

  var url = appCfg.radio8_server + '/service/sys/get_radio_info.aspx?radioid=' + radioid;

  ut.getJSON(url, next);
};

 // 微信授权，获取用户的openid
WxApi.oauth = function (req, res, next) {
  
 var radioid = req.query.radioid;
 console.log('>>>>>'+radioid);
  if (!radioid) {
    return next('未提供radioid参数');
  }

  WxApi.getRadioInfo(radioid, function (err, radio) {
    if (err) {
      return next(err);
    }

    // 检查cookie是否存在，cookie name = radioid + 'openid'，如 fmradio8openid
    //var istest = appCfg.radio8_server.indexOf('bot.unitrue.com.cn') >= 0;
    var ck_openid = radioid + 'openid';
    var ck_comid = 'comopenid';

    if (req.cookies && req.cookies[ck_comid] && req.cookies[ck_openid]) {

      var openid = req.cookies[ck_openid];

      WxApi.getUserInfo(radioid, openid, function (err, userInfo) {
        if (err) {
          return next(err);
        }

        userInfo.openid = openid;
        userInfo.comopenid = req.cookies[ck_comid];

        // 会员测试
        if (userInfo.profile && userInfo.profile.testmember
		    && userInfo.profile.testmember == "1") {
          userInfo.realname = "";
          userInfo.mobile = "";
        }
        console.log('userInfo??realname:' + userInfo.realname);

        // 获取用户信息成功
        req.userInfo = userInfo;
        return next(null, 1);
      });
    }
    else {
      var full_url = req.protocol + '://' + req.get('Host') + req.originalUrl;

      var encode_url = encodeURIComponent(full_url);



      var url = 'http://radio2.unitrue.com.cn/page/common/WxOAuth.aspx?wxscope=base&radioid=' + radioid + '&redirect=' + encode_url;
      //如果需要确保获得用户头像（公共号未认证或者未关注等情况下）则wxscope参数设置为userinfo,则会使用用户oauth授权来获取头像昵称并保存到WxContactSet表里
      // var url = appCfg.radio8_server + '/page/common/WxOAuth.aspx?wxscope=userinfo&radioid=' + radioid + '&redirect=' + encodeURIComponent(full_url);

      res.redirect(url);
      return next(null, 0);
    }
  });
};

module.exports = WxApi;
