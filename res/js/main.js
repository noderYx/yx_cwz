
$(function(){
	  $(".bj").width($("html").width()); //告诉背景宽度找谁
	  $(".bj").height($("html").height()); //告诉北京高度找谁
	  $(".zzc").height($("body").height());
	  $(".zzc").width($("body").width());
	  $(".zzc2").height($("body").height());
	  $(".zzc2").width($("body").width());
	  
	  $(".type").width($(".list").width()-57);
	  $(".form input").width($("dd").width()-12);	
	  $(".level1 input").width($(".level1").width()-12);  
	  $(".level2 input").width($(".level2").width()-12);
	  $(".submit a").width($(".submit").width());
	  $(".messagebj").css("opacity","0.5");
	  $(".adbj").css("opacity","0.7");
	  $(".zzc").css("opacity","0.8");
	  
	});
	//表格边框  1                               为什么要这么加边框呢？？？直接css样式里面加不好吗？？？？
$(function(){	 
        var $js_footer_top=$("#js_footer_top");
        var $js_iphone=$("#js_iphone");
        var $js_android=$("#js_android");
        if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
            $(".ranking span.s4").width($(".ranking span.s4").width());
        }
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if(isAndroid) {
            $(".ranking span.s4").width($(".ranking span.s4").width()+2);
        }
		
	 $(".ranking span.s1").width($(".ranking span.s1").width()-1);
	 $(".ranking span.s2").width($(".ranking span.s2").width()-1);
	 $(".ranking span.s3").width($(".ranking span.s3").width()-1);	 
	 $(".ranking>div.rklist:last>span").css("border-bottom","none");
	 $(".details li:last").css("border-bottom","solid 1px #d5d5d5");
	 $(".ranking .current").click(function(){
		   if($(".details").is(":hidden"))
		   {
			  $(this).next(".details").slideDown(0); 
			  $("body,html").animate({scrollTop:$(this).next(".details").offset().top},300);
			    
		   }else
		   {
			  $(this).next(".details").slideUp(0); 
		   }
		 });
	});
	

//表单页模拟下拉列表2
$(function(){
	  $(document).bind("click",function(e){ 
			var target = $(e.target); 
			if(target.closest(".list .level").length == 0){ 	 
			  $(".list .level").slideUp(400); 
			} 
			if(target.closest(".level1 .level").length == 0){ 	 
			  $(".level1 .level").slideUp(400); 
			} 
			if(target.closest(".message").length == 0){ 	 
			  $(".message").fadeOut(200); 
			  $(".messagebj").fadeOut(200);
			} 
	   }) ;
	  $(".list").click(function(){
		    if($(this).find(".level").is(":hidden"))
			{
				$(".list .level").slideDown(400);
				$(".level1 .level").slideUp(400);
				
		    }else
			{
				$(".list .level").slideUp(400);
		    }
			event.stopPropagation();
			
		  });
	  $(".list .level a").click(function(){
		    $(".list .type").text($(this).text());
		  });
		  
	 
	});
//表单复选框选择

$(function(){
	  var num=1;
	  $(".seccess").click(function(){
		    if(num==0)
			{
				$(".checkbox").addClass("current");
				num=1;
		    }else
			{
				$(".checkbox").removeClass("current");
				num=0;
			}
		  });
	});
//横屏效果
window.onorientationchange=function(){
	   window.location.reload();
	};
//表单提示效果
	$(function ()
	{

	    $(".message_close a").click(function ()
	    {
	        $(".messagebj").fadeOut(200);
	        $(".message").fadeOut(200);
	        return false;
	    });
	    $(".submit a").click(function ()
	    {
	        var message = "";
	        var i = false; //0:表单提交出现问题 1：表单提交成功
	        var e = new Array("冀A", "冀B", "冀C", "冀D", "冀E", "冀F", "冀G", "冀H", "冀J", "冀R", "冀R", "冀T", "辽A", "辽B", "辽C", "辽D", "辽E", "辽F", "辽G", "辽H", "辽J", "辽K", "辽L", "辽M", "辽N", "辽P", "皖A", "皖B", "皖C", "皖D", "皖E", "皖F", "皖G", "皖H", "皖J", "皖K", "皖L", "皖N", "皖P", "皖Q", "皖R", "皖S", "苏A", "苏B", "苏C", "苏D", "苏E", "苏F", "苏G", "苏H", "苏J", "苏K", "苏L", "苏M", "苏N", "苏N", "鄂B", "鄂C", "鄂D", "鄂E", "鄂F", "鄂G", "鄂H", "鄂J", "鄂K", "鄂L", "鄂M", "鄂N", "鄂P", "鄂Q", "鄂R", "鄂S", "晋A", "晋B", "晋C", "晋D", "晋E", "晋F", "晋H", "晋J", "晋K", "晋L", "晋M", "吉A", "吉B", "吉C", "吉D", "吉E", "吉F", "吉G", "吉H", "吉J ", "吉K", "粤A", "粤B", "粤C", "粤F", "粤H", "粤J", "粤K", "粤L", "粤M", "粤N", "粤P", "粤Q", "粤R", "粤S", "粤T", "粤U", "粤V", "粤W", "粤X", "粤Y", "粤Z", "宁A", "宁B", "宁C", "宁D", "宁E", "京A", "京B", "京C", "京D", "京E", "京F", "京G", "京H", "京J", "京K", "京L", "京M", "京Y", "豫A", "豫B", "豫C", "豫D", "豫E", "豫F", "豫G", "豫H", "豫J", "豫K", "豫L", "豫M", "豫N", "豫P", "豫Q", "豫R", "豫S", "豫U", "黑A", "黑B", "黑C", "黑D", "黑E", "黑F", "黑G", "黑H", "黑J", "黑K", "黑L", "黑M", "黑N", "黑P", "黑R", "鲁A ", "鲁B", "鲁C", "鲁D", "鲁E", "鲁F", "鲁G", "鲁H", "鲁J", "鲁K", "鲁L", "鲁M", "鲁N", "鲁P", "鲁Q", "鲁R", "鲁S", "鲁U", "鲁Y", "浙A", "浙B", "浙C", "浙D", "浙E", "浙F", "浙G", "浙H", "浙J", "浙K", "浙L", "桂A", "桂B", "桂E", "桂F", "桂G", "桂H", "桂J", "桂K", "桂L", "桂M", "桂N", "桂P", "桂R", "蒙B", "蒙C", "蒙D", "蒙E", "蒙F", "蒙G", "蒙H", "蒙J", "蒙K", "蒙M　", "闽A", "闽B", "闽C", "闽D", "闽E", "闽F", "闽G", "闽H", "闽J", "闽K", "川A", "川B", "川C", "川D", "川F", "川H", "川J", "川K", "川L", "川M", "川Q", "川R", "川S", "川T", "川U", "川V", "川W", "川X", "川Z", "渝A", "渝B", "渝C", "渝F", "渝G", "渝H", "津A", "津B", "津C", "津D", "津E", "津F", "津G", "津H", "云A", "云A-V", "云C", "云D", "云E", "云F", "云G", "云H", "云J", "云K", "云L", "云M", "云N", "云P", "云Q", "云R", "云S", "湘A ", "湘B", "湘C", "湘D", "湘E", "湘F", "湘G", "湘H", "湘J", "湘K", "湘L", "湘M", "湘N", "湘U", "新A", "新B", "新C", "新D", "新E", "新F", "新G", "新H", "新J", "新K", "新L", "新M", "新N", "新P", "新Q", "新R", "赣A", "赣B", "赣C", "赣D", "赣E", "赣F", "赣G", "赣H", "赣J", "赣K", "赣L", "赣M", "甘A", "甘B", "甘C", "甘D", "甘E", "甘F", "甘G", "甘H", "甘J", "甘K", "甘L", "甘M", "甘N", "甘P", "陕A", "陕B", "陕C", "陕D", "陕E", "陕F", "陕G", "陕H", "陕J", "陕K", "陕V", "贵A", "贵B", "贵C", "贵D", "贵E", "贵F", "贵G", "贵H", "贵J", "青A", "青B", "青C", "青D", "青E", "青F", "青G", "青H", "藏A", "藏B", "藏C", "藏D", "藏E", "藏F", "藏G", "藏H", "藏J", "琼A", "琼B", "琼C", "琼D", "琼E", "沪A", "沪B", "沪C", "沪D", "沪R");
	        var f = true; //判断是否和数组匹配
	        for (var i1 = 0; i1 < e.length; i1++)
	        {

	            if ($(".level1 .focus").val() == e[i1])
	            {
	                f = false;
	            }
	        }

	        if ($("#realname").val() == "")
	        {
	            message += "请输入姓名<br>";
	            i = true;

	        } else if ($("#mobile").val() == "")
	        {
	            message += "请输入手机号码<br>";
	            i = true;

	        } else if ($("#mobile").val().length != 11)
	        {

	            message += "请输入11位手机号码<br>";
	            i = true;

	        } else if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($("#mobile").val())))
	        {

	            message += "请输入正确的手机号码格式<br>";
	            i = true;

	        } else if (f)
	        {
	            message += "请输入正确的车牌城市前缀<br>";
	            i = true;
	        } else if ($(".level2 .focuss").value == "" || ($(".level2 .focuss").val().length != 5))
	        {
	            message += "请输入正确的车牌号码<br>";
	            i = true;
	        } else if ($('#frameNum').val().length != 17)
	        {
	            message += "请输入17位车架号<br>";
	            i = true;
	        }
	        if (i)
	        {
	            $(".messagebj").fadeIn(200).click(function(){
					  $(".messagebj").fadeOut(200);
					  $(".message").fadeOut(200);
					});
	            $(".message").fadeIn(200);
	            $(".message_content").html(message);
	        } else
	        {
	            document.form1.submit();
	        }
	        return false;
	    });
	});
//表单点击提示文字消失
$(function(){
	  $(".focus").click(function(){
		     $('.hui').css('display','none');
		  });
	});	
//表单点击提示文字消失
$(function(){
	  $(".focuss").click(function(){
		     $('.huii').css('display','none');
		  });
	});	
//广告弹出效果
$(function(){
	  $(".ad").delay(2000).slideDown(300);
	  $(".ad .ad_close a").click(function(){
		    $(".ad").slideUp(300);
			return false;
		});
	});
//注册成功弹出盒
$(function(){	   
	$(".ad11").delay(2000).slideDown(300);
	  $(".ad11 .ad_close a").click(function(){
		    $(".ad11").slideUp(300);
			return false;
		}); 
	$(".admessage").css("display","block");
	   
	 });
	
//排名页面广告窗口
$(function(){
	  $(".ad1").delay(2000).slideDown(300);
	  $(".ad1 .ad_close a").click(function(){
		    $(".ad1").slideUp(300);
			return false;
		});
	});

	$(function ()
	{
	    //n=0 弹出广告，n=1  弹出返回活动首页 n=2 弹出我要参加和前十排行 n=3 弹出我的排行和前十排行 n=4 我要参加 n=5 前十名和活动首页 n=6 我的排名和活动首页 n=7 返回活动首页
	    if (join == 0)
	    {
	        $(".admessage").css("display", "block");
	        $(".button").css("display", "none");
	        $(".twobotton").css("display", "none");
	    } else if (join == 1)
	    {
	        $(".admessage").css("display", "none");
	        $(".button").css("display", "block");
	        $(".twobotton").css("display", "none");
	    } else if (join == 2)
	    {
	        $(".admessage").css("display", "none");
	        $(".button").css("display", "none");
	        $(".twobotton").css("display", "block");
	        $(".twobotton1").css("display", "none");
	    } else if (join == 3)
	    {
	        $(".admessage").css("display", "none");
	        $(".button").css("display", "none");
	        $(".twobotton").css("display", "none");
	        $(".twobotton1").css("display", "block");
	    } else if (join == 4)
        {
	        $(".admessage").css("display", "none");
	        $("#button").css("display", "none");
	        $("#button1").css("display", "block");
	        $("#twobotton").css("display", "none");
	        $("#twobotton1").css("display", "none");
	        
	    } else if (join == 5)
        {
	        $(".admessage").css("display", "none");
	        $("#button").css("display", "none");
	        $("#button1").css("display", "none");
	        $("#twobotton").css("display", "block");
	        $("#twobotton1").css("display", "none");
	        
	    } else if (join == 6)
        {
	        $(".admessage").css("display", "none");
	        $("#button").css("display", "none");
	        $("#button1").css("display", "none");
	        $("#twobotton").css("display", "none");
	        $("#twobotton1").css("display", "block");
	        
	    } else if (join == 7)
        {
	        $(".admessage").css("display", "none");
	        $("#button").css("display", "block");
	        $("#button1").css("display", "none");
	        $("#twobotton").css("display", "none");
	        $("#twobotton1").css("display", "none");
	        
	    }

	});
	$(function ()
	{
	    if (focus == 0)
	    {
	        $(".zzc").css("display", "block");
	        $(".twobotton a:first").click(function ()
	        {
	            $(".zzc").css("display", "block");
	            return false;
	        });
	        $(".twobotton a:eq(1)").click(function ()
	        {
	            $(".zzc").css("display", "block");
	            return false;
	        });
	    }
	    //n=0  关注弹出遮罩层，n=1  已关注 不弹出遮罩层
	    //这个是活动页面的遮罩关闭按钮的js
	    $(function ()
	    {
	        $(".top_zs_cha").click(function ()
	        {
	            $(".zzc").css("display", "none");
	        });
	    });
	})
	$(function ()
	{
		$(".twobotton_one>a").click(function(){
		if (reg == 0)
	        {
	        $(".zzc2").css("display", "block");
	        return false;
	        }
		})
	    
	})
	// 获得焦点的时候 消失下面的弹出窗口
	$(function ()
	{
	    $('.xiaoshi').focus(function ()
	    {
	        $('.ad1').css('display','none');
	    })
	});  
	$(function ()
	{
	    $('.xiaoshi').blur(function ()
	    {
	        $('.ad1').css('display','block');
	    })
	});

    $(function(){
	  $(".zzc2 img").click(function(){
		     $('.zzc2').css('display','none');
		  });
	});	