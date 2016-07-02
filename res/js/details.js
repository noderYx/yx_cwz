//扩展jquery获取url参数方法
(function ($) {
	$.getUrlParam = function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = decodeURI(window.location.search).substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
})(jQuery);

//匹配分享进来的用户是否是本人,不是本人按钮显示“我要查询”，编辑和删除按钮隐藏
$(function(){
	  var urlopenid=$.getUrlParam('openid');
	  var useropenid=$("#openid").val();
	  if(urlopenid!=useropenid)
	  {
		  $(".button .back").text("我要查询");
		  $(".plate .edit,.plate .del").css("display","none");
      }
	});

// 选项卡功能
$(function(){
	  $(".detailed_nav li").click(function(){		  
		   $(this).addClass("current").siblings().removeClass("current");
		   $(".detailed_message:eq("+$(this).index()+")").css("display","block").siblings(".detailed_message").css("display","none"); 
		  });
	  //删除车辆
	$(".plate .del").click(function(){		 
		 $(".errorboxbj,.errorbox").css("display","block");
		 $(".errorbox .submit,.errorbox .reset").css("display","block");
		 $(".errorbox .determine").css("display","none");
		 var vehiclenum=$.getUrlParam('VehicleNum');		
		 $(".errorbox_message").text("是否删除"+vehiclenum+"？");
		 $(".errorbox .submit").unbind("click").click(function(){
			   $(".lodingboxbj,.loding").css("display","block");
			   $(".errorboxbj,.errorbox").css("display","none");
			   $.ajax({
				   type:"GET",
				   url:"deleteVehicle",
				   data:{
					   'radioid':$.getUrlParam('radioid'),
					   'hdid':$.getUrlParam('hdid'),
					   'openid':$.getUrlParam('openid'),
					   'VehicleNum':vehiclenum
					   },
				   contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				   success: function(date){					   		    
					    $(".lodingboxbj,.loding").css("display","none");
					    if(date=="error")
						{
							$(".errorboxbj,.errorbox").css("display","block");
		                    $(".errorbox .submit,.errorbox .reset").css("display","none");
		                    $(".errorbox .determine").css("display","block");
							$(".errorbox_message").text("删除出现错误，请重新操作。");
						}else if(date=="success")
						{
							window.location.href="index?hdid="+$.getUrlParam('hdid')+"&radioid="+$.getUrlParam('radioid')+"&openid="+$.getUrlParam('openid');
						}
					  },
					error: function(){
						$(".lodingboxbj,.loding").css("display","none");
						$(".errorboxbj,.errorbox").css("display","block");
						$(".errorbox .submit,.errorbox .reset").css("display","none");
						$(".errorbox .determine").css("display","block");
						$(".errorbox_message").text("删除出现错误，请重新操作。");
						}
				});
			 });
		});
	  //隐藏小消息盒子
	  $(".errorboxbj,.errorbox_button .reset").click(function(){			
			$(".errorboxbj,.errorbox").css("display","none");			
	  });	
	})
	
	