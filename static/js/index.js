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
var $siblings = function(el) {
  var arr = [],
      allSiblings = el.parentNode.children;

  for (var i = 0; i < allSiblings.length; i ++) {
    if ( allSiblings[i] !== el ) {
      arr.push( allSiblings[i] );
    }
  }

  return arr;
}

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

  setTimeout(function() {
    canvas.init();
  }, 1400);

  bindEvent();
};

var bindEvent = function() {
  var $sideHeros = $id('side-heros'),
      sideFixPoint = 200,
      bannerHeight = $id('banner').clientHeight,
      heroHeight = $id('hero-1').clientHeight;
      
  $addEvent(window,'scroll', function() {
    var scrollTop = document.body.scrollTop;

    scrollTop > sideFixPoint ? $addClass($sideHeros, 'fixed') : $removeClass($sideHeros, 'fixed');

    var overHeight = scrollTop - bannerHeight * 2 / 3;
        currHero = overHeight < 0 ? 1 : Math.ceil(overHeight / heroHeight),
        currHeroDom = $id('side-hero-' + currHero)
        currSiblings = $id('side-heros').getElementsByTagName('a');
    
    console.log(currSiblings);
    for (var i = 0; i < currSiblings.length; i++) {
      if (currSiblings[i] !== currHeroDom) {
        $removeClass(currSiblings[i], 'active');
      }else {
        $addClass(currSiblings[i],'active');
      }
    }
    // $removeClass(currSiblings, 'active');
    // $addClass(currHeroDom,'active');
  });

  $addEvent($id('to-top-btn'),'click', function() {
    backToTop();
  });
};

var backToTop = function () {
  var d = document.body;
  window.onscroll=null;
  var timer = setInterval(function(){
    d.scrollTop -= Math.ceil(d.scrollTop * 0.1);
    if(d.scrollTop == 0) {
      clearInterval(timer);
    }
  },10);
};

var getElementViewTop = function ( _el ) {
  var actualTop = _el.offsetTop,
      elScrollTop = document.body.scrollTop;

  return actualTop - elScrollTop;
};

var BannerCanvas = function( _id ) {
  this.canvas = $id( _id );
  this.ctx = null;
  
  if ( this.canvas.getContext ) {
    this.ctx = this.canvas.getContext('2d');
  }
  
  var width = window.innerWidth,
      height = $id('banner').clientHeight;

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
        count = 5;
    
    for (var i = 0; i < count; i++) {
      self.lines.push({
        x: this.canvas.width + Math.random() * 300,
        y: this.canvas.height * Math.random(),
        length: (Math.random() + 1) * 150,
        lineW: (Math.random() + 1) * 2,
        speed: (Math.random() + 1) * 15
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
        lines[i].speed += 0.1;
        lines[i].x -= lines[i].speed;
        
        if (lines[i].x < -lines[i].length) {
          self.lines.splice(i, 1);
          self.lines.push({
            x: self.canvas.width + Math.random() * 200,
            y: self.canvas.height * Math.random(),
            length: (Math.random() + 1) * 150,
            lineW: (Math.random() + 1) * 2,
            speed: (Math.random() + 1) * 15
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
        deg = -10 * Math.PI / 180,
        height = self.canvas.height;
        
    
    ctx.save();
    ctx.rotate(-8*Math.PI/180);
    ctx.translate(_x, _y);
    ctx.beginPath();
		ctx.moveTo(-_len/2, 0);
		ctx.lineTo(_len/2, 0);
		ctx.lineWidth = _lineWidth;
    var lineGrd = ctx.createLinearGradient(0, 0, _len, 0);
    var opacity = _y / height;
		lineGrd.addColorStop(0,'rgba(145, 83, 254, ' + opacity.toFixed(2) + ')');
		lineGrd.addColorStop(1,'rgba(146, 83, 254, ' + opacity.toFixed(2) + ')');
		ctx.strokeStyle = lineGrd;
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

    if ( _y > height / 2 ) {
      ctx.save();
      ctx.rotate(-8*Math.PI/180);
      ctx.translate(_x, _y);
      ctx.scale(3,.1);
      ctx.beginPath();
      var circleGrd = ctx.createRadialGradient(0,0,0,0,0,20);
      circleGrd.addColorStop(0,"rgba(255, 255, 255, .5)");
      circleGrd.addColorStop(1,"rgba(255, 255, 255, 0)");
      ctx.arc(0, 0, 20, 0, 2*Math.PI);
      ctx.fillStyle = circleGrd;
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
    
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