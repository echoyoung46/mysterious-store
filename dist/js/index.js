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
  if($hasClass(el, className)){
    var reg = new RegExp("(\\s|^)?" + className +"(\\s|$)", "i");
    el.className = el.className.replace(reg, " ").replace(/^\s+|\s+$/,"");
  }
};
var $hasClass = function(el,className){
	var reg = new RegExp("(\\s|^)?" + className +"(\\s|$)", "i");
	return reg.test(el.className);
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
window.isMobile = function () {
  return !!navigator.userAgent.match(/android|webos|ip(hone|ad|od)|opera (mini|mobi|tablet)|iemobile|windows.+(phone|touch)|mobile|fennec|kindle (Fire)|Silk|maemo|blackberry|playbook|bb10\; (touch|kbd)|Symbian(OS)|Ubuntu Touch/i);
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
  if ( window.isMobile() ) {
    window.location.href = 'mobile.html';
  }else {
    $id('container').style.display = 'block';

    setTimeout(function() {
      var canvas = new BannerCanvas('banner-canvas');
    }, 2000);
    bindEvent();
  }
};

function getViewport(){
  if (document.compatMode == "BackCompat"){
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    }
  }else {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
  }
}

var bindEvent = function() {
  var $sideHeros = $id('side-heros'),
      sideFixPoint = 450,
      bannerHeight = $id('banner').clientHeight,
      heroHeight = $id('hero-1').clientHeight,
      footerOffsetHeight = $id('rule').offsetTop,
      viewSize = getViewport(),
      $body = document.body;

  var ieMode = document.documentMode;
  var isIE = !!window.ActiveXObject; 
  var isIE6 = isIE && !window.XMLHttpRequest; 
  
  $addEvent(window,'scroll', function(event) {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
        scrollHeight = document.documentElement.scrollHeight || document.body.scrollTop;
    
    if ( isIE6 ) {

      scrollTop > sideFixPoint ? $sideHeros.style.top = scrollTop + 100 + 'px' : $sideHeros.style.top = 550 + 'px';

    }else {
      
      scrollTop > sideFixPoint ? $addClass($sideHeros, 'fixed') : $removeClass($sideHeros, 'fixed');
      scrollTop > bannerHeight ? $addClass($body, 'fixed') : $removeClass($body, 'fixed');

    }

    var overHeight = scrollTop - bannerHeight * 2 / 3;
        currHero = overHeight < 0 ? 1 : Math.ceil(overHeight / heroHeight),
        currHeroDom = $id('side-hero-' + currHero)
        currSiblings = $id('side-heros').getElementsByTagName('a');
        
    for (var i = 0; i < currSiblings.length; i++) {
      if (currSiblings[i] !== currHeroDom) {
        $removeClass(currSiblings[i], 'active');
      }else {
        $addClass(currSiblings[i],'active');
      }
    }
  });

  $addEvent($id('to-top-btn'),'click', function() {
    backToTop();
  });
};

var backToTop = function () {
  document.documentElement.scrollTop = document.body.scrollTop = 0;
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
  
    var width = $id('container').clientWidth,
        height = $id('banner').clientHeight;

    this.canvas.width = width;
    this.canvas.height = height;
    
    this.lines = [];

    this.init();
  }
};

BannerCanvas.prototype = {
  init: function () {
    this.initLines();
  },
  initLines: function () {
    var self = this,
        count = 3;
    
    for (var i = 0; i < count; i++) {
      self.lines.push({
        x: this.canvas.width + Math.random() * 300,
        y: this.canvas.height * Math.random(),
        length: (Math.random() + 1) * 200,
        lineW: (Math.random() + 1) * 2,
        speed: (Math.random() + 1) * 5
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
      ctx.scale(3,.2);
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