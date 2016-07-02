/* 
   业务层--主要逻辑判断
*/
var appCfg = require('../app.config.js');
var redis = appCfg.redis;
var util = require('util');
var logger = require("./radio8.logger.js").logger('main_server');
var WzInfo = require('./model.wzinfo');
var OilInfo = require('./model.oilinfo');
var ut = require('./radio8.common.js');
var WeatherInfo = require('./model.weatherinfo');
var KEYS = appCfg.HxKEYS;
var MainServer = {};

/*
 '天气信息'
 1.先从缓存查，
 2.从接口查,查到存缓存
*/
MainServer.judgeWeather = function (area, callback) {
  console.log(">>>>>>");
  var dateTime = ut.formatterDateTime();
  var nowDate = dateTime.substring(0, 10); //精确到小时
  var keys = KEYS.WeatherInfo + ':' + area + ':' + nowDate;
  //redis缓存读取
  redis.get(keys, function (err, redisResult) {
    if (err) {
      return callback(err);
    }
    if (redisResult != null && redisResult != '') {
      var redisResult1 = JSON.parse(redisResult);
      return callback(null, redisResult1);
    }
    // 没找到缓存数据，需要从天气接口读取
    WeatherInfo.getWeather(area, function (err, portResult) {
      if (err) return callback(err);
      if (portResult) {
        redis.set(keys, JSON.stringify(portResult), function (err) {
          if (err) return callback(err);
          redis.expire(keys,  60 * 60 ); //1小时销毁
          return callback(null, portResult);
        });
      }
    })
  });
};


/*
 '油价信息'
 1.先从缓存查，
 2.从接口查,查到存缓存
*/
MainServer.judgeOilPrice = function (prov, callback) {
  var nowDate = ut.today(); //日期精确到天
  var keys = KEYS.OilInfo + ':' + prov + ':' + nowDate;
  //redis缓存读取
  redis.get(keys,  function (err, redisResult) {
    if (err) {
      return callback(err);
    }
    if (redisResult != null && redisResult != '') {
       var redisResult1 = JSON.parse(redisResult);
       return callback(null, redisResult1);
    }
    // 没找到缓存数据，需要从油价接口读取
    OilInfo.getOilPrice(prov, function (err, portResult) {
      if (err) return callback(err);
      if (portResult) {
        redis.set(keys,  JSON.stringify(portResult), function (err) {
          if (err) return callback(err);
          redis.expire(keys, 24 * 60 * 60 ); //一天销毁
          return callback(null, portResult);
        });
      }
    })
  });
}


/*
城市和省份  页面动态遍历
从缓存读取
从接口读取
*/
MainServer.judgePN = function (callback) {
  var keyPN = KEYS.PN;
  //redis缓存读取
  WzInfo.findsPN(function (err, redisResult) {
    if (err) {
      return callback(err);
    }
    if (redisResult != null && redisResult != '') {
      return callback(null, redisResult);
    }
    // 没找到缓存数据，需要从接口读取
    WzInfo.getCities(function (err, portResult) {
      if (err) return callback(err);
      if (portResult) {
        return callback(null, portResult);
      }
    })
  });
}

//查询违章信息 每辆车查询一个城市
MainServer.judgeViolate = function (RadioId, HdId, OpenId, OldVehicleNum, VehicleNum, FrameNum, MotorNum, cityNames, callback) {
  var nowDate = ut.today(); //日期精确到天
  var keys = KEYS.CNViolate + ':' + RadioId + ':' + HdId + ':' + OpenId + ':' + VehicleNum + ':' + MotorNum + ':' + FrameNum + '::' + nowDate ;
   
  // 先从redis缓存读取
  redis.get(keys,  function (err, violateJson1) {
    if (err) {
      return callback(err);
    }
    if (violateJson1 != null && violateJson1 != '') {
      console.log('先从redis缓存读取');
      var violateJson = JSON.parse(violateJson1);
      return callback(null, violateJson);
    }
    //没找到缓存数据，需要从违章接口读取
    WzInfo.findsCity(cityNames, function (err, cityIds) {
      if (err) return callback(err);
      if (cityIds) {
        WzInfo.getViolate(cityIds, VehicleNum, FrameNum, MotorNum, function (err, portResult) {
          if (err) {
            return callback(err);
          }
          if (portResult) {
            redis.set(keys,JSON.stringify(portResult), function (err) {
              if (err) return callback(err);
              redis.expire(keys, 24 * 60 * 60); //1天
            });
          }
          return callback(null, portResult);
        });
      };
    });
  });
}

module.exports = MainServer;