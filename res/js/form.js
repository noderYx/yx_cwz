var isvechicle=0;//是否相同车辆
var VehicleNum="";//车牌照

//异步调用查已有车牌
function isVechicle(){ 
  if(VehicleNum.length>=7&&$.getUrlParam('OldVehicleNum')=="")
  {	       
	var json={};
	json.hdid = $.getUrlParam('hdid');
	json.radioid = $.getUrlParam('radioid');			
	json.openid = $.getUrlParam('openid');
	json.VehicleNum =VehicleNum;							
	$.ajax({
		type: 'GET',
		url: "CK",
		data: json,
		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
		success: function(date){					
			if(date=="you")
			{					  
			   isvechicle=1;
			   $(".errorboxbj,.errorbox").css("display","block");
			   $(".errorbox_message").text("您已经有相同的车牌号");	
			}else
			{
				isvechicle=0;			  
			}
		 }			  
	});
  } 
}		

//扩展jquery获取url参数方法
(function ($) {
	$.getUrlParam = function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = decodeURI(window.location.search).substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
})(jQuery);

//初始化
$(function(){
	  $(".licensebox_box").width($(window).width());
	  $(".licensebox_box").height($(window).height());
	  if($.getUrlParam('area')!="")
	  {
	   $(".city .border").text($.getUrlParam('area'));
	  }
	  //判断是否是编辑如果是改变文字内容
     if($.getUrlParam('OldVehicleNum')!="")
	 {
		 $(".but .submit").text("修改查询");
	 }
	  //获取选择省份显示显示相应文字
	    var where = new Array(31);
			function comefrom(prov,sprov) { this.prov = prov; this.sprov = sprov;}	
			where[0]=new comefrom("北京","京");
			where[1]=new comefrom("天津","津");
			where[2]=new comefrom("重庆","渝");
			where[3]=new comefrom("上海","沪");
			where[4]=new comefrom("河北","冀");
			where[5]=new comefrom("山西","晋");
			where[6]=new comefrom("辽宁","辽");
			where[7]=new comefrom("吉林","吉");
			where[8]=new comefrom("黑龙江","黑");
			where[9]=new comefrom("江苏","苏");
			where[10]=new comefrom("浙江","浙");
			where[11]=new comefrom("安徽","皖");
			where[12]=new comefrom("福建","闽");
			where[13]=new comefrom("江西","赣");
			where[14]=new comefrom("山东","鲁");
			where[15]=new comefrom("河南","豫");
			where[16]=new comefrom("湖北","鄂");
			where[17]=new comefrom("湖南","湘");
			where[18]=new comefrom("广东","粤");
			where[19]=new comefrom("海南","琼");
			where[20]=new comefrom("四川","川");
			where[21]=new comefrom("贵州","贵");
			where[22]=new comefrom("云南","云");
			where[23]=new comefrom("陕西","陕");
			where[24]=new comefrom("甘肃","甘");
			where[25]=new comefrom("青海","青");
			where[26]=new comefrom("内蒙古","蒙");
			where[27]=new comefrom("广西","桂");
			where[28]=new comefrom("宁夏","宁");
			where[29]=new comefrom("新疆","新");
			where[30]=new comefrom("西藏","藏");
			
			var prov=$.getUrlParam('prov');
			for(var i=0;i<where.length;i++)
            {
				if(where[i].prov==prov)
		        {					
					$(".plate .ico").text(where[i].sprov);
				}
			}
	})
	
$(function(){
	  // 车辆类型显示 
	  $(".type").click(function(){
		    $(".select").stop(false,true).slideToggle(300);
			$(".select>li").click(function(event){
				  event.stopPropagation();
				  $(".type_message").text($(this).text()).css("color","#1f1f1f");
				  $(".select").slideUp(300);
				});
	  });
	  
	  //车牌选择
	  $(".plate .ico").click(function(){
		$(".errorboxbj,.platebox").css("display","block");
		$(".platebox_message a:contains("+$(this).text()+")").addClass("current").siblings().removeClass("current");	
		//点击链接变色
		$(".platebox_message a:not(.determine)").click(function(){
		  $(this).addClass("current").siblings().removeClass("current");
		});	
		//点击确定后将文字赋给ico
		$(".platebox_message a.determine").click(function(){		  			
			$(".plate .ico").text($(".platebox_message a.current").text());
			$(".errorboxbj,.platebox").hide();
			VehicleNum=$(".plate .ico").text()+$(".plate .input").val();
			isVechicle();
			});	
		//点击背景关闭盒子  
		$(".errorboxbj").click(function(){
			$(".errorboxbj,.platebox").hide();
			});
	  });
	  
	  //车辆单行文本样式转化	 
	  $("#form .input").focus(function(){
		  var def=$(this).attr("default");
		  var val=$(this).val();
		  if(def==val)
		  {
			  $(this).val("").addClass("current");
		  }
		 }).blur(function(){
		  var def=$(this).attr("default");		  
		  var val=$(this).val(); 
		  if(val=="")
		  {
			 $(this).val(def).removeClass("current");
		  }
		});
	});
	
var num=5;//选择城市限制

// 弹出盒样式
$(function(){
  //获取当前浏览器高度
  $("#city").height($(window).height());
  //点击城市名称弹出盒
  $(".city").click(function(){
	  $("#city").animate({width:"100%"},300,function(){});
	  //显示当前城市
	  if($(".city .border").text()!="(最多选择5个城市)")
	  {
		  $(".currentcity>.city").text($(".city .border").text());
		  //并将当前城市显示在选择城市里
		  var arr=$(".city .border").text().split('、');
		  for(var i=0; i<arr.length;i++)
		  {
			$(".locacity>div>font:contains("+arr[i]+")").prev().addClass("current");
			var $a=$('<a href="#"><font>'+arr[i]+'</font><span>&nbsp;</span></a>');
			$(".chosentcity").append($a);
		  }	
	  }	 
	  
	  //删除已选城市
	  $(".chosentcity>a>span").on('click',function(){				
		 var text=$(this).parent().children("font").text();				
		 $(".locacity>div>font:contains("+text+")").prev().removeClass("current");
		 $(this).parent().remove();
	  });  
	});
  //点击取消按钮关闭盒
  $(".reset").click(function(){
	  $("#city").animate({width:"0"},300,function(){});
	  $(".locacity>div>font").prev().removeClass("current");
	  $(".province>ul").hide();
	  $(".province>div>span").removeClass("current");
	  $("#city").scrollTop(0);
	  $(".chosentcity").empty();
	  });
});

//返回按钮功能
$(function(){
	$(".butcenter .reset").click(function(){
		  $(this).attr("href","index?hdid="+$.getUrlParam('hdid')+"&radioid="+$.getUrlParam('radioid')+"&openid="+$.    getUrlParam('openid'));
		});
	})

//省份城市绑定
$(function(){
   var where = eval($("#PNResult").val()); 
   for(var i=0;i<where.length;i++)
    {			
	  if(where[i].area==""||where[i].area==undefined)
	  {		 
		  var $li=$("<li class='locacity'><div><span></span><font>"+where[i].prov+"</font><span class='loca'>"+where[i].prov+"</span></div></li>");	
		  $(".allcity_current").append($li);		
	  }else
	  {
		  var $li=$("<li class='province'><div><span></span>"+where[i].prov+"</div><ul></ul></li>");
		  $(".allcity_current").append($li);
		  var arr1=where[i].area.split('|');  	       
		  for(var b=1;b<arr1.length;b++)
		  {
			 var $li1=$("<li class='locacity'><div><span></span><font>"+arr1[b]+"</font><span class='loca'>"+where[i].prov+"</span></div></li>");			 
			 $li.children("ul").append($li1);
		  } 
	  }       
    }
    
	//点击弹出二级
	$(".province>div").on('click',function(event){
		   event.preventDefault();
		   if($(this).next("ul").is(":hidden"))
		   {			 
			 $(this).children("span").addClass("current").parent().parent().siblings(".province").children("div").children("span").removeClass("current");
			 $(this).next("ul").slideDown(300,function(){				
				 $(this).parent().siblings(".province").children("ul").slideUp(0);
				 $("#city").scrollTop($(this).parent().position().top+$("#city").scrollTop());
				})
			
		   }else
		   {
			 $(this).children("span").removeClass("current");
			 $(this).next("ul").slideUp(300);
		   }
		});
    //选择城市	
	$(".locacity").on('click',function(event){	
		 	 
		 var loca=$(this).find(".loca").text();//省份
		 var city=$(this).find("font").text();//城市
		 if($(this).children("div").children("span").hasClass("current"))
		 {
			
			$(this).children("div").children("span").removeClass("current");
			$("a:contains("+city+")").remove();			
			
	     }else{
			if($(".chosentcity a").length<num)
			{
			  $(this).children("div").children("span").addClass("current");			
			  var $a=$('<a href="#"><font>'+city+'</font><span>&nbsp;</span><span class="loca">'+loca+'</span></a>');
			  $(".chosentcity").append($a);			 
			}else
			{
				$(".errorboxbj,.errorbox").css("display","block");
				$(".errorbox_message").text("只能选" + num + "个城市");
			}
		 }
	 //删除已选城市
	  $(".chosentcity>a>span").on('click',function(){				
		 var text=$(this).parent().children("font").text();				
		 $(".locacity>div>font:contains("+text+")").prev().removeClass("current");
		 $(this).parent().remove();
	  }); 		 
	});
	
	//隐藏小消息盒子
	$(".errorboxbj,.errorbox_button .determine,.errorbox_button .reset").click(function(){
		  $(".errorboxbj,.errorbox").css("display","none");			
	});
	
	//将选择好的城市内容添加到前台盒子
	$(".button .submit").click(function(){		
		  var str="";
		  var num=$(".chosentcity a>font").length;
		  $(".chosentcity a>font").each(function(index,element) {
			if(index<num-1)
            str+=$(this).text()+"、";
			else
			str+=$(this).text();
        });
		if(str=="")
		{
		  $(".errorboxbj,.errorbox").css("display","block");
		  $(".errorbox_message").text("请选择城市");
	    }else
		{
		  $(".city .border").text(str);
		  //遍历删除已删除
		  $(".chosentcity>a>span").each(function(index, element) {
            var text=$(this).parent().children("font").text();				
		    $(".locacity>div>font:contains("+text+")").prev().removeClass("current");
		    $(this).parent().remove();
          });			
		  $("#city").animate({width:"0"},300,function(){});
		}
	});
	
	//弹出驾照提示图片
	$("#form .shelf .ico,#form .engine .ico").click(function(){
		  $(".errorboxbj,.licensebox").css("display","block");
		  $(".licensebox").click(function(){
            $(".errorboxbj,.licensebox").css("display","none");
		  });
		});
});

//表单提交验证功能
$(function(){	
	  $(".but .submit").click(function(){	
	        VehicleNum=$(".plate .ico").text()+$(".plate .input").val();	   	  
		    var json={};
			//车辆类型类型验证
			var vehicleSize=$(".type .type_message").text();
			if(vehicleSize=="选择您爱车的车型")
			{
				$(".errorboxbj,.errorbox").css("display","block");
		        $(".errorbox_message").text("请选择车辆类型");
				return;
			}else
			{
				json.VehicleSize=vehicleSize;
			}
			//车牌号验证
			if($(".plate .input").val()==$(".plate .input").attr("default"))
			{
				$(".errorboxbj,.errorbox").css("display","block");
		        $(".errorbox_message").text("车牌号不能为空");
				return;
			}else
			{
				vehicleNum=$(".plate .ico").text()+$(".plate .input").val();
				if(!/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(vehicleNum))
				{				  
				  $(".errorboxbj,.errorbox").css("display","block");
		          $(".errorbox_message").text("车牌号格式不正确");
				  return;
				}else
				{
					json.VehicleNum=vehicleNum;
				}
			}
			//查询城市验证
			var city=$(".city .border").text();
			if(city=="")
			{
				$(".errorboxbj,.errorbox").css("display","block");
		        $(".errorbox_message").text("请选择相应城市");
				return;
			}else
			{
				json.City=city;
			}
			//发动机号验证
			var motorNum=$(".engine .input").val();
			if(motorNum==$(".engine .input").attr("default"))
			{
				$(".errorboxbj,.errorbox").css("display","block");
		        $(".errorbox_message").text("发动机号不能为空");
				return;
			}else
			{
				json.MotorNum=motorNum;
			}
			//车架号验证
			var frameNum=$(".shelf .input").val();
			if(frameNum==$(".shelf .input").attr("default"))
			{
				$(".errorboxbj,.errorbox").css("display","block");
		        $(".errorbox_message").text("车架号不能为空");
				return;
			}else if(frameNum.length!=17)
			{
				$(".errorboxbj,.errorbox").css("display","block");
		        $(".errorbox_message").text("车架号应为17位");
				return;
			}else if(!/^[A-Z_0-9]{17}$/.test(frameNum))
			{
				$(".errorboxbj,.errorbox").css("display","block");
		        $(".errorbox_message").text("车架号格式不正确");
				return;				
			}else
			{
				json.FrameNum=frameNum;
			}
			
			json.hdid = $.getUrlParam('hdid');
			json.radioid = $.getUrlParam('radioid');			
			json.openid = $.getUrlParam('openid');
			json.OldVehicleNum =$.getUrlParam('OldVehicleNum');
		    json.nickname = $("#nickname").val();
            json.realname = $("#realname").val();
            json.mobile = $("#mobile").val();	
			//异步提交
			if($.getUrlParam('OldVehicleNum')=="")
			{ 
			  var json1={};
			  json1.hdid = $.getUrlParam('hdid');
			  json1.radioid = $.getUrlParam('radioid');			
			  json1.openid = $.getUrlParam('openid');
			  json1.VehicleNum =VehicleNum;							
			  $.ajax({
				  type: 'GET',
				  url: "CK",
				  data: json1,
				  contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				  success: function(date){					
					  if(date=="you")
					  {	
						 $(".errorboxbj,.errorbox").css("display","block");
						 $(".errorbox_message").text("您已经有相同的车牌号");	
					  }else
					  {						
						 $.ajax({
							type: 'POST',
							url: "saveVehicleInfo",
							data: json,
							contentType: 'application/x-www-form-urlencoded; charset=utf-8',
							success: function(date){					
								$(".lodingboxbj,.loding").css("display","none");
								if(date=="error")
								{
								   $(".errorboxbj,.errorbox").css("display","block");
								   $(".errorbox_message").text("提交出错，请重新输入");
								   $(".errorbox .determine").click(function(){
										window.location.reload();
								   });
								}else if(date=="success")
								{
									window.location.href="violateOneDetail?hdid="+json.hdid+"&radioid="+json.radioid+"&openid="+json.openid+"&VehicleNum="+vehicleNum+"&OldVehicleNum="+$.getUrlParam('OldVehicleNum');		
								}
							 },
							beforeSend:function(){
							  $(".lodingboxbj,.loding").css("display","block");
							}
						});		  
					  }
				   }			  
			  });
			}else
			{
				$.ajax({
				  type: 'POST',
				  url: "saveVehicleInfo",
				  data: json,
				  contentType: 'application/x-www-form-urlencoded; charset=utf-8',
				  success: function(date){					
					  $(".lodingboxbj,.loding").css("display","none");
					  if(date=="error")
					  {
						 $(".errorboxbj,.errorbox").css("display","block");
						 $(".errorbox_message").text("提交出错，请重新输入");
						 $(".errorbox .determine").click(function(){
							  window.location.reload();
						 });
					  }else if(date=="success")
					  {
						  window.location.href="violateOneDetail?hdid="+json.hdid+"&radioid="+json.radioid+"&openid="+json.openid+"&VehicleNum="+vehicleNum+"&OldVehicleNum="+$.getUrlParam('OldVehicleNum');		
					  }
				   },
				  beforeSend:function(){
					$(".lodingboxbj,.loding").css("display","block");
				  }
			  });		
		    }
		  });	
	});

//异步验证车牌信息
$(function(){
	 $(".plate input").blur(function(){//失去焦点是异步查询
	     VehicleNum=$(".plate .ico").text()+$(".plate .input").val();
		 //异步提交
		 isVechicle();		    
		 }); 
	});
