// 服务器地址

//修改状态时帮顶数据
//vehicleResult get回传json
/*VehicleSize  (车型)       
  VehicleNum   (车牌号)     
  City         (查询城市  拼接字符串给我 格式：'哈尔滨、上海、天津')  
  MotorNum     (发动机号)     
  FrameNum     (车架号)
*/
$(function(){     
	  if($("#vehicleResult").val()!="")
	  {
		  var vehicleResult = $("#vehicleResult").val();
		  vehicleResult=$.parseJSON(vehicleResult);		 
		  $(".type .type_message").text(vehicleResult.VehicleSize);
		  var city=vehicleResult.VehicleNum.substring(0,1); 
		  var num=vehicleResult.VehicleNum.substring(1,vehicleResult.VehicleNum.length);   
		  $(".plate .ico").text(city);
		  $(".plate .input").val(num);
		  $(".city .border").text(vehicleResult.City);		  
		  $(".engine .input").val(vehicleResult.MotorNum);
		  $(".shelf .input").val(vehicleResult.FrameNum);
		  //改变样式
		  $(".type_message").css("color","#1f1f1f");
		  $("#form .input").addClass("current");
	  }
 });
