// 全局的应用参数配置，包括监听端口，默认路径，业务服务器地址，数据库配置等

var logger = require("./src/radio8.logger.js").logger('app');

var appCfg = {};

// sql server 连接配置
var sql = require('mssql');

// 本地服务器数据库
var dbconfig = {
  user: 'sa',
  password: 'sa',
  server: '127.0.0.1', // 正式发布前应该换成内部ip: 10.161.146.107
  database: 'violate',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}


// 全局的数据库连接对象
appCfg.db_connection = new sql.Connection(dbconfig, function(err) {
  if (err) throw err;
	logger.info('db conn succ');
});

appCfg.getDbRequest = function () {
  return new sql.Request(appCfg.db_connection);
};

// redis 连接配置
var redis = require('redis');
var redisClient = redis.createClient();

redisClient.on('error', function (err) {
  logger.error(err);
});

redisClient.on('connect', function(){
  logger.info('Redis conn succ.');
})


appCfg.redis = redisClient;


// 本应用所有 Redis Key的定义
appCfg.HxKEYS = {
  // 油价信息
  OilInfo: 'CWZ:OilInfo',

  // 天气信息
  WeatherInfo: 'CWZ:Weather',

  // 获取橙牛接口cityid 
  CNCityId: 'CWZ:CityIds',

  // 获取违章信息
  CNViolate: 'CWZ:wzinfo',
  
  //城市省份综合
  PN: 'CWZ:prov'
  
}

// 本应用在整个http server中的url路径前缀
// 例如，本应用布设在 iis 服务器的 /node/app1 路径下时，该值设置为 /node/app1
appCfg.url_root = '/traffic/app';
// 全局的文件根目录
appCfg.dir_root = __dirname;

/********所有接口配置信息************/

//获取城市违章规则和cityid
appCfg.citiesPort = 'http://open.chengniu.com/api/against/citys';
//获取违章接口
appCfg.violatePort = 'http://open.chengniu.com/api/against/records';

//油价接口appCfg.oilPricePort = 'http://route.showapi.com/138-46';
appCfg.oilPricePort = 'http://route.showapi.com/138-46';
//天气接口appCfg.weatherPort = 'http://route.showapi.com/9-2';
appCfg.weatherPort = 'http://route.showapi.com/9-2';

//获取微信定位的具体地址
appCfg.location = 'http://api.map.baidu.com/geocoder/v2'

// 业务服务器地址
appCfg.radio8_server = "http://radio2.unitrue.com.cn";

/*
//资源服务器路径
appCfg.radio8_res = 'http://res.unitrue.com.cn';
*/

//网址地址
appCfg.radio8_web = 'http://node.unitrue.com.cn';

// 导出的appCfg对象为只读
module.exports = Object.freeze(appCfg);

