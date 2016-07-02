/*
 Express Server的路由设置
 所有动态页面和服务请求的响应
 Express 4.x api文档: http://expressjs.com/4x/api.html#router
 */

var express = require('express');
var session = require('express-session');
var https = require('https');
var async = require('async');
var fs = require('fs');
var wxapi = require('./radio8.wxapi.js');
var ut = require('./radio8.common.js');
var logger = require("./radio8.logger.js").logger('express');
var appCfg = require('../app.config.js');
var util = require('util');
var url = require("url");
var MainServer = require('./model.mainserver.js');
var VehicleInfo = require('./model.vehicleinfo.js');
var WeatherInfo = require('./model.weatherinfo.js');
var OilInfo = require('./model.oilinfo.js');
var WzInfo = require('./model.wzinfo.js');
var Location = require('./model.location.js');



var router = express.Router();
// 1. 添加微信签名;
// 2.获取授权信息
router.use(function (req, res, next) {

  // 检查是否活动网页的访问请求
  var pages = ['/index', '/locationUrl', '/main', '/header', '/violateOneDetail', '/deleteVehicle', '/updateVehicle','/CK'];
  if (req.method == 'GET') {

     // 所有网页请求都必须带 radioid，hdid参数，否则直接转错误提示页面
    if (!checkQueryString(req, res, 'radioid')) { return; }
  
    var radioid = req.query.radioid;
    var hdid = '20009676';
    req.radioid = radioid;
    req.hdid = hdid

    // fmradio8主服务器的地址，某些情况如跳转到会员注册时需要使用该地址
    req.radio8server = 'http://radio2.unitrue.com.cn';
    var q = req.query;
    req.user = {
      openid: q.openid,
      ismember: 0,
      isfan: 0
    };
    //获取授权信息
   
    wxapi.oauth(req, res, function (err, result) {
      if (err) {
        console.log(err);
        req.errorMsg = '获取授权失败';
        res.render('page-error', req);
        return;
      };
      if (result == 0) {
        return;
      }
      // 微信会员信息已存入req.userInfo中
      req.user.openid = req.userInfo.openid;
      req.openid = req.userInfo.openid;

      console.log('req.userInfo.openid' + req.user.openid);
      console.log('req.userInfo.subscribe' + req.userInfo.subscribe);

      if (req.userInfo && req.userInfo.realname) {
        req.user.ismember = 1;
        req.user.headicon = req.userInfo.headicon;
        req.user.nickname = req.userInfo.nickname;
        req.user.realname = req.userInfo.realname;
        req.user.mobile = req.userInfo.mobile;
      }
      if (req.userInfo.subscribe == '1') {
        req.user.isfan = 1;
      }
      console.log('req.user.ismember' + req.user.ismember);
      console.log('req.user.Isfan' + req.user.isfan);
      var full_url = req.protocol + '://' + req.get('Host') + req.originalUrl;
      console.log('full_url>>>>>>' + full_url);
      // 生成微信签名
      req.wxsign = {
        appid: '',
        nonceStr: '',
        timestamp: '',
        url: '',
        signature: ''
      };
      wxapi.genSignature(q.radioid, full_url, function (err, data) {
        if (err) {
          logger.error('微信js api 签名错误: ' + err.message + ',' + full_url + ', ' + radioid);
        }
        else {
          console.log(data.appid + '==' + data.signature);
          req.wxsign = data;
        }
        next();
      });
    });
  }
  else {
    next();
  }
});

/*
loding页面
param:radioid hdid openid
*/
router.get('/index', function (req, res) {
  res.render('loding', req);
});

/*
获取定位信息
param:redioid hdid openid latitude longitude
callback返回类型:area prov 
*/
router.get('/locationUrl', function (req, res) {
  var q = req.query;
  //获取定位信息
  Location.getLocation(q.latitude, q.longitude, function (err, locationJson) {
    if (err) {
      req.errorMsg = '微信定位接口信息错误！';
      res.render('page-error', req);
      return;
    };
    var haha = { 'city':locationJson.city , 'province':locationJson.province  };
    res.send(JSON.stringify(haha));
  });
});
/*
A1页面
param:area、prov、redioid hdid openid
callback返回类型:weatherResult oilPriceResult ViolateByOpenId
*/
router.get('/main', function (req, res) {
  var q = req.query;
  if (q.errVehicle == undefined || q.errVehicle == null) {
    console.log('q.errVehicle 没有问题');
    req.errVehicle = '';
  } else {
     console.log('q.errVehicle的错误信息为：'+q.errVehicle)
    req.errVehicle = q.errVehicle;
  }
  var openid = req.user.openid;
  var hdid = '20009676';
  req.area = q.area;
  req.prov = q.prov;
  req.radio8_web = appCfg.radio8_web;
  req.url_root = appCfg.url_root;
  console.log("gsgsg"+q.area);
  console.log("<"+q.prov);
  //1.获取天气
  MainServer.judgeWeather(q.area, function (err, weatherResult) {
    if (err) {
      req.errorMsg = '天气接口信息错误！';
      res.render('page-error', req);
      return;
    }
    req.weatherResult = weatherResult;

    //2.获取油价
  MainServer.judgeOilPrice(q.prov, function (err, oilPriceResult) {
    if (err) {
      req.errorMsg = '油价接口信息错误！';
      res.render('page-error', req);
      return;
    }
    req.oilPriceResult = oilPriceResult;


    MainServer.judgePN(function (err, PNResult) {
      if (err) {
        req.errorMsg = '城市违章规则接口信息错误！';
        res.render('page-error', req);
        return;
      }
      req.PNResult = JSON.stringify(PNResult);

      req.ViolateByOpenId = '';
        //3.查询本人的车辆信息
        VehicleInfo.findVehicleNum(openid, q.radioid, function (err, VC) {
          if (err) {
            req.errorMsg = '本人拥有的车牌号和城市查询失败！';
            res.render('page-error', req);
            return;
          }
          //4.本人所有违章车辆信息数组
          var ViolateByOpenId = [];
          async.waterfall([
          function (callback) {
            if (VC.length == 0) {
              callback(null, '');
            } else {
              var VehicleNumOld = '';
              var index = 0;
              VC.forEach(function (value) {
                //5.查询一辆车违章信息              
                MainServer.judgeViolate(q.radioid, hdid, openid, VehicleNumOld, value.VehicleNum, value.FrameNum, value.MotorNum, value.City, function (err, violateResult) {
                  if (err) {
                    req.errorMsg = err;
                    //添加错误删除车辆
                    VehicleInfo.deleteVehicleInfo(value.VehicleNum, q.radioid, openid, function (err, result) {
                      console.log('车辆信息错误 删除了' + value.VehicleNum + ' 车，避免出现错误---杨雪');
                      var errVehicle = '您之前输入的车辆数据有错误，系统已清除。请核对重新输入 ！';
                      var url = 'main?radioid=' + q.radioid + '&prov=' + q.prov + '&area=' + q.area + '&errVehicle=' + errVehicle;
                      return res.redirect(url);
                    });
                  } else {
                    index++;
                    violateResult.City = value.City;
                    ViolateByOpenId.push(violateResult);
                    if (index == VC.length) {
                      callback(null, ViolateByOpenId);
                    }
                  }
                });
              });
            }
          } ],
          function (err, result) {
            if (err) {
              console.log('处理错误!');
            } else {
              req.ViolateByOpenId = result;
              res.render('A1', req);
            }
          });
        });
      });
    });
  });
});




/*
A1切换城市
param:area、prov、redioid hdid openid
callback返回类型:weatherResult oilPriceResult ViolateByOpenId
*/
router.get('/header', function (req, res) {
  var q = req.query;
  //获取天气     
  MainServer.judgeWeather(q.area, function (err, weatherResult) {
    if (err) {
      req.errorMsg = '天气接口信息错误！';
      res.render('page-error', req);
      return;
    };
    //获取油价
    MainServer.judgeOilPrice(q.prov, function (err, oilPriceResult) {
      if (err) {
        req.errorMsg = '油价接口信息错误！';
        res.render('page-error', req);
        return;
      };
      var haha = { 'oilPriceResult': oilPriceResult, 'weatherResult': weatherResult };
      res.send(JSON.stringify(haha));
    });
  });
});


/*
违章详情页A3 分享进来 
param：RadioId, HdId, OpenId,vehicleNum,cityNames
*/
router.get('/violateOneDetail', function (req, res) {
  //获取微信昵称和微信头像 分享出去要有车牌号
  var q = req.query;
  //var openid = req.user.openid;
  var hdid = '20009676';
  console.log(q.openid + '---' + q.VehicleNum);
  req.radio8_web = appCfg.radio8_web;
  req.url_root = appCfg.url_root;
  //查询车辆信息
  VehicleInfo.findVehicleInfo(q.VehicleNum, q.openid, q.radioid, function (err, result) {
    if (err) {
      req.errorMsg = 'A2跳A3违章查询失败！';
      res.render('page-error', req);
      return;
    };

    //查询该辆车违章信息

    MainServer.judgeViolate(q.radioid, hdid, q.openid, q.OldVehicleNum, result.VehicleNum, result.FrameNum, result.MotorNum, result.City, function (err, ViolateByNUM) {
      if (err) {
        req.errorMsg = err;
        //添加错误删除车辆
        VehicleInfo.deleteVehicleInfo(q.VehicleNum, q.radioid, q.openid, function (err, result) {
          console.log('车辆信息错误 删除了'+q.VehicleNum+' 车，避免出现错误---杨雪');
          return res.render('page-error', req);
          
        });
      } else {
        ViolateByNUM.City = result.City;
        if (ViolateByNUM != null) {
          req.ViolateByNUM = ViolateByNUM;
          console.log('>>>>>>>>' + ViolateByNUM.Nodata);
          res.render('A3', req);
        } else {
          req.ViolateByNUM = '';
          return res.render('A3', req);
        }
      }
    });
  });
});



/*
删除车辆 
param：RadioId, HdId, OpenId,VehicleNum
*/
router.get('/deleteVehicle', function (req, res) {
   var q = req.query;
   var openid = req.user.openid;
  //删除数据库车辆信息

  VehicleInfo.deleteVehicleInfo(q.VehicleNum,q.radioid,openid, function (err, result) {
    if (err) {
     res.send('error');
    }
    res.send('success');
  });
});

/*
添加车辆
param:RadioId, HdId, OpenId
*/
router.get('/addVehicle', function (req, res) {
  //查询城市和省份
  req.nickname = req.userInfo.nickname;
  req.realname = req.userInfo.realname;
  req.mobile = req.userInfo.mobile;
  req.radio8_web = appCfg.radio8_web;
  req.url_root = appCfg.url_root;
  MainServer.judgePN(function (err, PNResult) {
    if (err) {
      req.errorMsg = '城市省份查询失败！';
      res.render('page-error', req);
      return;
    };
    req.PNResult = JSON.stringify(PNResult);
    req.vehicleResult = "";
    res.render('A2', req);
  })
});


/*
编辑车辆
param：RadioId, HdId, OpenId,oldVehicleNum
*/
router.get('/updateVehicle', function (req, res) {
  var q = req.query;
  var openid = req.user.openid;
  req.nickname = req.userInfo.nickname;
  req.realname = req.userInfo.realname;
  req.mobile = req.userInfo.mobile;
  req.radio8_web = appCfg.radio8_web;
  req.url_root = appCfg.url_root;
  if (!checkQueryString(req, res, 'OldVehicleNum')) { return; }
  //查询单一车辆信息
  VehicleInfo.findVehicleInfo(q.OldVehicleNum,openid,q.radioid, function (err, vehicleResult) {
    if (err) {
      req.errorMsg = '查询车辆信息失败A1跳A2！';
      res.render('page-error', req);
      return;
    }
    //查询城市和省份
    MainServer.judgePN(function (err, PNResult) {
      if (err) {
        req.errorMsg = '城市省份查询失败！';
        res.render('page-error', req);
        return;
      }
      req.PNResult = JSON.stringify(PNResult);
      req.vehicleResult = JSON.stringify(vehicleResult);
      res.render('A2', req);
    });
  });
});

/*
将车辆信息保存到数据库
param: RadioId, HdId, OpenId,form表单
*/
router.post('/saveVehicleInfo', function (req, res) {
  var b = req.body;
   if (b.OldVehicleNum == "") {
     //添加车辆
    return showInsert(req, res);
  } else {
    //编辑车辆
    return showUpdate(req, res);
  }
});


/*添加车辆信息 参数：RadioId, HdId, OpenId,form表单*/
var showInsert = function (req, res) {
  var b = req.body;
 
  //插入车辆信息到数据库中
  VehicleInfo.insertVehicleInfo(b, function (err, result) {
    if (err) {
      res.send('error');
    }
    res.send('success');

  })
};

/*修改车辆信息 RadioId, HdId, OpenId,form表单,oldVehicleNum*/
var showUpdate = function (req, res) {
  var b = req.body;
  //修改的车辆信息到数据库中
  VehicleInfo.updateVehicleInfo(b, function (err, result) {
    if (err) {
      return res.send('error');
    }
    res.send('success');
  })
};

//findCity
/*查询添加车辆是否重复*/
router.get('/CK', function (req, res) {
  var q = req.query;
  var openid = req.user.openid;
  VehicleInfo.findCity(q.VehicleNum, openid,q.radioid, function (err, vehicleResult) {
    if (err) {
      return res.send('error');
    };
    if (vehicleResult.length == 0) {
      res.send('no');
    } else { 
     res.send('you');
    }

  });
});

// 检查url请求中是否包含指定的参数
var checkQueryString = function (req, res, key) {
  if (req.query[key] == undefined) {
    req.errorMsg = 'url地址中缺少' + key + '参数';
    res.render('page-error', req);
    return false;
  }
  return true;
};

module.exports = router;