var num=1;//选择城市限制

// 弹出盒样式
$(function(){
  //获取当前浏览器高度
  $("#weathercity").height($(window).height());
  //点击城市名称弹出盒
  $(".weathercity").click(function(){
	  var city=$(".weathercity #area").text();
	  var loca=$(".weathercity #prov").text();
	  $("#weathercity").animate({width:"100%"},300,function(){});
	  //显示当前城市
	  $(".currentcity>.city").text(city);
	  //并将当前城市显示在选择城市里
	  $(".locacity>div>font:contains("+city+")").prev().addClass("current");
	  var $a=$('<a href="#"><font>'+city+'</font><span>&nbsp;</span><span class="loca">'+loca+'</span></a>');
	  $(".chosentcity").append($a);
	  //删除已选城市
	  $(".chosentcity>a>span").on('click',function(){				
		 var text=$(this).parent().children("font").text();				
		 $(".locacity>div>font:contains("+text+")").prev().removeClass("current");
		 $(this).parent().remove();
	  }); 
	});
  //点击取消按钮关闭盒
  $(".reset").click(function(){
	  $("#weathercity").animate({width:"0"},300,function(){});
	  $(".locacity>div>font").prev().removeClass("current");
	  $(".province>ul").hide();
	  $(".province>div>span").removeClass("current");
	  $("#weathercity").scrollTop(0);
	  $(".chosentcity").empty();
	 });
});


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
				 $("#weathercity").scrollTop($(this).parent().position().top+$("#weathercity").scrollTop());
				})
			
		   }else
		   {
			 $(this).children("span").removeClass("current");
			 $(this).next("ul").slideUp(300);
		   }
		});
    //选择城市	
	$(".locacity").on('click',function(event){		
		 event.preventDefault();		 
		 var loca=$(this).find(".loca").text();//省份
		 var city=$(this).find("font").text();//城市
		 if($(this).children("div").children("span").hasClass("current"))
		 {
			$(this).children("div").children("span").removeClass("current");
			$("a:contains("+city+")").remove();			
			
	     }else{
			$(".locacity>div>span").removeClass("current");	
			$(".chosentcity").empty();			
			$(this).children("div").children("span").addClass("current");
			var $a=$('<a href="#"><font>'+city+'</font><span>&nbsp;</span><span class="loca">'+loca+'</span></a>');
			$(".chosentcity").append($a);
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
	
	//点击确定异步查询城市天气和油价并将省份和城市存入cookie	   
	$(function(){
	  $(".button .submit").click(function(){
		    if($(".chosentcity>a>font").length>0)
			{
		    $(".lodingboxbj,.loding").css("display","block");
			$("#weathercity").animate({width:"0"},300,function(){});					
			$.ajax({
			  type: 'get',
			  url: 'header',
			  dataType: 'json',			 
			  data: {
				     'area':$(".chosentcity>a>font").text(),
			         'prov':$(".chosentcity>a>span.loca").text(),
					 'radioid':$.getUrlParam('radioid'),
					 'hdid':$.getUrlParam('hdid'),
					 'openid':$.getUrlParam('openid')
					},
			  success:function(result){	
			    //城市省份存入cookie						    			   	    
			    $(".lodingboxbj,.loding").css("display","none");				
				$("#area").text($(".chosentcity>a>font").text());
				$("#prov").text($(".chosentcity>a>span.loca").text());
				$.cookie('area',$(".chosentcity>a>font").text());
			    $.cookie('prov',$(".chosentcity>a>span.loca").text());	
				$("#addvehicle>a").attr("href","addVehicle?hdid="+$.getUrlParam('hdid')+"&radioid="+$.getUrlParam('radioid')+"&openid="+$.getUrlParam('openid')+"&OldVehicleNum=&area="+$("#area").text()+"&prov="+$("#prov").text());	
				$(".locacity>div>font").prev().removeClass("current");
	            $(".chosentcity").empty();
				
				var $iscarwash=$("#iscarwash");//是否适宜洗车
				var $p93=$("#p93");//93
				var $p97=$("#p97");//97
				var $nighttemperature=$("#nighttemperature");//最高气温
				var $daytemperature=$("#daytemperature");//最低气温
				var $weatherstate=$(".weatherstate");//天气	
				var $p93yuan=$("#p93yuan");	
				var $p93jiao=$("#p93jiao");
				var $p93fen=$("#p93fen");
				var $p97yuan=$("#p97yuan");
				var $p97jiao=$("#p97jiao");
				var $p97fen=$("#p97fen");	
				//获取白天天气状况判断是否适于洗车	
				$weatherstate.text(result.weatherResult.day_weather);						
				$nighttemperature.text(result.weatherResult.night_air_temperature);
				$daytemperature.text(result.weatherResult.day_air_temperature);
				$p93yuan.text(result.oilPriceResult.p93yuan);
				$p93jiao.text(result.oilPriceResult.p93jiao);
				$p93fen.text(result.oilPriceResult.p93fen);
				$p97yuan.text(result.oilPriceResult.p97yuan);
				$p97jiao.text(result.oilPriceResult.p97jiao);
				$p97fen.text(result.oilPriceResult.p97fen);
				if($weatherstate.text().indexOf("雨")>0||$weatherstate.text().indexOf("雪")>0)
				{	  
				   $iscarwash.text("不适宜洗车");
				}else
				{
				   $iscarwash.text("适宜洗车");
				}
				if($("#prov").text()=="北京"||$("#prov").text()=="上海")
				{
				   $p93.text("92");
				   $p97.text("95");
				}else
				{
				   $p93.text("93");
				   $p97.text("97");
				}
			  }			
			});	
			}
		  });
		});
	
	//删除车辆
	$("#Illegallist .del").click(function(){		 
		 $(".errorboxbj,.errorbox").css("display","block");
		 $(".errorbox .submit,.errorbox .reset").css("display","block");
		 $(".errorbox .determine").css("display","none");
		 var vehiclenum=$(this).attr("vehiclenum");
		 var $li=$(this).parent().parent().parent().parent();
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
				  contentType:'application/x-www-form-urlencoded; charset=utf-8',
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
							$li.remove();
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
});

//关注公众账号显示、会员显示功能
$(function(){
  var isfan=$("#isfan").val();
  var ismember=$("#ismember").val();
  $("#addvehicle a").unbind("click").click(function(){
	  if(isfan=="0")
	  {
		  $(".errorboxbj,.attention").css("display","block");			  
		  $(".attention a").unbind("click").click(function(){
			   $(".errorboxbj,.attention").css("display","none"); 
		  });
		  return false;
	  }
	  if(ismember=="0")
	  {
		   $(".errorboxbj,.errorbox").css("display","block");
		   $(".errorbox .submit,.errorbox .reset").css("display","none");
		   $(".errorbox_message").text("请注册成为会员，再参加活动哦！");
		   $(".errorbox .determine").css("display","block").text("注册会员").unbind("click").click(function(){
			   window.location.href="http://radio2.unitrue.com.cn/page/common/bind.aspx?radioid="+$.getUrlParam('radioid')+"&openid="+$.getUrlParam('openid')+"&redirect="+encodeURIComponent(location.href);
		   });
		   return false;
	  }	 
	});	 
});


