var bomb = [];
var explode = [];
var missile = [];
var stg;
var canvas;
var context;
var background;
var pat;

//====================
var initLevel;
var initGuns;
var initGunLevel;
var initMissiles;
var initBombs;
var initBombsSpeed;
var initLives;
var initBg;

var curLevel=0;
var curGuns;
var curGunLevel;
var curMissiles;
var curBombs;
var curBombsSpeed;
var curLives;
var curBg;
var credits=0;

var gamePaused=false;
var inPlay=false;
var id=[];
var lvl;
var tickerOnFunc;
var tickerListFunc;
var pauseBtn;
var playBtn;
var empBtn;
var gunPointX;
var gunPointY;
var emp;
var stgClickFunc;
var cnv;
var fworks;
//====================

var game={
			"totalLevsls":"3",
			"level1": {
				"number": "1",
				"gun": "1",
				"gunLevel": "1",
				"gunClr":"#ff0000",
				"missiles": "100",
				"bombs": "10",
				"bombsSpeed": "15000",
				"bombClr":"#000000",
				"bombPwr":10,
				"lives": "5",
				"bg": "1.png",
				"sec":0
			},
			"level2": {
				"number": "2",
				"gun": "1",
				"gunClr":"#ffffff",
				"missiles": "100",
				"gunLevel": "2",
				"bombs": "15",
				"bombsSpeed": "10000",
				"bombClr":"#ff00ff",
				"bombPwr":12,
				"lives": "10",
				"bg": "2.png",
				"sec":0
			},
			"level3": {
				"number": "3",
				"gun": "1",
				"gunClr":"#ffffff",
				"missiles": "100",
				"gunLevel": "2",
				"bombs": "15",
				"bombsSpeed": "10000",
				"bombClr":"#ff00ff",
				"bombPwr":12,
				"lives": "10",
				"bg": "3.png",
				"sec":0
			}
		}

function init() {
	if(!stg){
		stg = new createjs.Stage("cv");
		canvas = document.getElementById("cv");
		context = canvas.getContext('2d');
		createjs.Ticker.setFPS(60);
		newCv();
	}
	context.globalCompositeOperation = 'source-over';
	background = new Image();
	background.src = "images/SkyShield.png";
	background.onload = function(e){
		//pat=context.createPattern(background,"no-repeat");
		//cnv.addChild(background);
		var bitmap = new createjs.Bitmap(background);
		cnv.addChild(bitmap);
		button("Start",20,20,"#ffffff","#0000ff",($(canvas).width()/2)-50,$(canvas).height()/2,100,50,function(e,d){
																										e.stopImmediatePropagation();
																										d.removeBtn();
																										preLoadNext();
																										})
		
		playBtn=button("Play",15,5,"#ffffff","#93C3EA",300,2,50,20,function(e,d){
																		e.stopImmediatePropagation();
																		pauseGame();
																		})
		playBtn.visible=false;
		pauseBtn=button("Pause",15,5,"#ffffff","#93C3EA",300,2,50,20,function(e,d){
																		e.stopImmediatePropagation();
																		pauseGame();
																		})
		empBtn=button("EMP",10,10,"#ffffff","#93C3EA",10,$(canvas).height()-20,40,10,function(e,d){
																							e.stopImmediatePropagation();
																							empLaunch();
																							})
		pauseBtn.visible=false;
		empBtn.visible=false;
		stg.update();
		//fworks = new Fireworks();
		//context.drawImage(background,0,0,$(canvas).width(),$(canvas).height());
	}

	//var child1 = new createjs.Shape(new createjs.Graphics().beginFill("#999999").rect(0,0,600,500));
	//var bitmap = new createjs.Bitmap("images/SkyShield.png");
		
	gunPointX=$(canvas).width() / 2;
	gunPointY=$(canvas).height()-40;
	stg.update();
	//loadGun();
}
function reset(){
	curLevel=0;
	credits=0;
	if(fworks){
		fworks.clear();
		fworks.run=false;
		fworks=null;
	}
	context.globalCompositeOperation = 'source-over';
	context.fillStyle = 'rgba(0,0,0,1)';
	context.fillRect(0,0,$("#canvas-container").width(),$("#canvas-container").height());
	stg.update()
	window.setTimeout(init,1000);
}

function preLoadNext(){
	curLevel++;
	if(curLevel==3){
		pick(0);
	}
	loadNext();
}

function loadNext(){
	if(curLevel>parseInt(game.totalLevsls)){
		missionComplete();
		return;
	}
	
	lvl=game["level"+curLevel];
	curGuns=parseInt(lvl.gun);
	curGunLevel=parseInt(lvl.gunLevel);
	curMissiles=0;
	curBombs=parseInt(lvl.bombs);
	curBombsSpeed=parseInt(lvl.bombsSpeed);
	curLives=parseInt(lvl.lives);
	curBg=lvl.bg;

    id[curLevel]=setInterval(createBomb, 2000)
    tickerListFunc=createjs.Ticker.addEventListener("tick", stg);
    tickerOnFunc=createjs.Ticker.on("tick", tick);

	background = new Image();
	background.src = "images/"+curBg;
	background.onload = function(e){
		var bitmap = new createjs.Bitmap(background);
		cnv.addChild(bitmap);
		context.drawImage(background,0,0,$(canvas).width(),$(canvas).height());
		pat=context.createPattern(background,"no-repeat");
		inPlay=true;
		pauseBtn.visible=true;
		loadGun();
		activeGun(lvl.gunClr,$(canvas).width()/2,$(canvas).height()-40,3)
		cvClick(true);
		playBtn=button("Play",15,5,"#ffffff","#93C3EA",300,2,50,20,function(e,d){
																		e.stopImmediatePropagation();
																		pauseGame();
																		})
		pauseBtn=button("Pause",15,5,"#ffffff","#93C3EA",300,2,50,20,function(e,d){
																		e.stopImmediatePropagation();
																		pauseGame();
																		})
		empBtn=button("EMP",10,10,"#ffffff","#93C3EA",10,$(canvas).height()-20,40,10,function(e,d){
																							e.stopImmediatePropagation();
																							empLaunch();
																							})
	}
}

function pauseGame(){
	if(gamePaused){
		empBtn.visible=true;
		gamePaused=false;
		playBtn.visible=false;
		pauseBtn.visible=true;
		//tickerListFunc=createjs.Ticker.addEventListener("tick", stg);
		//tickerOnFunc=createjs.Ticker.on("tick", tick);
		createjs.Ticker.setPaused(false);
		cvClick(true);
	}else{
		empBtn.visible=false;
		gamePaused=true;
		playBtn.visible=true;
		pauseBtn.visible=false;
		//createjs.Ticker.removeEventListener("tick", tickerListFunc);
		//createjs.Ticker.off("tick", tickerOnFunc);
		createjs.Ticker.setPaused(true);
		cvClick(false);
	}
	stg.update();
}
function endLevel(result){
	if(emp){
		emp.visible=false;
	}
	cvClick(false);
	gamePaused=false;
	inPlay=false;
	clearInterval(id[curLevel]);
	createjs.Ticker.removeEventListener("tick", tickerListFunc);
    createjs.Ticker.off("tick", tickerOnFunc);
	
	for (var m in missile) {
		stg.removeChild(missile[0]);
		missile=removeItem(missile,missile[0]);
	}
    for (var b in bomb) {
		bomb[0].dead=true;
		stg.removeChild(bomb[0]);
		bomb = removeItem(bomb, bomb[0]);
	}
	
	if(curLevel>=parseInt(game.totalLevsls)){
		//alert("Game over");
	}else{
		//context.clearRect(0, 0, $(canvas).width(), $(canvas).height());
		//loadNext();
	}
	score(result);
}
function doClick(e) {
	if(gamePaused && inPlay){
		//pauseGame();
	}else if(!inPlay){
		
	}else if(inPlay){
		//createMissile(e.offsetX, e.offsetY);
		createMissile(e.stageX, e.stageY);
	}
}
function createBomb() {
	if(curBombs<=0){
		return;
	}
    if (!inPlay) {
        return;
    }
	if (createjs.Ticker.paused) {
        return;
    }
    var circle = new createjs.Shape();
    circle.graphics.beginFill(lvl.bombClr).drawPolyStar(0, 0, 5, 20, 0.6, 50);
    circle.x = $(canvas).width() * Math.random();
    circle.y = 0;
	circle.initX=circle.x;
	circle.initY=circle.y;
    stg.addChild(circle);
    //stg.update();
    dropBomb(circle);
    bomb.push(circle);
    //setInterval(hitTest,100);
}
function dropBomb(b) {
	if(curBombs<=0){
		return;
	}	
	curBombs--;
    createjs.Tween.get(b, {
        loop: false
    }).to({
        x: $(canvas).width() * Math.random(),
        y: 500
    }, curBombsSpeed, createjs.Ease.getPowInOut(1)).call(function() {
        if(!b.dead){
			curLives--;
			bomb = removeItem(bomb, b);
			stg.removeChild(b);
			bombExplode(b.x,b.y);
		}
    })
}
function tick(e) {
	stats();
	if (e.paused) {
         return;
    }
	if(curLives<=0){
		endLevel(false);
		return;
	}
	if(curBombs<=0 && bomb.length==0){
		endLevel(true);
		return;
	}
	
	if(emp){
		for (var b in bomb) {
			if (bomb[b]) {
				var pt = bomb[b].localToLocal(0, 0, emp);
				if (emp.hitTest(pt.x, pt.y)) {
					bomb[b].dead=true;
					stg.removeChild(bomb[b]);
					bomb = removeItem(bomb, bomb[b]);
				}
			}
		}
	}
	
	for (var m in missile) {
		drawPath(missile[m].initX,missile[m].initY,missile[m].x,missile[m].y,lvl.gunClr);
	}
    for (var b in bomb) {
		if (bomb[b]) {
			drawPath(bomb[b].initX,bomb[b].initY,bomb[b].x,bomb[b].y,lvl.bombClr);
			for (var m in explode) {
				if(!bomb[b])continue;
				var pt = bomb[b].localToLocal(0, 0, explode[m]);
				if (explode[m].hitTest(pt.x, pt.y)) {
					bomb[b].dead=true;
					stg.removeChild(bomb[b]);
					bomb = removeItem(bomb, bomb[b]);
					credits+=lvl.bombPwr;
				}
			}
		}
    }
	//context.drawImage(background,0,0,$(canvas).width(),$(canvas).height());			
}
function createMissile(x, y) {
	if(curMissiles>=parseInt(lvl.missiles)){
		return;
	}
	curMissiles++;
    var circle = new createjs.Shape();
    circle.graphics.beginFill(lvl.gunClr).drawCircle(0, 0, 2);
    circle.x = gunPointX;
    circle.y = gunPointY;
	circle.initX=circle.x;
	circle.initY=circle.y;
    stg.addChild(circle);
    //stg.update();
	missile.push(circle);
    sendMissile(circle, x, y);
    //createjs.Ticker.setFPS(30);
    //createjs.Ticker.addEventListener("tick", stg);
}
function sendMissile(m, x, y) {
    createjs.Tween.get(m, {
        loop: false
    }).to({
        x: x,
        y: y
    }, 1000, createjs.Ease.getPowInOut(1)).call(function() {
        stg.removeChild(m);
		missile=removeItem(missile,m);
        missileExplode(m, x, y);
    })
}
function missileExplode(m, x, y) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill("yellow").drawCircle(0, 0, 5);
    circle.x = x;
    circle.y = y;
    stg.addChild(circle);
    explode.push(circle);
    createjs.Tween.get(circle, {
        loop: false
    }).to({
        scaleX: 5,
        scaleY: 5,
        alpha: 0
    }, 500, createjs.Ease.getPowInOut(1)).call(function() {
        stg.removeChild(circle);
        explode = removeItem(explode, circle);
    })
}
function bombExplode(x, y) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill("orange").drawCircle(0, 0, 2);
    circle.x = x;
    circle.y = y;
    stg.addChild(circle);
    explode.push(circle);
    createjs.Tween.get(circle, {
        loop: false
    }).to({
        scaleX: 5,
        scaleY: 5,
        alpha: 0
    }, 500, createjs.Ease.getPowInOut(1)).call(function() {
        stg.removeChild(circle);
        explode = removeItem(explode, circle);
    })
}
function stats(){
	context.textBaseline = "top";
	context.textAlign="left";
	context.font = "15px Arial";
	context.fillStyle = "white";
	context.fillText("Lives:"+curLives,10,2);
	context.fillText("Missiles:"+(parseInt(lvl.missiles)-curMissiles),70,2);
	context.fillText("Bombs:"+curBombs,170,2);
	context.fillText("Credits:"+credits,500,2);
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
function drawPath(x1,y1,x2,y2,clr){
	var grad= context.createLinearGradient(0, 0, 0, 500);
	c=hexToRgb(clr.replace(/[^0-9A-F]/gi, ''));
	grad.addColorStop(0, "rgba("+c.r+","+c.g+","+c.b+",0)");
	grad.addColorStop(0.3, "rgba("+c.r+","+c.g+","+c.b+",1)");
	context.strokeStyle = grad;
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();
}
function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return {r:r,g:g,b:b};
}
function button(txt,sze,pad,clr,bgclr,x,y,w,h,func){
	var btn = new createjs.MovieClip();
	btn.x=x;
	btn.y=y;
	
	var btnBg = new createjs.Shape();
    btnBg.graphics.beginFill(bgclr).drawRoundRectComplex(0, 0, w, h, 6, 6, 6, 6);
    btnBg.x = 0;
    btnBg.y = 0;
	
	var btnTxt = new createjs.Text(txt, sze+"px Arial", clr);
	btnTxt.x = pad;
	btnTxt.y = (h-sze)/2;
	btn.addChild(btnBg);
	btn.addChild(btnTxt);
	cnv.addChild(btn);
	
	var removeBtn=function(){
		btn.removeChild(btnBg);
		btn.removeChild(btnTxt);
		cnv.removeChild(btn);
	}
	btn.on("click", func,null,false,{removeBtn:removeBtn});
	return btn;
}
function cvClick(bool){
	if(bool){
		setTimeout(function(){
								stgClickFunc=cnv.addEventListener("click", doClick)
							},100);
	}else{
		cnv.removeEventListener("click", stgClickFunc);
	}
}
function score(result){
	var wt=200;
	var ht=200;
	var msg = new createjs.MovieClip();
	msg.x=($(canvas).width()-wt)/2;
	msg.y=($(canvas).height()-ht)/2;
	
	var bg = new createjs.Shape();
    bg.graphics.beginFill(result?"#D5D7F0":"#FFB3B3").drawRoundRectComplex(0, 0, wt, ht, 6, 6, 6, 6);
    bg.x = 0;
    bg.y = 0;
	
	var txt1 = new createjs.Text("Level"+lvl.number+": "+(result?"Pass":"Fail"), "20px Arial", "#000000");
	txt1.x = 50;
	txt1.y = 20;
	
	var txt2 = new createjs.Text("Remaining lives: "+curLives, "20px Arial", "#000000");
	txt2.x = 20;
	txt2.y = 50;
	
	if(result){
		var val=Math.round((((parseInt(lvl.bombs)-curBombs)/curMissiles)*100) * 100)/100;
		var btn=button("Next",20,10,"#000000","#00ff00",65,120,70,40,function(e,d){
																	//d.removeBtn();
																	stg.removeChild(msg);
																	preLoadNext();
																	});
	
	
	}else{
		var val=Math.round((((parseInt(lvl.bombs)-curBombs)/parseInt(lvl.missiles))) * 100)/100;
		var btn=button("Retry",20,10,"#000000","#ff0000",65,120,70,40,function(e,d){
																	//d.removeBtn();
																	stg.removeChild(msg);
																	curLevel--;
																	preLoadNext();
																	});
	}
	
	var txt3 = new createjs.Text("Accuracy: "+val+"%", "20px Arial", "#000000");
	txt3.x = 20;
	txt3.y = 80;
	
	msg.addChild(bg);
	msg.addChild(txt1);
	msg.addChild(txt2);
	msg.addChild(txt3);
	msg.addChild(btn);
	stg.addChild(msg);
	stg.update();
}
function loadGun(){
	var image = new Image();
    image.src = "images/s1.png";

	var gun = new createjs.MovieClip();
	gun.x=285;
	gun.y=460;
	
	image.onload=function(e){
	var image = event.target;
    //var bitmap = new createjs.Bitmap(image);
    var bitmap = new createjs.Bitmap(image);
	bitmap.scaleX=0.5;
	bitmap.scaleY=0.5;
	gun.addChild(bitmap);
	stg.addChild(gun);
	stg.update();
	}
}
function activeGun(clr,x,y,r){
	var circle = new createjs.Shape();
    circle.graphics.beginFill(clr).drawCircle(0, 0, r);
    circle.x = x;
    circle.y = y;
    stg.addChild(circle);
}
function empLaunch(){
	if(gamePaused){
		return;
	}
	emp = new createjs.Shape();
    emp.graphics.beginFill("#ffffff").drawCircle(0, 0, 5);
    emp.x = gunPointX;
    emp.y = gunPointY;
	isEmp=true;
	createjs.Tween.get(emp, {
        loop: false
    }).to({
        scaleX: 500,
        scaleY: 500,
        alpha: 0
    }, 1000, createjs.Ease.getPowInOut(1)).call(function() {
        stg.removeChild(emp);
		emp=null;
    })
    stg.addChild(emp);
}
function newCv(){
	cnv = new createjs.MovieClip();
	//var child1 = new createjs.Shape(new createjs.Graphics().beginFill("#999999").rect(0,0,600,500));
	//cnv.addChild(child1);
	stg.addChild(cnv);
}
function missionComplete(){
	$('#canvas-container').css("background","#000 url(images/skyline-dark.jpg)");
	context.globalCompositeOperation = 'destination-atop';
	replayBtn=button("Replay",20,20,"#ffffff","#0000ff",($(canvas).width()/2)-50,150,100,50,function(e,d){
																							e.stopImmediatePropagation();
																							d.removeBtn();
																							reset();
																							})
	//context.globalCompositeOperation = 'destination-atop';
	context.fillStyle = 'rgba(0,0,0,1)';
	context.fillRect(0,0,$("#canvas-container").width(),$("#canvas-container").height());
	stg.update()
	fworks = new Fireworks();
	fworks.createFireworks(250,500,250,100);
}

function pick(val){
	switch(val){
		case 0:
		
		break;
	}
}
