/*
  整个应用的入口：完成各类全局性的设置和初始化操作
*/

var app = require('./src/express.server.js');
var logger = require('./src/radio8.logger.js').logger('app');

logger.info('traffic start');

// 直接从命令行启动Node服务时，在8099端口监听
app.listen(process.env.PORT || 8099, function () {
  console.log('成功监听');
  logger.info('Express listening on port ' + (process.env.PORT || 8099));
});


// 全局的异常捕获函数
// !! 注意：如果这里捕获异常，表明程序处于未知的不安全状态, 此时重启node可能更合适
process.on('uncaughtException', function(err) {
    logger.error('uncaught exception: ' + err);
});
