var md5 = require('./md5.min.js');
var http = require('http');
var querystring = require('querystring');
var ut = require('./radio8.common.js');
var logger = require("./radio8.logger.js").logger('wzinfo');
var appCfg = require('../app.config.js');
var async = require('async');
var redis = appCfg.redis;
var KEYS = appCfg.HxKEYS;
var citiesPort = appCfg.citiesPort;
var violatePort = appCfg.violatePort;

var WzInfo = {};
//获取橙牛接口签名
function toObjforJson(params) {
	var appkey = 'a4d3844351';
	var appsecret = '6f03e73a55ef25d6';
	var date = new Date();
	year = date.getFullYear();
	month = date.getMonth() + 1;
	day = date.getDate();
	hour = date.getHours();
	minute = date.getMinutes();
	second = date.getSeconds();
	timestamp = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
	params.appkey = appkey;
	params.timestamp = timestamp;
	params.v = '1.0';
    var arr = [];
    for (var i in params) {
        if (params[i] === null || params[i] === undefined) {
            params[i] = '';
        }
        arr.push(i + params[i]);
    }
    arr.sort();
    var str = '';
    for (var j in arr) {
        str += arr[j];
    }
    str = appsecret + str + appsecret;
    params.sign = md5.md5(str).toUpperCase();
    return params;
}

//获取城市多城市省份
WzInfo.getCities = function (callback) {
  console.log('WzInfo.getCities ');
  var nowDate = ut.today(); //日期精确到天
  var keys = KEYS.CNCityId + ':' + nowDate;
  var keyPN = KEYS.PN + ':' + nowDate;
  var params = {};
  var postData = toObjforJson(params);
  var appkey = postData.appkey;
  var v = postData.v;
  var timestamp = postData.timestamp;
  var sign = postData.sign;
  var url = citiesPort
          + '?appkey=' + appkey
       + '&v=' + v
        + '&timestamp=' + timestamp
         + '&sign=' + sign;

  ut.getJSON(url, function (err, obj) {
    if (err) {
      return callback(err);
    }
    console.log('obj' + obj.code);
    if (obj.code != 0) {
      console.log('code != 0');
      return callback('城市违章规则接口信息错误');
    }

    //处理接口数据
    var temp1 = obj.data;
    //将数组排序
    temp1.sort(function (a, b) {
      if (a.province == b.province) {
        var value1 = a.prefix;
        var value2 = b.prefix;
        if (value1 < value2) {
          return -1;
        } else if (value1 > value2) {
          return 1;
        } else {
          return 0;
        }
      } else {
        var value1 = a.province;
        var value2 = b.province;
        if (value1 < value2) {
          return -1;
        } else if (value1 > value2) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    //将城市和省份放入数组  
    var dis = [];
    for (var i = 0; i < temp1.length; i++) {
      var prov = temp1[i].province;
      var area = temp1[i].name;
      if (temp1[i].province == '上海' || temp1[i].province == '北京' || temp1[i].province == '天津' || temp1[i].province == '重庆') {
        var json = { prov: prov, area: '' };
        dis.unshift(json); //添加
      } else {
        area = '|' + area;
        var json = { prov: prov, area: area };

        if (temp1[i].province == temp1[i - 1].province) {
          json.area = dis[dis.length - 1].area + area;
          dis.pop();
        }
        dis.push(json);
      }
    }
    redis.set(keys,  JSON.stringify(temp1));
    redis.set(keyPN,  JSON.stringify(dis));

    redis.expire(keys, 24 * 60 * 60 ); //1天
    redis.expire(keyPN, 24 * 60 * 60 ); //1天
    return callback(null, dis);
  });
}
//读取违章信息  一辆车所有城市违章信息
WzInfo.getViolate = function (cityIds, vehicleNum, frameNum, motorNum, callback) {
  console.log('WzInfo.getViolate');
  var now = ut.now();
  var params = {
    'cityIds': cityIds,
    'vehicleNum': vehicleNum,
    'motorNum': motorNum,
    'frameNum': frameNum

  };
  //计算全部参数
  var postData = toObjforJson(params);
  var appkey = postData.appkey;
  var v = postData.v;
  var timestamp = postData.timestamp;
  var sign = postData.sign;
  postData = querystring.stringify(postData);
  //使用common.js工具来处理
  ut.postJSONforTraffic(violatePort, postData, function (objj) {
    var obj = JSON.parse(objj);
    console.log('obj.code:'+obj.code)
    var yz = JSON.stringify(obj);
    console.log('哈哈哈的' + yz);
    if(obj.code=='21002'||obj.code=='21001'||obj.code=='21003'){
       console.log('输出的错误信息为: ' + obj.msg)
      return callback(obj.msg);
    }
   // var b = yz.indexOf("errorData");
    var forCount = cityIds.split(',').length;
    var data = obj.data;
    var violateJson = {};
    var score = 0;
    var Noscore = 0;
    var Sumscore = 0;
    var money = 0;
    var Nomoney = 0;
    var Summoney = 0;
    var status = 0;
    var Nostatus = 0;
    var NodataList = [];
    var dataList = [];

    if (data != null) {
      var total = data.length;
      total = total / forCount;
      for (var i = 0; i < total; i++) {
        if (data[i].status == 0) {//未处理
          Nostatus++;
          Nomoney += data[i].money;
          Noscore += data[i].score;
          NodataList.push(data[i]);
        } else {
          money += data[i].money;
          score += data[i].score;
          dataList.push(data[i]);
          status++;
        }
        Sumscore += data[i].score;
        Summoney += data[i].money;
      };
      violateJson.score = score; //违章已处理总扣分
      violateJson.Noscore = Noscore; //违章未处理总扣分
      violateJson.Sumscore = Sumscore; //违章总扣分
      violateJson.status = status; //已处理
      violateJson.Nostatus = Nostatus; //未处理
      violateJson.data = dataList; //已处理违章详细信息
      violateJson.Nodata = NodataList; //未处理违章详细信息
      violateJson.money = money; //违章已交罚款
      violateJson.Nomoney = Nomoney; //违章未交罚款
      violateJson.Summoney = Summoney; //违章总罚款
      violateJson.total = total; //违章总记录数
      violateJson.VehicleNum = vehicleNum; //违章车牌
      console.log("yichuli" + violateJson.data.length);
      console.log("...yichuli" + violateJson.Nodata.length);
      callback(null, violateJson);
    } else {
      callback(null, '');
    }
  });

}

/*
{"code":0,
  "msg":"",
  "errorData":{},
  "data":
       [{"id":2993251,"vehicleNum":"浙A91N58","cityId":3,"cityName":"上海","address":"A4高速60.9KM跨线桥路段","behavior":"在高速公路上超速不足50%的","time":"2008-08-3108:43:00","score":3,"money":200,"status":0,"canSubmit":1,"paymentStatus":null,"againstCode":"4305","againstRule":"《条例》第78条","collectOffice":"机动支队"}]
}
*/


WzInfo.findsPN = function (callback) {
  var nowDate = ut.today();//日期精确到天
  var keyPN = KEYS.PN + ':' + nowDate;
  redis.get(keyPN, function (err, redisResult1) {
    if (err) {
      return callback(err);
    }
    if (redisResult1 != null && redisResult1 != '') {
      var redisResult = JSON.parse(redisResult1);
      callback(null,redisResult);
    } else {
      return callback(null, '');
    }
  });
}


WzInfo.findsCity = function (cityNames, callback) {
    var name = cityNames.split('、');
    var nowDate = ut.today(); //日期精确到天
    var keys = KEYS.CNCityId + ':' + nowDate;
    var ids = '';
    redis.get (keys, function (err, redisResult1) {
        if (err) {
            return callback(err);
        }
        if (redisResult1 != null && redisResult1 != '') {
            var redisResult = JSON.parse(redisResult1);
            for (var i = 0; i < name.length; i++) {
                for (var j = 0; j < redisResult.length; j++) {
                    //当找到对应城市则回
                    if (name[i] == redisResult[j].name) {
                        ids += redisResult[j].id + ',';
                    }
                }
                if (i == name.length - 1) {
                    var cityIds = ids.substring(0, (ids.length - 1));
                    return callback(null, cityIds);
                }
            }
        } else {
            return callback(null, '');
        }
    });
}

module.exports = WzInfo;
