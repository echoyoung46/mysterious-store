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
  var canvas = new BannerCanvas('banner-canvas');
  canvas.init();
};

var BannerCanvas = function( _id ) {
  this.canvas = document.getElementById( _id );
  this.ctx = null;
  
  if ( this.canvas.getContext ) {
    this.ctx = this.canvas.getContext('2d');
  }
  
  var width = window.innerWidth,
      height = window.innerHeight;

	this.canvas.width = width;
	this.canvas.height = height;
  
  this.lines = [];
};

BannerCanvas.prototype = {
  init: function () {
    this.initLines();
  },
  initLines: function () {
    var self = this,
        count = 10;
    
    for (var i = 0; i < 10; i++) {
      self.lines.push({
        x: this.canvas.width + Math.random() * 100,
        y: this.canvas.height * Math.random(),
        length: (Math.random() + 1) * 150,
        lineW: (Math.random() + 1) * 3,
        speed: (Math.random() + 1) * 10
      });
    }
    
    self.startLineAnim();
  },
  startLineAnim: function () {
    var self = this,
        lines = self.lines;
    
    function render() {
      self.clearCanvas();
      for (var i = 0; i < lines.length; i++) {
         self.drawLines(lines[i].x, lines[i].y, lines[i].length, lines[i].lineW);
        lines[i].x -= lines[i].speed;
        
        if (lines[i].x < -lines[i].length) {
          self.lines.splice(i, 1);
          self.lines.push({
            x: self.canvas.width + Math.random() * 100,
            y: self.canvas.height * Math.random(),
            length: (Math.random() + 1) * 150,
            lineW: (Math.random() + 1) * 3,
            speed: (Math.random() + 1) * 20
          });  
        }
      }
      
      window.requestFrame(render);
    }
    
    render();
  },
  drawLines: function (_x, _y, _len, _lineWidth) {
    var self = this,
        ctx = self.ctx,
        deg = -10 * Math.PI / 180;
    
    ctx.save();
    ctx.rotate(-10*Math.PI/180);
    ctx.translate(_x, _y);
    ctx.beginPath();
		ctx.moveTo(-_len/2, 0);
		ctx.lineTo(_len/2, 0);
		ctx.lineWidth = _lineWidth;
		ctx.strokeStyle = "#0000ff";
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

		ctx.save();
    ctx.rotate(-10*Math.PI/180);
    ctx.translate(_x, _y);
    ctx.scale(4,.3);
		ctx.beginPath();
		var grd=ctx.createRadialGradient(0,0,0,0,0,20);
		grd.addColorStop(0,"rgba(255, 255, 255, .5)");
		grd.addColorStop(1,"rgba(255, 255, 255, 0)");
		ctx.arc(0, 0, 20, 0, 2*Math.PI);
		ctx.fillStyle = grd;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
    
  },
  translateToCenter: function () {
    var self = this,
        canvas = self.canvas,
        ctx = self.ctx,
        centerX = canvas.width / 2,
        centerY = canvas.height / 2;
    
    ctx.translate(centerX, centerY);
  },
  clearCanvas: function () {
    var self = this;
    self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
  }
};

window.onload = init;