/* 
  微信JS SDK初始化
  本函数适用于大多数页面（只需要使用分享功能的情况），调用页面中必须声明一个名为WxShareData的全局对象：

  var WxShareData = {
    url: Ut.genShareUrl(),
    title: '分享标题',
    desc: '分享内容说明',
    image: '图标地址'
  }

  如果需要调用微信js api的高级功能，请使用其他代码
*/
function initWxJS() {
  if (typeof WxShareData == "undefined") return;
  if (typeof Ut == "undefined") return;

  var radioid = Ut.queryString('radioid');
  var myurl = "http://radio2.unitrue.com.cn/service/sys/get_wxjs_sign.aspx?target=" + encodeURIComponent(location.href)
    + "&radioid=" + radioid;

  // 从主服务器获取当前页面的微信js签名，并完成配置
  $.getJSON(myurl, function (rsp) {
    alert(rsp);

    if (rsp.result != 'ok') {
      alert("获取微信JS签名出错: " + rsp.result);
      return;
    }

    //alert(rsp.result);

    wx.config({
      debug: false,               // debug=true时，若调用js api出错，页面会alert出错信息
      appId: rsp.appid,           // 必填：签名会使用该appid对应获取的jsapi ticket
      timestamp: rsp.timestamp,   // 必填：生成签名的时间戳
      nonceStr: rsp.nonceStr,     // 必填：生成签名的随机串
      signature: rsp.signature,   // 必填：签名，由jsapi ticket，noncestr，timestamp，url运算得到
      jsApiList: [
          'onMenuShareTimeline',      // 分享：朋友圈
          'onMenuShareAppMessage',    // 分享：朋友
          'onMenuShareQQ',            // 分享：QQ
          'onMenuShareWeibo',         // 分享：腾讯微博
        ]
    });
  });

  /*
  $.ajax({
    url: myurl,
    data: '',
    dataType: 'json',
    success: function (rsp) {
      if (rsp.result != 'ok') {
        alert("获取微信JS签名出错: " + rsp.result);
        return;
      }

      wx.config({
        debug: false,               // debug=true时，若调用js api出错，页面会alert出错信息
        appId: rsp.appid,           // 必填：签名会使用该appid对应获取的jsapi ticket
        timestamp: rsp.timestamp,   // 必填：生成签名的时间戳
        nonceStr: rsp.nonceStr,     // 必填：生成签名的随机串
        signature: rsp.signature,   // 必填：签名，由jsapi ticket，noncestr，timestamp，url运算得到
        jsApiList: [
          'onMenuShareTimeline',      // 分享：朋友圈
          'onMenuShareAppMessage',    // 分享：朋友
          'onMenuShareQQ',            // 分享：QQ
          'onMenuShareWeibo',         // 分享：腾讯微博
        ]
      });

      alert('appid: ' + rsp.appid + ", sign: " + rsp.signature);
    },
    error: function () {
      alert("获取微信JS签名出错: " + myurl);
    }
  });    // end ajax
  */

  wx.ready(function () {
    var shareData = {
      title: WxShareData.title,
      desc: WxShareData.desc,
      link: WxShareData.url,
      imgUrl: WxShareData.image
    };

    wx.onMenuShareAppMessage(shareData);
    wx.onMenuShareTimeline(shareData);
  });

  wx.error(function (res) {
    alert('微信网页JS接口异常：' + res.errMsg);
  });
}
