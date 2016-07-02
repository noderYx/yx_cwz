var ut = require('./radio8.common.js');
var logger = require("./radio8.logger.js").logger('hdinfo');
var HdInfo = {};

HdInfo.getHdInfo = function (RadioId, HdId, OpenId, callback) {
  var hdConfig = {};
  hdConfig.RadioId = '';//??????????
  hdConfig.HdId = '';//??????????????
  hdConfig.IsStart = 0;    //是否启用
  hdConfig.title = '雪佛兰赞助查违章';         //活动标题
  hdConfig.HeadPicture = { '图片路径': '图片超链接' }; //冠名图片
  hdConfig.KeyWord = 001;    //关键字
  hdConfig.icon = { '图片路径': '图片超链接' };      //公共账号图片
  hdConfig.ShareImg = { '图片路径': '图片超链接' };   //分享图片
  hdConfig.IsVip = 0;       //会员
  hdConfig.IsAttention = 1; //关注
  hdConfig.summary = '1、汽车号牌说明：黄色牌照的车辆为大型汽车,蓝色牌照的汽车为小型汽车。2、异地的违法信息转地需要1-2天时间,如车辆在异地违法,请在异地公告2天后查询。3、所有信息以交警支队查询信息为准。';    //活动摘要

  // hdConfig.openid = openid;
  if (RadioId == hdConfig.radioid && HdId == hdConfig.HdId) {
    callback(null, hdConfig);
  }
}
module.exports = HdInfo;

