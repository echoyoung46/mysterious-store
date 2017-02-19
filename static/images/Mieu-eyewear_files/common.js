/**
 * Created by songr on 2016/12/14.
 */
/** 设置按钮样式 */
function setBtnStatus(obj, objInHtml, type)
{
  if (type == 'disabled') {
    obj.addClass("disabled");
    obj.attr("disabled", "disabled");
  } else {
    obj.removeClass("disabled");
    obj.removeAttr("disabled");
  }
  if (objInHtml) {
    obj.html(objInHtml);
  }
}
/**
 * 发送ajax post 请求
 * @param url
 * @param data
 * @param callback
 */
function postData(url,data,callback)
{
  $.post(url, data, function(json){
    if ( typeof callback == 'function' ) callback(json);
  }, 'json').fail(function(code, info){
    if ( typeof callback == 'function' ) callback({'ret':1, 'errorcode':'99999', 'succ':1, 'msg':'服务器繁忙，请稍后再试~'});
  });
  return;
}

/**
 * 判断变量是否存在
 * @param variable
 * @returns {boolean}
 */
function isset(variable)
{
  if(typeof variable === "undefined") {
    return false;
  }
  return true;
}

Array.prototype.in_array = function(e)
{
  for(var i=0;i<this.length;i++)
  {
    if(this[i] == e)
      return true;
  }
  return false;
}

/**
 * 头部透明变化
 */

!(function(){
  var scrollDt = null;
  $(window).scroll(function () {
    // console.log($(window).scrollTop())
    clearTimeout(scrollDt);
    scrollDt = setTimeout(function () {
      if($(window).scrollTop() > 10){
        $('.navbar').fadeTo(500,0.9);
      }else{
        $('.navbar').fadeTo(500,1);
      }
    },100);

  });


})();

window.isMac = function () {
    return navigator.platform.indexOf('Mac') !== -1;
};

if ( window.isMac() ) {
  $('html').addClass('mac');
}


