// 全局的工具函数库

var Ut = {
  /*
  从当前页面url中解析请求参数
  示例： var radioid = Ut.QueryString("radioid");
  */
  queryString: function (key) {
    return (document.location.search.match(new RegExp("(?:^\\?|&)" + key + "=(.*?)(?=&|$)")) || ['', null])[1];
  },

  /*
  删除url中包含的某个请求参数
  示例： var href = Ut.deleteParam(href, 'openid');
  */
  deleteParam: function (url, name) {
    var i = url;
    var reg = new RegExp("([&\?]?)" + name + "=[^&]+(&?)", "g")

    var newUrl = i.replace(reg, function (a, b, c) {
      if (c.length == 0) {
        return '';
      } else {
        return b;
      }
    });
    return newUrl;
  },

  /*
  从当前页面url地址中去除openid，comopenid参数，生成用于微信分享的地址
  示例： var share_url = Ut.genShareUrl();
  */
  genShareUrl: function () {
    var href = document.location.href;

    href = Ut.deleteParam(href, 'openid');
    href = Ut.deleteParam(href, 'comopenid');

    return href;
  },

  /*
  生成格式化的当前时间: yyyy-MM-dd HH:mm:ss
  示例： var str = Ut.now();
  */
  now: function () {

    // 将数字格式化为两位长度的字符串
    var fmtTwo = function (number) {
      return (number < 10 ? '0' : '') + number;
    }

    var date = new Date();

    var yyyy = date.getFullYear();
    var MM = fmtTwo(date.getMonth() + 1);
    var dd = fmtTwo(date.getDate());

    var HH = fmtTwo(date.getHours());
    var mm = fmtTwo(date.getMinutes());
    var ss = fmtTwo(date.getSeconds());

    return '' + yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;
  },

  /*
  生成一个 1 ~ K 的随机数
  示例： var num = Ut.random(100);
  */
  random: function (K) {
    return Math.ceil(Math.random() * K);
  }

};

if (typeof module != undefined && module.exports) {
  module.exports = Ut;
}