/*获取用户地理位置*/
var http = require('http');
var querystring = require('querystring');
var ut = require('./radio8.common.js');
var logger = require("./radio8.logger.js").logger('location');
var appCfg = require('../app.config.js');
var redis = appCfg.redis;
var location = appCfg.location;

var Location = {};
//参数：lat:纬度,lng:经度  
//http://api.map.baidu.com/geocoder/v2/?ak=btlQYK9KnOpH6dSN2AyUFFdk&location=39.983424,116.322987&output=json&pois=0

Location.getLocation = function (lat, lng, callback) {
  var url = location
          + '/?ak=btlQYK9KnOpH6dSN2AyUFFdk'
          + '&location=' + lat + ',' + lng
		  + '&output=json'
       + '&pois=0';
  //使用common.js工具来处理
  ut.getJSON(url, function (err, obj) {
    if (err) {
      return callback(err);
    }
    var locationJson = {};
    //处理接口数据
    var city1 = JSON.stringify(obj.result.addressComponent.city); // //城市
    var province1 = JSON.stringify(obj.result.addressComponent.province); //省份
    locationJson.city = city1.substring(1,city1.length-2);
    locationJson.province = province1.substring(1, province1.length-2);
    return callback(null, locationJson);
  });
}

module.exports = Location;
/*返回值：
    locationJson.address;//具体地址
    locationJson.city;//城市
    locationJson.provincete;//省份

{"status":0, 
 "result":{"location":{"lng":116.32298703399,"lat":39.983424051248},
            "formatted_address":"北京市海淀区中关村大街27号1101-08室",
            "business":"中关村,人民大学,苏州街",
            "addressComponent":{"city":"北京市","country":"中国","direction":"附近","distance":"7","district":"海淀区","province":"北京市","street":"中关村大街","street_number":"27号1101-08室","country_code":0},
            "poiRegions":[],
            "sematic_description":"北京远景国际公寓(中关村店)内0米",
            "cityCode":131}
}
*/