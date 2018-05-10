function initAudioVisual(id) {
  var c = document.getElementById(id);
  var w = c.style.width;
  var h = c.style.height;
  var canvas=document.createElement("canvas");
  canvas.width=parseInt(w);
  canvas.height=parseInt(h);
  c.appendChild(canvas);
  var ply=document.createElement("div");
  var pas=document.createElement("div");
  ply.innerHTML="▶";
  ply.style.color="rgba(255,255,255,0.5)";
  ply.style.position="relative";
  ply.style.top=-canvas.height+"px";
  ply.style.left=canvas.width-10+"px";
  ply.onclick =function(){
    audio.play();
  }
  //ply.style.cursor="pointer";
  pas.innerHTML="⏸";
  pas.style.color="rgba(255,255,255,0.5)";
  pas.style.position="relative";
  pas.style.marginTop=-canvas.height+"px";
  pas.style.marginLeft=canvas.width-10+"px";
  pas.onclick =function(){
    audio.pause();
  }
  //pas.style.cursor="pointer";
  c.appendChild(ply);
  c.appendChild(pas);
  var audio=document.createElement("audio");
  audio.onpause = function() {
    pas.style.display="none";
    ply.style.display="block";
  };
  audio.onplay = function() {
    pas.style.display="block";
    ply.style.display="none";
  };
  //audio.src = "1.mp3";
  //audio.load();
  //audio.play();
  var context = new AudioContext();
  var src = context.createMediaElementSource(audio);
  var analyser = context.createAnalyser();

  var ctx = canvas.getContext("2d");

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 2048;

  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    x = 0;
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0,0,WIDTH, HEIGHT);
    for (var i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i]*HEIGHT)/255;
      
      var r = 255; //barHeight + (25 * (i/bufferLength));
      var g = 255; //250 * (i/bufferLength);
      var b = 255; //50;
      var c = 0.5;

      ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + c + ")";
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }
  //audio.play();
  renderFrame();
  return {
    audio:audio
  }
};