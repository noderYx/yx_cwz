/*天气接口*/
var http = require('http');
var querystring = require('querystring');//???????????????
var ut = require('./radio8.common.js');
var logger = require("./radio8.logger.js").logger('weatherinfo');
var appCfg = require('../app.config.js');
var weatherPort = appCfg.weatherPort;
var WeatherInfo = {};
/*
http://route.showapi.com/9-2?area=黑龙江&areaid=&needIndex=0&needMoreDay=0&showapi_appid=3999&showapi_timestamp=201508110951&showapi_sign=c525c296f2f04d5cad9e42d02475974c
*/

//从接口中读取天气信息 接口1
WeatherInfo.getWeather = function (area, callback) {
  var dateTime = ut.formatterDateTime();
    var params = {
        'area': area,
        'needIndex': 0,
        'needMoreDay': 0,
        'showapi_timestamp': dateTime,
        'showapi_appid':3999,
        'showapi_sign':'c525c296f2f04d5cad9e42d02475974c'

    };
    var postData = querystring.stringify(params);
    ut.postJSONforTraffic(weatherPort, postData, function (objj) {
        var obj = JSON.parse(objj);
        var code = obj.showapi_res_code;
        //console.log(code)
         if(code != 0){
             return  callback('天气接口信息错误！')
         }
      //处理接口数据
     //  console.log("天气信息："+JSON.stringify(obj));
      var weatherResult = {};
      var day_weather1 = JSON.stringify(obj.showapi_res_body.f1.day_weather); //白天天气
      var night_weather1 = JSON.stringify(obj.showapi_res_body.f1.night_weather); //晚上天气
      var day_air_temperature1 = JSON.stringify(obj.showapi_res_body.f1.day_air_temperature); //白天温度
      var night_air_temperature1 = JSON.stringify(obj.showapi_res_body.f1.night_air_temperature); //晚上温度
      weatherResult.day_weather = day_weather1.replace('\"', '').replace('\"', '');
      weatherResult.night_weather = night_weather1.replace('\"', '').replace('\"', '');
      weatherResult.day_air_temperature = day_air_temperature1.replace('\"', '').replace('\"', '');
      weatherResult.night_air_temperature = night_air_temperature1.replace('\"', '').replace('\"', '');
      return callback(null, weatherResult);
    
  });
}

/*
返回值：
 weatherResult.day_weather//白天天气
 weatherResult.night_weather//晚上天气
 weatherResult.day_air_temperature//白天温度
 weatherResult.night_air_temperature //晚上温度
*/




module.exports = WeatherInfo;