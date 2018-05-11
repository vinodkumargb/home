var basic=true;
var terminate=false;
var scope={};
var loaded=false;
var theme={
	dark:{
		lineClr:"#ffffff",
		txtClr:"#ffffff",
		bg:"src/img/1.jpg",
		bgSize:"cover",
		bgClr:"#333333",
		iconBg:"#333333",
		title:"dark"
	},
	blue:{
		lineClr:"cornflowerblue",
		txtClr:"white",
		bg:"src/img/blue1.jpg",
		bgSize:"unset",
		bgClr:"cornflowerblue",
		iconBg:"cornflowerblue",
		title:"blue"
	},
	green:{
		lineClr:"darkkhaki",
		txtClr:"white",
		bg:"src/img/green.jpg",
		bgSize:"cover",
		bgClr:"darkkhaki",
		iconBg:"darkkhaki",
		title:"green"
	},
	purple:{
		lineClr:"#C25996",
		txtClr:"purple",
		bg:"src/img/purple.jpg",
		bgSize:"cover",
		bgClr:"white",
		iconBg:"purple",
		title:"purple"
	},
	glass:{
		lineClr:"transparent",
		txtClr:"rgba(255,255,255,0.6)",
		bg:"src/img/glass.jpg",
		bgSize:"cover",
		bgClr:"white",
		iconBg:"transparent",
		title:"glass"
	}
}
window.addEventListener("resize",init);
function init(){
	if (window.matchMedia('(max-width: 1200px)').matches) {
		/* The viewport is less than, or equal to,  */
		clr();
		window.location.href = '../index.html';
	} else {
		/* The viewport is greater than */
		if(!loaded){
			loaded=true;
			initMain();
		}
	}
}

Math.rnd=function(n,bool){
	if(bool===false){
		return Math.ceil(Math.random()*n);
	}else{
		return Math.ceil(Math.random()*n)*(1-Math.round(Math.random()*2));
	}
}

function clr(){
	scope.banner.clean();
	scope.aboutMe.clean();
	scope.anim1.clean();
	scope.anim2.clean();
	scope.soft.clean();
	scope.contact.clean();
	scope.game.clean();
	scope.earth.clean();
}

function loadBgs(){
	for (var obj in theme){
		var o=theme[obj];
		var icon=$("<div class='themeIcon' title='"+o.title+"' style='float:right;height:10px;width:10px;background-color:"+o.iconBg+"' onclick='loadTheme("+'"'+o.title+'"'+")'></div>");
		$('<img/>').attr('src', o.bg).on('load', function() {
   			$(this).remove();
		});
	}
}

function addAudio(){
	var curAud=0;
	audFiles=["src/img/1.mp3","src/img/4.mp3","src/img/5.mp3","src/img/6.mp3","src/img/7.mp3","src/img/8.mp3","src/img/9.mp3","src/img/10.mp3","src/img/11.mp3"];
	var aud=initAudioVisual("audioId");
	aud.audio.src=audFiles[curAud];
	aud.audio.onended = function() {
	  playNext();
	};
	function playNext(){
	  //curAud++;
	  //if(curAud>=audFiles.length){
	  //	curAud=0;
	  //}
	  aud.audio.src=audFiles[Math.floor(Math.random()*audFiles.length)];
	  aud.audio.play();
	}
	playNext();
}

function loadTheme(thm){
	var t=theme[thm];
	if(thm==="glass"){
		$(".isGlass").each(function(){
			$(this).addClass("glass");
		});
		$(".rrbox").each(function(){
			$(this).css("background-color","transparent");
		});
		$(".resume").each(function(){
			$(this).removeClass("effect2");
		});
		$("#resBox1, #resBox2").addClass("glass");
		$("#resBox1, #resBox2").css("border-color","transparent");
	}else{
		$(".isGlass").each(function(){
			$(this).removeClass("glass");
		});
		$(".rrbox").each(function(){
			//$(this).css("background-color","black");
		});
		$(".resume").each(function(){
			$(this).addClass("effect2");
		});
		$("#resBox1, #resBox2").removeClass("glass");
		$("#resBox1, #resBox2").css("border-color","rgba(255,255,255,1)");
	}
	$(".rrbox").each(function(){
		$(this).css("border-color",t.lineClr);
	});
	$(".rrcircle").each(function(){
		$(this).css("border-color",t.lineClr);
	});
	$(".ln1").each(function(){
		$(this).css("border-color",t.lineClr);
		$(this).css("border-color",t.lineClr);
	});
	$(".ln2").each(function(){
		$(this).css("border-color",t.lineClr);
	});
	$("#cv").css("border-color",t.lineClr);
	$(".pic").each(function(){
		$(this).css("border-color",t.lineClr);
	});
	$(".themeIcon").each(function(){
		$(this).css("border-color",t.lineClr);
	});
	$(".hdr").each(function(){
		$(this).css("color",t.txtClr);
	});

	var newImg = new Image;
	newImg.onload = function() {
		$("#bgImg").fadeOut("slow","linear",function(){
			$("#bgImg").css("background-image","url('"+t.bg+"')");
			$("#bgImg").fadeIn("slow","linear");
		});
	}
	newImg.src = t.bg;
}

function createThemeIcons(){
	var i=0;
	for (var obj in theme){
		i++;
		var o=theme[obj];
		var icon=$("<div class='themeIcon' title='"+o.title+"' style='float:right;height:10px;width:10px;background-color:"+o.iconBg+"' onclick='loadTheme("+'"'+o.title+'"'+")'></div>");
		$("#themeIcons").append(icon);
	}
}

function initMain() {
	scope.util=util();
	if(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)){
		if(scope.util.getUrlVars()["basic"]==="true"){
			basic=true;	
		}else{
			basic=false;
		}
	}
	var thm="dark";
	setTimeout(function(){loadTheme(thm);},1000);
    $(function() {
        $('.lazy').Lazy();
    });
	$(".do-nicescrol").niceScroll();
	
	scope.util.speedTest();
	scope.banner=banner();
	scope.banner.init("cv","canvas-container");
	scope.aboutMe=aboutMe();
	scope.aboutMe.init();
	if(!basic){
		if(Math.random()>0.5){
			scope.initBirds=initBirds2("aboutMeBg");
		}else{
			scope.initBirds=initBirds1("aboutMeBg");
		}
		scope.abtVisible=true;
		aboutMeAnimFunc();
	}
	scope.soft=soft();
	scope.soft.init();
	scope.game=game();
	scope.game.init();
	scope.resume=resume();
	if(!basic){
		scope.earth=earth();
		scope.earth.init();
		scope.earth.pause();
		$(".contact").each(function(){
			$(this).addClass("contactBg");
		});
	}
	scope.contact=contact();
	scope.contact.init();
	if(basic){
		$("#cntForm").addClass("cntAnim");
		animBg("cntForm");
	}else{
		$("#cntForm").removeClass("cntAnim");
	}
	scope.boxAnim=boxAnim();
	loadBgs();
	createThemeIcons();
	scrollControl();
	
	$('<img/>').attr('src', theme[thm].bg).on('load', function() {
		$(this).remove(); // prevent memory leaks as @benweet suggested
		$("#standardContent").fadeIn();
		$("#preloader").fadeOut();
		addAudio();
	});
}

function banner(){
	var canvas;
	var stg;
	var w;
	var h;
	var captureContainer;
	var arrDrops=[];
	var isMouseIn=false;
	var shift=1;
	var magnet=true;
	var magnetPow=1;//100 max
	var magnetRad=100;
	var explode = [];
	var itms=[];
	var delayMax=1000;
	var speedMin=0.5;//0>x<1
	var maxSize=1;
	var minSize=0;
	var drpSize=1;
	var rndClr=true;
	var dropClr="#ff0000";
	var rndSize=true;

	function init(canvasId,canvasContainerId){
		stg = new createjs.Stage(canvasId);
		canvas = document.getElementById(canvasId);
		$(canvas).on("mousemove", function(e){
			isMouseIn=true;
		});
		$(canvas).on("mouseout", function(e){
			isMouseIn=false;
		});
		
		context = canvas.getContext('2d');
		w=$("#"+canvasContainerId).width();
		h=$("#"+canvasContainerId).height();
		//cropIt(context,"rect",w,h);
		context.globalCompositeOperation = 'source-over';
		context.fillStyle = 'rgba(0,0,0,0.05)';
		context.fillRect(0,0,w,h);
		txt1();
		captureContainer = new createjs.Container();
		captureContainer.cache(0, 0, w, h);
		stg.addChild(captureContainer);
		captureContainer.compositeOperation
		stg.enableMouseOver(20);
		stg.on("mouseover", function(e){
			isMouseIn=true;
			});
		stg.on("mouseout", function(e){
			isMouseIn=false;
			});
		clear();
		play();
	}
	function clear(){
		createjs.Ticker.removeEventListener("tick", run);
		for(var i=0;i<arrDrops.length;i++){
			captureContainer.removeChild(arrDrops[i].shape);
		}
		arrDrops=[];
	}
	function play(){
		var drops=100;
		if(basic){
			drops=50;
		}
		for(var i=0;i<drops;i++){
			var drp=createDrop(Math.random()*w,-10);
			arrDrops.push(drp);
			captureContainer.addChild(drp.shape);
		}
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.addEventListener("tick", run);
	}
	function toggleRun(){
		if(createjs.Ticker.paused){
			createjs.Ticker.paused = false;
		}else{
			createjs.Ticker.paused = true;
		}
	}
	function playAnim(){
		createjs.Ticker.paused = false;
	}
	function pauseAnim(){
		createjs.Ticker.paused = true;
	}
	function run(event){
		if (!event.paused) {
			for(var i=0;i<arrDrops.length;i++){
				if(doesExplode(arrDrops[i])){
					bombExplode(arrDrops[i].x,arrDrops[i].y,arrDrops[i].clr);
					captureContainer.removeChild(arrDrops[i].shape);
					//arrDrops[i].shape.uncache();
					arrDrops[i].shape=null;
					var drp=createDrop(Math.random()*w,-10);
					captureContainer.addChild(drp.shape);
					arrDrops[i]=drp;
				}
				if(arrDrops[i].delay>arrDrops[i].delayCount){
					arrDrops[i].delayCount++;
				}else{
					if(magnet && isMouseIn){
						if(Math.abs(stg.mouseX-arrDrops[i].x)<magnetRad && Math.abs(stg.mouseY-arrDrops[i].y)<magnetRad){
							arrDrops[i].x=arrDrops[i].x+((magnetPow*(stg.mouseX-arrDrops[i].x))/100);
							arrDrops[i].shape.x=arrDrops[i].x;
						}
					}
					arrDrops[i].y+=arrDrops[i].speedInv+((shift*arrDrops[i].opacity)/100);
					arrDrops[i].shape.y=arrDrops[i].y;
				}
			}
			//captureContainer.addChild(border(w,h));
			captureContainer.updateCache();
			stg.update(event);
		}
	}
	function doesExplode(arrDrop){
		if(arrDrop.y>h){
			return true;
		}
		for(var i=0;i<itms.length;i++){
			var pt = arrDrop.shape.localToLocal(0, 0, itms[i]);
			if(itms[i].hitTest(pt.x, pt.y)){
				return true;
			}
		}
		return false;
	}
	function createDrop(x,y){
		if(rndSize){
			r=(Math.random()*(maxSize-minSize))+minSize;
		}else{
			r=drpSize;
		}
		if(rndClr){
			c="#"+(parseInt(Math.random()*(parseInt("ffffff", 16)))).toString(16);
		}else{
			c=dropClr;
		}
	
		return new drop(x,y,r,c);
	}
	function drop(x,y,r,c){
		var alpha=Math.random()*100;
		var shape = new createjs.Shape();
		shape.graphics.beginFill(c).drawCircle(0, 0, r);
		shape.x=x;
		shape.y=y;
		shape.alpha=alpha;
		//shape.snapToPixel = true;
		//shape.cache(0, 0, w, h);
		//shape.cache(-r, -r, r*2, r*2);
		//var blurFilter = new createjs.BlurFilter(2, 2, 1);
		/*
		var color = c.replace("#","0x");
		var alpha = 1;
		var blurX = 5;
		var blurY = 5;
		var strength = 1;
		var quality = 1;
		var inner = false;
		var knockout = false;
		_glowFilter = new createjs.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
		shape.filters = [_glowFilter];
		var bounds = blurFilter.getBounds();
		shape.cache(0, 0, w, h);
		*/
		var speedInv=maxSize-(maxSize/r); //Math.random();
		if(speedInv<speedMin){
			speedInv=speedMin;
		}
		return {
				x:x,
				y:y,
				clr:c,
				r:r,
				shape:shape,
				delay:parseInt(delayMax*Math.random()),
				speedInv:speedInv,
				delayCount:0,
				opacity:alpha
				};
	}
	function bombExplode(x, y, c) {
		var circle = new createjs.Shape();
		circle.graphics.beginFill("#ffffff").drawCircle(0, 0, 2);
		circle.x=x;
		circle.y=y;
		circle.alpha=0.5;
		stg.addChild(circle);
		//stg.update();
		explode.push(circle);
		createjs.Tween.get(circle, {
			loop: false
		}).to({
			scaleX:5,
			scaleY:5,
			alpha:0
		}, 100, createjs.Ease.getPowInOut(1)).call(function() {
			stg.removeChild(circle);
			explode = removeItem(explode, circle);
		})
	}
	function removeItem(arr, itm) {
		var nArr = [];
		for (var i in arr) {
			if (arr[i] !== itm) {
				nArr.push(arr[i]);
			}
		}
		return nArr;
	}
	function txt1(){
		var txt = new createjs.Text();
		txt.x = 500;
		txt.y = 230;
		txt.font = "50px Roboto";
		//txt.color = "#AD00FF";
		txt.color = "#F47000";//"#AD00FF";
		txt.text = "Vinodkumar G B";
		var blurFilter = new createjs.BlurFilter(0, 0, 0);
		var color = "0xF47000";
		var alpha = 0.2;
		var blurX = 3;
		var blurY = 3;
		var strength = 1;
		var quality = 1;
		var inner = false;
		var knockout = false;
		_glowFilter = new createjs.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
		txt.filters = [_glowFilter];
		txt.cache(0, 0, 600, 100);
		stg.addChild(txt);
		itms.push(txt);
	}
	function clean(){
		try{
			stg.removeAllEventListeners();
			stg.removeAllChildren();
			createjs.Ticker.removeAllEventListeners();
			$(canvas).off();
			context=null;
			captureContainer=null;
			stg.clear();
			stg=null;
		}catch(e){}
	}
	function isPlaying(){
		return !createjs.Ticker.paused;
	}
	return {
				init:init,
				toggleRun:toggleRun,
				clean:clean,
				play:playAnim,
				pause:pauseAnim,
				isPlaying:isPlaying
			}
}

function aboutMe(){
	if(basic){
		$("#aboutMe").css("background-image","url('src/img/bgn.png')");
	}else{
		//$("#aboutMe").css("background-image","url('src/img/Sequence 01.gif')");
		$("#aboutMe").css("background-image","url('src/img/bgn.png')");
	}
	function init(){
		var abtMe="<span><p>Hey!<br/>I am a computer programmer by profession. I pretty much work on any thing I can put my hands on! <br/>From HTML5 AngularJs Lua KDB Python to editing art work in Photoshop exporting in Premier and so on.<br />Passions? You mean other than watching movies, playing computer games and lying on bed.....<br/> Nothing much! ;)</p></span>";
		util().typeIt("aboutMe",abtMe,"",-1,false,function(){
														if(!basic){
															//scope.flicker=scope.util.flicker();
															//scope.flicker.init("aboutMe");
														}
													});
	}
	function clean(){
		try{
			scope.flicker.clean();
		}catch(e){}
	}
	return {
			init:init,
			clean:clean
			}
}

function util(){
	function typeIt(id,txt,s,count,skip,retFunc){
		count++;
		if(txt.length<count){
			retFunc();
			return;
		};
		var c=txt.charAt(count);
		s+=c;
		if(c==="<"){
			skip=true;
		}
		if(c===">"){
			skip=false;
		}
		if(!skip){
			$("#"+id).html(s);
		}
		setTimeout(typeIt,10,id,txt,s,count,skip,retFunc);
	}
	function cropIt(context,type,w,h){
		switch(type){
			case "rect":
				var p=w/10;
				context.beginPath();
				context.moveTo(p, 0);
				context.lineTo(w, 0);
				context.lineTo(w, h-p);
				context.lineTo(w-p, h);
				context.lineTo(0, h);
				context.lineTo(0, p);
				context.closePath();
				context.clip();
			break;
			case "other":
				context.beginPath();
				context.moveTo(10, 10);
				context.lineTo(100, 30);
				context.lineTo(180, 10);
				context.lineTo(200, 60);
				context.arcTo(180, 70, 120, 0, 10);
				context.lineTo(200, 180);
				context.lineTo(100, 150);
				context.lineTo(70, 180);
				context.lineTo(20, 130);
				context.lineTo(50, 70);
				context.closePath();
				context.clip();
			break;
		}
	}
	function border(w,h){
		var g = new createjs.Graphics()
		var brd = new createjs.Shape(g);
		var p=w/10;
		g.setStrokeStyle(0.3);
		g.beginStroke("#FFFFFF");
		g.moveTo(p, 0);
		g.lineTo(w, 0);
		g.lineTo(w, h-p);
		g.lineTo(w-p, h);
		g.lineTo(0, h);
		g.lineTo(0, p);
		g.lineTo(p, 0);
		return brd;
	}
	function createRect(x,y,w,h,clr,alpha,c){
		var alpha=1||alpha;//Math.random()*100;
		var shape = new createjs.Shape();
		shape.graphics.beginFill(clr).drawRect(0, 0, w, h);
		shape.x=x;
		shape.y=y;
		shape.clr=clr;
		shape.addEventListener("rollover", function(event) {
			event.target.graphics.clear().beginFill("rgb(255,150,0)").drawRect(0, 0, w, h).endFill();
			c.update();
		});
		//shape.addEventListener("rollout", function(event) {
			//event.target.graphics.clear().beginFill(event.target.clr).drawRect(0, 0, w, h).endFill();
			//c.update();
		//});
			
		//shape.alpha=alpha;
		//console.log(clr);
		return shape;
	}
	function rndClrFunc(){
		var clr=(parseInt(Math.random()*(parseInt("ffffff", 16)))).toString(16);
		while(clr.length<6){
			clr+="0";
		}
		return "#"+clr;
	}
	function anim(){
		var idd;
		var runAnim=true;
		var wt;
		var ht;
		function init(id,w,h){
			idd=id;
			wt=w;
			ht=h;
			$("#"+id).css("position","absolute");
			$("#"+id).css("display","block");
			//setTimeout(_anim,1000,id,w,h);
		}
		function render(){
			_anim(idd,wt,ht);
		}
		function _anim(id,w,h){
			var prop=[];
			var d=1000+Math.rnd(10000,false);
	
			//$("#"+id).animate({rotate: '+='+Math.rnd(60)+'deg', scale: '-='+Math.rnd(1)*Math.random(),left: "+="+Math.rnd(100),top: "+="+Math.rnd(100)},
			$("#"+id).animate({scale: '-='+Math.rnd(1)*Math.random(),left: "+="+Math.rnd(100),top: "+="+Math.rnd(100)},
			{
				step:function( now, fx ) {
					var sc=fx.elem.style.transform;
					var scx=0;
					if(sc.indexOf("scale")>=0){
						scx=parseInt(sc.substring(sc.indexOf("scale")+6,sc.indexOf(",",sc.indexOf("scale")+5)));
					}
					if(scx>2 || scx<0){
						$(fx.elem).css({ 
							transform: 'scale(2)',
							MozTransform: 'scale(2)',
							WebkitTransform: 'scale(2)',
							msTransform: 'scale(2)'
						})
					}
					switch(fx.prop){
						case ("top"):
							if(now<0){
								fx.end=100;
							}
							if(now+parseInt($(fx.elem).css("height"))>=h){
								fx.end=h-parseInt($(fx.elem).css("top"));
							}
						break;
						case ("left"):
							if(now<0){
								fx.end=100;
							}
							if(now+parseInt($(fx.elem).css("width"))>=w){
								fx.end=w-parseInt($(fx.elem).css("width"));
							}
						break;
					}	  
				},
				complete:function(){
						if(runAnim){
							setTimeout(_anim,Math.rnd(10000,false),id,w,h);
						}
					}
				},
				d
			);
		}
		function clean(){
			runAnim=false;
		}
		function play(){
			runAnim=true;
			render();
		}
		function pause(){
			runAnim=false;
		}
		function isPlaying(){
			return runAnim;
		}
		return{
			init:init,
			clean:clean,
			play:play,
			pause:pause,
			isPlaying:isPlaying
		}
	}
	function flicker(){
		var num=0;
		var runAnim=true;
		var id;
		function init(id){
			id=id;
			setTimeout(func,Math.rnd(10000),id);
		}
		function clean(){
			runAnim=false;
			$('#'+id).css('text-shadow',"none");
		}
		function func(id){
			var count=Math.rnd(10,false);
			num=count;
			for(var i=0;i<count;i++){
				setTimeout(function(){
					$('#'+id).css('text-shadow', +Math.rnd(2)+'px '+Math.rnd(2)+'px rgba(227,6,19,.8), '+Math.rnd(2)+'px '+Math.rnd(2)+'px rgba(255,237,0,0.5), '+Math.rnd(2)+'px '+Math.rnd(2)+'px rgba(0,159,227,.7)');
					num--;
					if(num<=0){
						if(runAnim){
							setTimeout(function(){$('#'+id).css('text-shadow', "none")},100);
							setTimeout(func,Math.rnd(10000),id);
						}
					}
				},Math.rnd(1000));
			}
		}
		return {
				init:init,
				clean:clean
				}
	}
	function validTxtArea(id){
		var txt=document.getElementById(id);
		var t=$("#"+id).val();
		var patt = /^[a-zA-Z0-9_\-+\\\/&@!\?,. ]+$/;
		if(patt.test(t)){
			if(t.length<250){
				return true;
			}
		}
		
		txt.setCustomValidity("Can have only a-zA-Z0-9_\-+/&@!?,. chars < 250");
		document.getElementById(id).reportValidity();
		return false;
	}
	function speedTest(){
		if(basic==true){
			return;
		}
		//JUST AN EXAMPLE, PLEASE USE YOUR OWN PICTURE!
		var imageAddr = "src/img/Sequence 01.gif"; 
		var downloadSize = 4092125; //bytes

		function ShowProgressMessage(msg) {
			if (console) {
				if (typeof msg == "string") {
					console.log(msg);
				} else {
					for (var i = 0; i < msg.length; i++) {
						console.log(msg[i]);
					}
				}
			}
			
			var oProgress = document.getElementById("progress");
			if (oProgress) {
				var actualHTML = (typeof msg == "string") ? msg : msg.join("<br />");
				oProgress.innerHTML = actualHTML;
			}
		}

		function InitiateSpeedDetection() {
			ShowProgressMessage("Loading the image, please wait...");
			window.setTimeout(MeasureConnectionSpeed, 1);
		};
		InitiateSpeedDetection();

		function MeasureConnectionSpeed() {
			var startTime, endTime;
			var download = new Image();
			download.onload = function () {
				endTime = (new Date()).getTime();
				showResults();
			}
			
			download.onerror = function (err, msg) {
				ShowProgressMessage("Invalid image, or error downloading");
			}
			
			startTime = (new Date()).getTime();
			var cacheBuster = "?nnn=" + startTime;
			download.src = imageAddr + cacheBuster;
			
			function showResults() {
				var duration = (endTime - startTime) / 1000;
				var bitsLoaded = downloadSize * 8;
				var speedBps = (bitsLoaded / duration).toFixed(2);
				var speedKbps = (speedBps / 1024).toFixed(2);
				var speedMbps = (speedKbps / 1024).toFixed(2);
				if(speedMbps<1){
					loadBasic("true");
				}
				ShowProgressMessage([
					"Your connection speed is:", 
					speedBps + " bps", 
					speedKbps + " kbps", 
					speedMbps + " Mbps"
				]);
			}
		}
	}
	function getUrlVars(){
    	var vars = [], hash;
    	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    	for(var i = 0; i < hashes.length; i++)
    	{
        	hash = hashes[i].split('=');
        	vars.push(hash[0]);
        	vars[hash[0]] = hash[1];
    	}
    	return vars;
	}
	function loadBasic(bool){
		window.location.href = 'index.html?basic='+bool;
	}
	function checkFPS(){
		var start=performance.now();
		var fps=100;
		var count=0;
		requestAnimationFrame(
			function loop(){
				count++;
				now=performance.now();
				if(now-start>1000){
					start=performance.now();
					fps=count;
					count=0;
				}
				requestAnimationFrame(loop);
			}
		);

		function gameLoop(){
			if(basic)return;
			//$("#test").html(fps);
			if(fps<20){
				if(confirm("Frame rate dropping!\nWould you like to switch to Basic version?")){
					loadBasic("true");
				}
			}else{
				setTimeout(gameLoop,5000);
			}
		};
		if(!basic){
			gameLoop();
		}
	}
	checkFPS();
	return {
			typeIt:typeIt,
			cropIt:cropIt,
			border:border,
			createRect:createRect,
			rndClrFunc:rndClrFunc,
			anim:anim,
			flicker:flicker,
			validTxtArea:validTxtArea,
			speedTest:speedTest,
			getUrlVars:getUrlVars,
			loadBasic:loadBasic
			}
}

function soft(){
	function init(){
		$(".soft").each(function(count,itm){
			$(itm).hover(function(){
				$(itm).addClass("animated pulse");
				$(itm).parent().append($("<div class='animated fadeInDown softTxt' style='margin-left:90px;width:100px;height:20px;position:relative;left:"+($(itm).position().left+10)+"px;top:0px' id='"+$(itm).attr("alt")+"'>"+($(itm).attr("alt")).replace(/_/g," ")+"</div>"))
			},function(){
				$(itm).removeClass("animated pulse");
				$("#"+$(itm).attr("alt")).remove();
			})
		})
	}
	function clean(){
		$(".soft").each(function(count,itm){
			$(itm).off();
		})
	}
	return {
		init:init,
		clean:clean
	}
}

function game(){
	var gameTemp1=0;
	var gameTemp1Max=10;
	var c;
	var cv;
	var ctx;
	var runAnim=true;
	function init(){
		createGamesBG(true);
		//setInterval(createGamesBG,Math.random()*10000,false);
	}
	function createGamesBG(firstTime){
		c= new createjs.Stage("gameCanvas");
		cv = document.getElementById("gameCanvas");
		ctx = cv.getContext('2d');
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = 'rgba(0,0,0,0)';
		ctx.fillRect(0,0,965,400);
		var wt=30;
		var ht=30;
		if(basic){
			wt=100;
			ht=100;
		}
		countX=Math.ceil(965/wt);
		countY=Math.ceil(400/ht);
		gameTemp1Max=countX;
		var arrX=[];
		function f(s,c){
			if(basic){
				return;
			}
			s.graphics.clear().beginFill(scope.util.rndClrFunc()).drawRect(0, 0, wt, ht).endFill();
			c.update();
			if(runAnim){
				setTimeout(f,1000+Math.random()*100000,s,c);
			}
		}
		for(var i=0;i<countX;i++){
			var arrY=[];
			for(var j=0;j<countY;j++){
				var s=scope.util.createRect(wt*i,ht*j,wt,ht,scope.util.rndClrFunc(),1,c);
				setTimeout(f,1000+Math.random()*100000,s,c);
				var obj={x:i,y:j,shape:s};
				arrY.push(obj);
			}
			arrX.push(arrY);
		}
		for(var i=0;i<arrX.length;i++){
			setTimeout(addRect,5,c,arrX,i,parseInt(Math.random()*300));
		}
		function addRect(c,arr,idx,speed){
			var max=0;
			if(arr[idx].length>0){
				c.addChild((arr[idx].shift()).shape);
				c.update();
				if(max<arr[idx].length){
					max=arr[idx].length;
				}
			}
			if(max>0){
				setTimeout(addRect,speed,c,arr,idx,speed);
			}else{
				gameTemp1++;
				if(firstTime){
					validateGameBG(anim1);
				}
			}
		}
		function anim1(){
			//util().createRect(x,y,w,h,clr,0.5)
			createGamesIcon(c)
		}
	}
	function validateGameBG(fnc){
		if(gameTemp1>=gameTemp1Max){
			fnc();
		}
	}
	function createGamesIcon(c){
		c.enableMouseOver(20);
		var icons=[
					{
						count:1,
						bg:("../games/Skyshield/images/SkyShield.png"),
						link:"../games/Skyshield/main.html",
						title:"Skyshield",
						desc:"Skyshield"
					},
					{
						count:2,
						bg:("../games/Numpad/img/Numpad.png"),
						link:"../games/Numpad/main.html",
						title:"Numpad",
						desc:"Number Puzzle"
					},
					{
						count:3,
						bg:("src/img/aqua.png"),
						link:"",
						title:"Game 1",
						desc:"Game Game Game Game Game Game<br/>Game Game Game Game Game"
					},
					{
						count:4,
						bg:("src/img/aqua.png"),
						link:"",
						title:"Game 1",
						desc:"Game Game Game Game Game Game<br/>Game Game Game Game Game"
					},
					{
						count:5,
						bg:("src/img/aqua.png"),
						link:"",
						title:"Game 1",
						desc:"Game Game Game Game Game Game<br/>Game Game Game Game Game"
					},
					{
						count:6,
						bg:("src/img/aqua.png"),
						link:"",
						title:"Game 1",
						desc:"Game Game Game Game Game Game<br/>Game Game Game Game Game"
					}
				]
		
		var gapY=50;
		for(var i=0;i<icons.length;i++){
			var rad=50;
			var dsp=new createjs.MovieClip();
			dsp.rad=rad;
			dsp.x=200*((i%3)+1);
			dsp.y=90+(90*(Math.floor(i/3)))*((Math.floor((i)/3))+1);
			dsp.title=icons[i].title;
			dsp.desc=icons[i].desc;
			dsp.link=icons[i].link;
			var shape = new createjs.Shape();
			shape.graphics.beginFill("#FFFFFF").drawCircle(0, 0, rad);
			shape.x=0;
			shape.y=0;
			var shape2 = new createjs.Shape();
			shape2.graphics.beginFill("#FF0000").drawCircle(0, 0, rad-5);
			shape2.x=0;
			shape2.y=0;
	
			var image = new Image();
			image.src = icons[i].bg;
			image.onload = handleImageLoad;
			image.dsp=dsp;
			image.rad=rad;
			image.msk=shape2;
	
			function handleImageLoad(event) {
				var img = event.target;
				var dsp=event.target.dsp;
				var rad=event.target.rad;
				var msk=event.target.msk;
				var bitmap = new createjs.Bitmap(img);
				bitmap.x=-rad;
				bitmap.scaleX=(rad*2)/img.width;
				bitmap.scaleY=(rad*2)/img.height;
				bitmap.y=-rad;
				bitmap.mask=msk;
				dsp.addChild(bitmap);
				c.update();
			}
			
			dsp.shadow = new createjs.Shadow("#000000", 1, 1, 5);
			dsp.on("rollover", function(event) { 
				var dsp=event.currentTarget;
				var titleMc=new createjs.MovieClip();
				titleMc.x = -dsp.rad+0;
				titleMc.y = dsp.rad+10;
				var line = new createjs.Shape();
				line.graphics.setStrokeStyle(2).beginStroke("rgba(255,255,255,1)").moveTo(dsp.rad,-10).lineTo(dsp.rad,10).endStroke();
				var shape = new createjs.Shape();
				shape.graphics.beginFill("#FFFFFF").drawRoundRect (0, 0, 100,30,3,3,3,3);
				shape.x=0;
				shape.y=0;
				var text = new createjs.Text(dsp.title, "20px Arial", "#ff7700");
				text.shadow = new createjs.Shadow("#000000", 0, 0, 0.1);
				text.x = 10;
				text.y = 5;
				//text.textBaseline = "alphabetic";
				titleMc.addChild(line);
				titleMc.addChild(shape);
				titleMc.addChild(text);
				dsp.addChild(titleMc);
				dsp.titleObj=titleMc;
				c.update();
			});
			dsp.on("click", function(event) { 
				var dsp=event.currentTarget;
				window.open(dsp.link);
			});
			dsp.addEventListener("rollout", function(event) { 
				event.currentTarget.removeChild(event.currentTarget.titleObj);
				c.update();
			});
			dsp.addChild(shape);
			dsp.addChild(shape2);
			c.addChild(dsp);
			c.update();
		}
		
		//shape.snapToPixel = true;
		//shape.cache(0, 0, w, h);
		//shape.cache(-r, -r, r*2, r*2);
		//var blurFilter = new createjs.BlurFilter(2, 2, 1);
		/*
		var color = c.replace("#","0x");
		var alpha = 1;
		var blurX = 5;
		var blurY = 5;
		var strength = 1;
		var quality = 1;
		var inner = false;
		var knockout = false;
		_glowFilter = new createjs.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
		shape.filters = [_glowFilter];
		var bounds = blurFilter.getBounds();
		shape.cache(0, 0, w, h);
		*/
		
		return;
	}
	function clean(){
		try{
			c.removeAllEventListeners();
			c.removeAllChildren();
			createjs.Ticker.removeAllEventListeners();
			ctx=null;
			c.clear();
			c=null;
		}catch(e){}
	}
	return {
		init:init,
		clean:clean
	}
}

function resume(){
	setTimeout(function(){
		$("#resPic").addClass("animated");
		$("#resPic").css("display","block");
	},1000);
	var txt="12+ years of experience in the field of Web and multimedia demonstrating strong analytical and problem solving	skills and ability to follow through projects from inception to completion. Client interaction, team handling.<br/>	• Experience in HTML5, AngularJS, DHTML, XML, CSS, JavaScript, Sound forge and more.<br/>	• Experience in Adobe Dreamweaver, Photoshop, Flash.<br/>	• Experience in 2d Flash animation, design and Programming (AS2 and AS3)<br/>";
	$("#resTxt").html(txt);
	if(!basic){
		scope.anim1=scope.util.anim();
		scope.anim1.init("resBox1",950,400);
		scope.anim2=scope.util.anim();
		scope.anim2.init("resBox2",950,400);
		scope.anim1.pause();
		scope.anim2.pause();
	}
}

function contact(){
	var ctx;
	var stage;
	var valid=true;
	function init(){
		function captchaGen(){
			//Stage
			ctx = document.getElementById('captcha').getContext('2d');
			//ctx.globalCompositeOperation = 'source-over';
			//ctx.fillStyle = 'rgba(0,0,0,0)';
			ctx.fillRect(0,0,300,30);
			stage = new createjs.Stage("captcha");
		
			dragRadius = 14;
			destHeight = 30;
			destWidth = 30;
		
			//Circle Creation
			var circle = new createjs.Shape();
			circle.graphics.setStrokeStyle(0).beginStroke("brown").beginFill("red").drawCircle(0,0, dragRadius);
		
			//Drag Object Creation
			//Placed inside a container to hold both label and shape
			var dragger = new createjs.Container();
			dragger.reset=function(){
				dragger.x = dragger.y = 15;
			}
			dragger.reset();
			dragger.addChild(circle);
			dragger.setBounds(100, 100, dragRadius*2, dragRadius*2);
			//DragRadius * 2 because 2*r = width of the bounding box
		
			var box = new createjs.Shape();
			box.graphics.setStrokeStyle(0).beginStroke("green").beginFill("#aaFFaa").drawCircle(0,0, dragRadius);
			var destination = new createjs.Container();
			destination.x = 285;
			destination.y = 15;
			destination.setBounds(270, 0, destHeight, destWidth);
		
			destination.addChild(box);
		
			var label = new createjs.Text("> > >  Drag to Submit  > > >", "14px Lato", "#ffffff");
			label.textAlign="center";
			label.x = -130;
			label.y = -10;
		
			destination.addChild(label);
			//DRAG FUNCTIONALITY =====================
			dragger.on("pressmove", function(evt){
				//ctx.globalCompositeOperation = 'copy';
				ctx.fillRect(0,0,300,30);  
				evt.currentTarget.x = evt.stageX;
				evt.target.graphics.setStrokeStyle(0).beginStroke("brown").beginFill("red").drawCircle(0,0, dragRadius).endFill();
				box.graphics.setStrokeStyle(0).beginStroke("green").beginFill("#aaFFaa").drawCircle(0,0, dragRadius);
				box.y=0;
				//evt.currentTarget.y = evt.stageY;
				stage.update(); //much smoother because it refreshes the screen every pixel movement instead of the FPS set on the Ticker
				if(intersect(evt.currentTarget, destination)){
					if(valid){
						valid=false;
						$("#send").css("display","none");
						setInterval(function(){
							valid=true;
							$("#send").css("display","block");
							$("#resForm").html("");
							$("#resForm").removeClass("alert-danger");
							$("#resForm").removeClass("alert-success");
						},5000);
					}else{
						dragger.reset();
						return;
					}
					evt.currentTarget.alpha=0.2;
					evt.currentTarget.x=0;
					box.graphics.clear();
					box.graphics.setStrokeStyle(3)
					.beginStroke("#0066A4")
					.drawCircle(0,0, dragRadius);
					box.y=0;
					if(validConForm()){
						//document.getElementById("conForm").submit();
						//var url="../saveData.asp";
						//var url="http://www.vinodkumargb.somee.com/saveData.asp";
						var url="https://formcarry.com/s/Bk-Vcmm0f";
						var jqxhr = $.ajax({
							type: "POST",
							dataType: "json",
							url: url,
							data: $('#conForm').serialize()
						  })
						.done(function(result) {
							$("#resForm").html("Thank you for the words!");
							$("#resForm").removeClass("alert-danger");
							$("#resForm").addClass("alert-success");
							setTimeout(function(){
								$("#conForm")[0].reset();
							},2000);
						})
						.fail(function(result) {
							$("#resForm").html(result.responseText);
							$("#resForm").removeClass("alert-success");
							$("#resForm").addClass("alert-danger");
						})
						//.always(function(result) {
						//	alert( "complete:"+result.responseText );
						//});
					}
				}else{
					//evt.currentTarget.alpha=1;
					box.graphics.clear();
					box.graphics.setStrokeStyle(0).beginStroke("green").beginFill("#aaFFaa").drawCircle(0,0, dragRadius);
					box.y=0;
				}
		
			});
		
			//Mouse UP and SNAP====================
			dragger.on("pressup", function(evt) {
				if(intersect(evt.currentTarget, destination)){
					dragger.x = destination.x + destWidth/2;
					dragger.y = destination.y + destHeight/2;
					dragger.alpha = 1;
					box.graphics.clear();     
					box.graphics.setStrokeStyle(0).beginStroke("green").beginFill("#aaFFaa").drawCircle(0,0, dragRadius);
					stage.update(evt);
				}
				dragger.reset();
				stage.update(evt);
			});
			//Tests if two objects are intersecting
			//Sees if obj1 passes through the first and last line of its
			//bounding box in the x and y sectors
			//Utilizes globalToLocal to get the x and y of obj1 in relation
			//to obj2
			//PRE: Must have bounds set for each object
			//Post: Returns true or false
			function intersect(obj1, obj2){
				var objBounds1 = obj1.getBounds().clone();
				var objBounds2 = obj2.getBounds().clone();
		
				var pt = obj1.globalToLocal(objBounds2.x, objBounds2.y);
				
				var h1 = -(objBounds1.height / 2 + objBounds2.height);
				var h2 = objBounds2.width / 2;
				var w1 = -(objBounds1.width / 2 + objBounds2.width);
				var w2 = objBounds2.width / 2;
				
				
				if(pt.x > w2 || pt.x < w1) return false;
				if(pt.y > h2 || pt.y < h1) return false;
				
				return true;
			}
		
		
			//Adds the object into stage
			stage.addChild(destination, dragger);
			stage.mouseMoveOutside = true;
			stage.update();
			//clearCanvas('captcha');

		}
		function validConForm(){
			captchaGen();
			document.getElementById("conForm").reportValidity();
			return scope.util.validTxtArea("conTxt");
		}
		captchaGen();
		$("#conTxt").on("input",function(e){
			e.target.setCustomValidity("");
			scope.util.validTxtArea("conTxt");
		})
		if(basic){
			$("#earthId").css("display","none");
		}else{
			$("#earthId").css("display","block");
		}
	}
	function clean(){
		try{
			stage.removeAllEventListeners();
			stage.removeAllChildren();
			ctx=null;
			stage.clear();
			stage=null;
			$("#conTxt").off();
			$("#earthId").remove();
		}catch(e){}
	}
	return {
		init:init,
		clean:clean
	}
}

function boxAnim(){
	$(".boxx").each(function() {
		setTimeout(setClass,2000+Math.rnd(10000),this);
	  });
	function setClass(t){
		$(t).removeClass("boxx");
		$(t).addClass("boxn");
		setTimeout(resetClass,100,t);
	}
	function resetClass(t){
		$(t).removeClass("boxn");
		$(t).addClass("boxx");
		if(!basic){
			setTimeout(setClass,5000+Math.rnd(10000,false),t);
		}
	}


}

function animBg(id){
	function _func(){
		$("#"+id).css("background-position-x",(parseInt($("#"+id).css("background-position-x"))-1)+"px");
		window.requestAnimationFrame(_func);
	}
	window.requestAnimationFrame(_func);
}

function aboutMeAnimFunc(){
	setTimeout(_func,20000,true);
	function _func(bool){
		if(bool && scope.abtVisible){
			_abtAnim(true);
			setTimeout(_func,10000,!bool);
		}else{
			_abtAnim(false);
			setTimeout(_func,(Math.random()*100000)+10000,!bool);
		}
		
	}
}

function _abtAnim(bool){
	var zMin=1;
	var zMax=2;
	var v=2;
	var minTop=-100;
	var maxTop=0;
	if(bool){
		function _funcTrueZ(){
			$("#aboutMeBg").fadeOut(1000, function(){
				$("#aboutMeBg").css("position","fixed");
				$("#aboutMeBg").css("top","0px");
				$("#aboutMeBg").css("left","0px");
				$("#aboutMeBg").css("width","1500px");
				$("#aboutMeBg").css("height","1000px");
				$("#aboutMeBg").css("z-index","999999");
				scope.initBirds.onWindowResize(1500,1000);
				$("#aboutMeBg").fadeIn(1000, function(){
				})
			});
			//window.requestAnimationFrame(_funcTrueZ);
		}
		window.requestAnimationFrame(_funcTrueZ);
	}else{
		function _funcFalseZ(){
			$("#aboutMeBg").fadeOut(1000, function(){
				$("#aboutMeBg").css("position","absolute");
				$("#aboutMeBg").css("top","0px");
				$("#aboutMeBg").css("left","15px");
				$("#aboutMeBg").css("width","985px");
				$("#aboutMeBg").css("height","250px");
				scope.initBirds.onWindowResize(985,250);
				$("#aboutMeBg").fadeIn(1000, function(){

				})
			});
			//window.requestAnimationFrame(_funcFalseZ);
		}
		window.requestAnimationFrame(_funcFalseZ);
	}
}

function isScrolledIntoView(id) {
	var el=document.getElementById(id);
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}

function scrollControl(){
	$( window ).scroll(function() {
		scope.abtVisible=isScrolledIntoView("abt");
		if(isScrolledIntoView("cntForm")){
			if(scope.earth){
				if(!scope.earth.isPlaying()){
					scope.earth.play();
				}
			}
		}else{
			if(scope.earth){
				scope.earth.pause();
			}
		}
		if(isScrolledIntoView("abt")){
			if(!scope.initBirds.isPlaying()){
				scope.initBirds.play();
			}
		}else{
			_abtAnim(false);
			scope.initBirds.pause();
		}
		if(isScrolledIntoView("cv")){
			if(!scope.banner.isPlaying()){
				scope.banner.play();
			}
		}else{
			scope.banner.pause();
		}
		if(isScrolledIntoView("resumeId")){
			if(!scope.anim1.isPlaying()){
				scope.anim1.play();
			}
			if(!scope.anim2.isPlaying()){
				scope.anim2.play();
			}
		}else{
			scope.anim1.pause();
			scope.anim2.pause();
		}
	});
}

