var appCfg = require('../app.config.js');
var util = require('util');
var logger = require("./radio8.logger.js").logger('vehicleinfo');
var ut = require("./radio8.common.js");
var CreateTime = ut.now();
var VehicleInfo = {};

/*
插入车辆信息A2
*/
VehicleInfo.insertVehicleInfo = function (insertJson, callback) {
  var request = appCfg.getDbRequest();
  console.log('insertVehicleInfo 进来了');
  var sql = "insert into violate_vehicleInfo(RadioId,HdId,OpenId,CreateTime,UserName,Phone,WXName,VehicleSize,VehicleNum,City,MotorNum,FrameNum) values ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')";
  var sqlCmd = util.format(sql, insertJson.radioid, insertJson.hdid, insertJson.openid, CreateTime, insertJson.realname, insertJson.mobile, insertJson.nickname, insertJson.VehicleSize, insertJson.VehicleNum, insertJson.City, insertJson.MotorNum, insertJson.FrameNum);
  request.query(sqlCmd, function (err, result) {
    if (err) {
      logger.error('db error: ' + sqlCmd + '; ' + err);
      return callback(err);
    }
    callback(null, result);
  });
}

/*修改车辆信息*/
VehicleInfo.updateVehicleInfo = function (updateJson, callback) {
  var request = appCfg.getDbRequest();
  var sql = "update violate_vehicleInfo set CreateTime='%s', UserName='%s', Phone='%s', WXName='%s', VehicleSize='%s', VehicleNum='%s', City='%s', MotorNum='%s' ,FrameNum='%s' where  VehicleNum = '%s'and RadioId= '%s' and OpenId= '%s'";
  var sqlCmd = util.format(sql, CreateTime, updateJson.realname, updateJson.mobile, updateJson.nickname, updateJson.VehicleSize, updateJson.VehicleNum, updateJson.City, updateJson.MotorNum, updateJson.FrameNum, updateJson.OldVehicleNum,updateJson.radioid,updateJson.openid);
  request.query(sqlCmd, function (err, result) {
    if (err) {
      logger.error('db error: ' + sqlCmd + '; ' + err);
      return callback(err);
    }
    
    callback(null, result);
  });
}


/*删除车辆信息,通过VehicleNum删除记录*/
VehicleInfo.deleteVehicleInfo = function (VehicleNum,radioid,openid, callback) {
  var request = appCfg.getDbRequest();
  var sql = "delete from violate_vehicleInfo where VehicleNum = '%s' and RadioId = '%s' and OpenId = '%s'";
  var sqlCmd = util.format(sql, VehicleNum,radioid,openid);
  request.query(sqlCmd, function (err, result) {
    if (err) {
      logger.error('db error: ' + sqlCmd + '; ' + err);
      return callback(err);
    }
  
    callback(null, result);
  });
}

/*通过VehicleNum查询车辆 A1编辑跳A2*/
/*分享进来*/
VehicleInfo.findVehicleInfo = function (VehicleNum, openid, radioid, callback) {

  var request = appCfg.getDbRequest();
  var sql = "select * from violate_vehicleInfo where VehicleNum = '%s' and OpenId='%s' and RadioId='%s'";
  var sqlCmd = util.format(sql, VehicleNum, openid, radioid);
  request.query(sqlCmd, function (err, result) {
    if (err) {
      logger.error('db error: ' + sqlCmd + '; ' + err);
      return callback(err);
    }
    callback(null, result[0]);
  });

}

/*重复添加车辆*/
VehicleInfo.findCity = function (VehicleNum, openid,radioid, callback) {
 
  var request = appCfg.getDbRequest();
  var sql = "select VehicleNum, City,FrameNum,MotorNum from violate_vehicleInfo where VehicleNum = '%s' and openid='%s' and RadioId='%s'";
  var sqlCmd = util.format(sql, VehicleNum, openid,radioid);
  request.query(sqlCmd, function (err, result) {
    if (err) {
      logger.error('db error: ' + sqlCmd + '; ' + err);
      return callback(err);
    }
    callback(null, result);
  });
}

/*查询某人拥有的车辆信息 A1*/
VehicleInfo.findVehicleNum = function (OpenId,radioid, callback) {
  var request = appCfg.getDbRequest();
  var sql = "select VehicleNum, City,FrameNum,MotorNum from violate_vehicleInfo where OpenId='%s' and RadioId='%s'";
  var sqlCmd = util.format(sql, OpenId,radioid);
  request.query(sqlCmd, function (err, result) {
    if (err) {
      logger.error('db error: ' + sqlCmd + '; ' + err);
      return callback(err);
    }
    callback(null, result);
  });

}


module.exports = VehicleInfo;