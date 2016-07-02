//扩展jquery获取url参数方法
(function ($) {
	$.getUrlParam = function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = decodeURI(window.location.search).substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
})(jQuery);

//获取地址栏里的省份和城市
$(function(){
	//获取rid、hdid、openi
	var weatherResult=$("#day_weather").val();
	var oilPriceResult=	$("#oilPriceResult").val();	
	//判断天气是否有信息
	var $area=$("#area");//城市
	var $prov=$("#prov");//省份
	if(weatherResult==""||weatherResult==undefined)
	{
		$("#weather").hide();
	}else{	  
	  var $iscarwash=$("#iscarwash");	
	//获取白天天气状况判断是否适于洗车
	  var day_weather=$("#day_weather").val();	
	  if(day_weather.indexOf("雨")>0||day_weather.indexOf("雪")>0)
	  {	  
		 $iscarwash.text("不适宜洗车");
	  }
	  $area.text($.getUrlParam('area'));
	  $prov.text($.getUrlParam('prov'));	
	}
	
	//判断油价是否有信息
	if(oilPriceResult==""||oilPriceResult==undefined)
	{		
		$("#oilprices").hide();
	}else
	{
	  var $p93=$("#p93");
	  var $p97=$("#p97");
	  //如果是北京或者上海转换油号	 
	  if($prov.text()=="北京"||$prov.text()=="上海")
	  {
		 $p93.text("92");
		 $p97.text("95");
	  }	 
	}
	
  });