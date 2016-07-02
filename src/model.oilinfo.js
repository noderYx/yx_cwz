/*油价接口*/
var http = require('http');
var querystring = require('querystring');
var ut = require('./radio8.common.js');
var logger = require("./radio8.logger.js").logger('oilinfo');
var appCfg = require('../app.config.js');
var redis = appCfg.redis;
var oilPricePort = appCfg.oilPricePort;

/*读取油价信息
https://route.showapi.com/138-46?prov=黑龙江&showapi_appid=3999&showapi_timestamp=201508111111320&showapi_sign=c525c296f2f04d5cad9e42d02475974c
*/

var OilInfo = {};
OilInfo.getOilPrice = function (prov, callback) {
  var dateTime = ut.formatterDateTime(); //yyyyMMddhhmmss

   var params = {
   'prov': prov,
   'showapi_timestamp': dateTime,
   'showapi_appid':3999,
   'showapi_sign':'c525c296f2f04d5cad9e42d02475974c'

   };

   var postData = querystring.stringify(params);
   ut.postJSONforTraffic(oilPricePort, postData, function (objj) {
   var obj = JSON.parse(objj);
   var code = obj.showapi_res_code;
   //console.log(code)
   if(code != 0){
   return callback('油价接口信息错误！')
   }



      //处理接口数据
      var oilResult = {};
      var p93str = JSON.stringify(obj.showapi_res_body.list[0].p93); //93
      var p97str = JSON.stringify(obj.showapi_res_body.list[0].p97); //97
      var p93yuan = p93str.substring(1, 2);
      var p93jiao = p93str.substring(3, 4);
      var p93fen = 0;
      var p97yuan = p97str.substring(1, 2);
      var p97jiao = p97str.substring(3, 4);
      var p97fen = 0;

      if (p93str.length == 6) {
        p93fen = p93str.substring(4, 5);
      }
      if (p97str.length == 6) {
        p97fen = p97str.substring(4, 5);
      }
      oilResult.p93yuan = p93yuan;
      oilResult.p93jiao = p93jiao;
      oilResult.p93fen = p93fen;
      oilResult.p97yuan = p97yuan;
      oilResult.p97jiao = p97jiao;
      oilResult.p97fen = p97fen;
    //console.log(JSON.stringify(oilResult));
      return callback(null, oilResult);
    
  });
}

/*返回结果
var temp = result.showapi_res_body.list;
temp.p0 
temp.p90
temp.p97
temp.p93
temp.prov(黑龙江)
*/
module.exports = OilInfo;