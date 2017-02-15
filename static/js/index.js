var $id = function(id){
	return document.getElementById(id);
};
var $addEvent = (function(){
	if(document.addEventListener){
		return function(el,type,fn){
			if(el.length){
				for(var i=0;i< el.length;i++){
					$addEvent(el[i],type,fn);
				}
			}else{
				el.addEventListener(type,fn,false);
			}
		};
	}else{
		return function(el,type,fn){
			if(el.length){
				for(var i=0;i < el.length;i++){
					$addEvent(el[i],type,fn);
				}
		}else{
				el.attachEvent('on'+type,function(){
					return fn.call(el,window.event);
				});
			}
		};
	}
})();
var $addClass = function(el,className){
	if(!$hasClass(el, className)){
		return el.className = el.className == ''?className : el.className + ' ' + className;
	}
};
var $removeClass = function(el,className){
	var reg = new RegExp("(\\s|^)?" + className +"(\\s|$)", "i");
	el.className = el.className.replace(reg, " ").replace(/^\s+|\s+$/,"");
};
var $hasClass = function(el,className){
	var reg = new RegExp("(\\s|^)?" + className +"(\\s|$)", "i");
	return reg.test(el.className);
};
var $eTarget = function(e){
	return document.all ? window.event.srcElement : e.target;
};

window.requestFrame = (function(){
  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();
window.cancelFrame = (function(){
  return  window.cancelAnimationFrame       ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame    ||
    function( callback ){
    window.clearTimeout(callback, 1000 / 60);
  };
})();

var init = function () {
  initCanvas();
};

var initCanvas = function () {
  var canvas = document.getElementById('banner-canvas'),
      ctx = canvas.getContext('2d'),
      width = window.innerWidth,
      height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;
      
	var drawLine = function(x, y, len) {
		
		ctx.save();
		ctx.translate(width/2, height/2);
		ctx.beginPath();
		ctx.moveTo(-len/2, 0);
		ctx.lineTo(len/2, 0);
		ctx.lineWidth=10;
		ctx.strokeStyle="#0000ff";
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

		ctx.save();
		ctx.translate(width/2, height/2);
		ctx.scale(4,.5);
		ctx.beginPath();

		var grd=ctx.createRadialGradient(0,0,0,0,0,20);
		grd.addColorStop(0,"rgba(255, 255, 255, .5)");
		grd.addColorStop(1,"rgba(255, 255, 255, 0)");
		ctx.arc(0, 0, 20, 0, 2*Math.PI);
		ctx.fillStyle=grd;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	};

	var clearCanvas = function() {
		ctx.clearRect(0, 0, width, height);
	};

	drawLine(width/2, height/2, 200);
};

window.onload = init;