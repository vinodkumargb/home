function initBirds2(id){
	
	var mn=document.getElementById(id);
	var bgClr="#ff0000";
	var isPause=false;
	
	var fragmentShaderPositionStr="uniform float time;uniform float delta;void main(){vec2 uv = gl_FragCoord.xy / resolution.xy;vec4 tmpPos = texture2D(texturePosition, uv );vec3 position = tmpPos.xyz;vec3 velocity = texture2D( textureVelocity, uv ).xyz;float phase = tmpPos.w;phase = mod( ( phase + delta +length( velocity.xz ) * delta * 3. +max( velocity.y, 0.0 ) * delta * 6. ), 62.83 );gl_FragColor = vec4( position + velocity * delta * 15. , phase );}";
	var fragmentShaderVelocityStr="uniform float time;uniform float testing;uniform float delta;uniform float seperationDistance;uniform float alignmentDistance;uniform float cohesionDistance;uniform float freedomFactor;uniform vec3 predator;const float width = resolution.x;const float height = resolution.y;const float PI = 3.141592653589793;const float PI_2 = PI * 2.0;float zoneRadius = 40.0;float zoneRadiusSquared = 1600.0;float separationThresh = 0.45;float alignmentThresh = 0.65;const float UPPER_BOUNDS = BOUNDS;const float LOWER_BOUNDS = -UPPER_BOUNDS;const float SPEED_LIMIT = 9.0;float rand(vec2 co){	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}void main() {	zoneRadius = seperationDistance + alignmentDistance + cohesionDistance;	separationThresh = seperationDistance / zoneRadius;	alignmentThresh = ( seperationDistance + alignmentDistance ) / zoneRadius;	zoneRadiusSquared = zoneRadius * zoneRadius;vec2 uv = gl_FragCoord.xy / resolution.xy;	vec3 birdPosition, birdVelocity;vec3 selfPosition = texture2D(texturePosition, uv ).xyz;	vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;float dist;	vec3 dir;	float distSquared;float seperationSquared = seperationDistance * seperationDistance;	float cohesionSquared = cohesionDistance * cohesionDistance;float f;	float percent;vec3 velocity = selfVelocity;float limit = SPEED_LIMIT;dir = predator * UPPER_BOUNDS - selfPosition;	dir.z = 0.;	dist = length( dir );	distSquared = dist * dist;float preyRadius = 150.0;	float preyRadiusSq = preyRadius * preyRadius;	if (dist < preyRadius) {f = ( distSquared / preyRadiusSq - 1.0 ) * delta * 100.;		velocity += normalize( dir ) * f;		limit += 5.0;	}	vec3 central = vec3( 0., 0., 0. );	dir = selfPosition - central;	dist = length( dir );dir.y *= 2.5;	velocity -= normalize( dir ) * delta * 5.;for (float y=0.0;y<height;y++) {		for (float x=0.0;x<width;x++) {vec2 ref = vec2( x + 0.5, y + 0.5 ) / resolution.xy;			birdPosition = texture2D( texturePosition, ref ).xyz;dir = birdPosition - selfPosition;			dist = length(dir);if (dist < 0.0001) continue;distSquared = dist * dist;if (distSquared > zoneRadiusSquared ) continue;percent = distSquared / zoneRadiusSquared;if ( percent < separationThresh ) { 	f = (separationThresh / percent - 1.0) * delta;				velocity -= normalize(dir) * f;} else if ( percent < alignmentThresh ) { 	float threshDelta = alignmentThresh - separationThresh;				float adjustedPercent = ( percent - separationThresh ) / threshDelta;	birdVelocity = texture2D( textureVelocity, ref ).xyz;	f = ( 0.5 - cos( adjustedPercent * PI_2 ) * 0.5 + 0.5 ) * delta;				velocity += normalize(birdVelocity) * f;} else {	float threshDelta = 1.0 - alignmentThresh;				float adjustedPercent = ( percent - alignmentThresh ) / threshDelta;	f = ( 0.5 - ( cos( adjustedPercent * PI_2 ) * -0.5 + 0.5 ) ) * delta;	velocity += normalize(dir) * f;}}}if ( length( velocity ) > limit ) {		velocity = normalize( velocity ) * limit;	}gl_FragColor = vec4( velocity, 1.0 );}"
	var birdVSStr="attribute vec2 reference;attribute float birdVertex;attribute vec3 birdColor;uniform sampler2D texturePosition;uniform sampler2D textureVelocity;varying vec4 vColor;varying float z;uniform float time;void main() {vec4 tmpPos = texture2D( texturePosition, reference );vec3 pos = tmpPos.xyz;vec3 velocity = normalize(texture2D( textureVelocity,reference ).xyz);vec3 newPosition = position;if ( birdVertex == 4.0 || birdVertex == 7.0 ) {newPosition.y = sin( tmpPos.w ) * 5.;}				newPosition = mat3( modelMatrix ) * newPosition;velocity.z *= -1.;float xz = length( velocity.xz );float xyz = 1.;float x = sqrt( 1. - velocity.y * velocity.y );float cosry = velocity.x / xz;float sinry = velocity.z / xz;float cosrz = x / xyz;float sinrz = velocity.y / xyz;mat3 maty =  mat3(cosry, 0, -sinry,0,1,0,sinry,0,cosry);				mat3 matz =  mat3(cosrz , sinrz, 0,-sinrz, cosrz, 0,0     , 0    , 1);newPosition =  maty * matz * newPosition;newPosition += pos;z = newPosition.z;vColor = vec4(birdColor, 1.0 );gl_Position = projectionMatrix *  viewMatrix  * vec4( newPosition, 1.0 );}";
	//var birdFSStr="varying vec4 vColor;varying float z;uniform vec3 color;void main() {float z2 = 0.2 + ( 1000. - z ) / 1000. * vColor.x;gl_FragColor = vec4( z2, z2, z2, 1. );}";
	var birdFSStr="varying vec4 vColor;varying float z;uniform vec3 color;void main() {float z2 = 0.2 + ( 1000. - z ) / 1000. * vColor.x;gl_FragColor = vec4( .7, z2, z2, 1. );}";
	
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	/* TEXTURE WIDTH FOR SIMULATION */
	var WIDTH = 32;
	var BIRDS = WIDTH * WIDTH;

	// Custom Geometry - using 3 triangles each. No UVs, no normals currently.
	THREE.BirdGeometry = function () {

		var triangles = BIRDS * 3;
		var points = triangles * 3;

		THREE.BufferGeometry.call( this );

		var vertices = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
		var birdColors = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
		var references = new THREE.BufferAttribute( new Float32Array( points * 2 ), 2 );
		var birdVertex = new THREE.BufferAttribute( new Float32Array( points ), 1 );

		this.addAttribute( 'position', vertices );
		this.addAttribute( 'birdColor', birdColors );
		this.addAttribute( 'reference', references );
		this.addAttribute( 'birdVertex', birdVertex );

		// this.addAttribute( 'normal', new Float32Array( points * 3 ), 3 );

		var v = 0;

		function verts_push() {
			for (var i=0; i < arguments.length; i++) {
				vertices.array[v++] = arguments[i];
			}
		}

		var wingsSpan = 20;

		for (var f = 0; f<BIRDS; f++ ) {

			// Body
			verts_push(
				0, -0, -20,
				0, 4, -20,
				0, 0, 30
			);

			// Left Wing
			verts_push(
				0, 0, -15,
				-wingsSpan, 0, 0,
				0, 0, 15
			);

			// Right Wing
			verts_push(
				0, 0, 15,
				wingsSpan, 0, 0,
				0, 0, -15
			);

		}

		for( var v = 0; v < triangles * 3; v++ ) {

			var i = ~~(v / 3);
			var x = (i % WIDTH) / WIDTH;
			var y = ~~(i / WIDTH) / WIDTH;

			var c = new THREE.Color(
				0x444444 +
				~~(v / 9) / BIRDS * 0x666666
			);
			
			birdColors.array[ v * 3 + 0 ] = c.r;
			birdColors.array[ v * 3 + 1 ] = c.g;
			birdColors.array[ v * 3 + 2 ] = c.b;

			references.array[ v * 2     ] = x;
			references.array[ v * 2 + 1 ] = y;

			birdVertex.array[ v         ] = v % 9;

		}

		this.scale( 0.2, 0.2, 0.2 );

	};

	THREE.BirdGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

	var container, stats;
	var camera, scene, renderer, geometry, i, h, color;
	var mouseX = 0, mouseY = 0;

	var windowHalfX = parseInt(mn.style.width) / 2;
	var windowHalfY = parseInt(mn.style.height) / 2;

	var BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;

	var last = performance.now();

	var gpuCompute;
	var velocityVariable;
	var positionVariable;
	var positionUniforms;
	var velocityUniforms;
	var birdUniforms;

	_init();
	animate();

	function _init() {

		container = document.createElement( 'div' );
		mn.appendChild( container );

		camera = new THREE.PerspectiveCamera( 75, parseInt(mn.style.width) / parseInt(mn.style.height), 1, 3000 );
		camera.position.z = 350;

		scene = new THREE.Scene();
		//scene.background = new THREE.Color( 0xffffff );
		scene.fog = new THREE.Fog( 0xffffff, 100, 1000 );

		renderer = new THREE.WebGLRenderer({ alpha: true });
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( parseInt(mn.style.width), parseInt(mn.style.height) );
		
		container.appendChild( renderer.domElement );

		initComputeRenderer();

		mn.addEventListener( 'mousemove', onDocumentMouseMove, false );
		mn.addEventListener( 'touchstart', onDocumentTouchStart, false );
		mn.addEventListener( 'touchmove', onDocumentTouchMove, false );

		var effectController = {
			seperation: 20.0,
			alignment: 20.0,
			cohesion: 20.0,
			freedom: 0.75
		};

		var valuesChanger = function() {
			velocityUniforms.seperationDistance.value = effectController.seperation;
			velocityUniforms.alignmentDistance.value = effectController.alignment;
			velocityUniforms.cohesionDistance.value = effectController.cohesion;
			velocityUniforms.freedomFactor.value = effectController.freedom;
		};
		valuesChanger();
		_initBirds();
	}

	function initComputeRenderer() {

		gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );

		var dtPosition = gpuCompute.createTexture();
		var dtVelocity = gpuCompute.createTexture();
		fillPositionTexture( dtPosition );
		fillVelocityTexture( dtVelocity );

		velocityVariable = gpuCompute.addVariable( "textureVelocity", fragmentShaderVelocityStr, dtVelocity );
		positionVariable = gpuCompute.addVariable( "texturePosition", fragmentShaderPositionStr, dtPosition );
		
		gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
		gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );

		positionUniforms = positionVariable.material.uniforms;
		velocityUniforms = velocityVariable.material.uniforms;

		positionUniforms.time = { value: 0.0 };
		positionUniforms.delta = { value: 0.0 };
		velocityUniforms.time = { value: 1.0 };
		velocityUniforms.delta = { value: 0.0 };
		velocityUniforms.testing = { value: 1.0 };
		velocityUniforms.seperationDistance = { value: 1.0 };
		velocityUniforms.alignmentDistance = { value: 1.0 };
		velocityUniforms.cohesionDistance = { value: 1.0 };
		velocityUniforms.freedomFactor = { value: 1.0 };
		velocityUniforms.predator = { value: new THREE.Vector3() };
		velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed( 2 );

		velocityVariable.wrapS = THREE.RepeatWrapping;
		velocityVariable.wrapT = THREE.RepeatWrapping;
		positionVariable.wrapS = THREE.RepeatWrapping;
		positionVariable.wrapT = THREE.RepeatWrapping;

		var error = gpuCompute.init();
		if ( error !== null ) {
			console.error( error );
		}
	}

	function _initBirds() {
		var geometry = new THREE.BirdGeometry();
		// For Vertex and Fragment
		birdUniforms = {
			color: { value: new THREE.Color( 0xff2200 ) },
			texturePosition: { value: null },
			textureVelocity: { value: null },
			time: { value: 1.0 },
			delta: { value: 0.0 }
		};
		// ShaderMaterial
		var material = new THREE.ShaderMaterial( {
			uniforms:       birdUniforms,
			vertexShader:   birdVSStr,
			fragmentShader: birdFSStr,
			side: THREE.DoubleSide

		});
		var birdMesh = new THREE.Mesh( geometry, material );
		birdMesh.rotation.y = Math.PI / 2;
		birdMesh.matrixAutoUpdate = false;
		birdMesh.updateMatrix();
		scene.add(birdMesh);
	}

	function fillPositionTexture( texture ) {
		var theArray = texture.image.data;
		for ( var k = 0, kl = theArray.length; k < kl; k += 4 ) {
			var x = Math.random() * BOUNDS - BOUNDS_HALF;
			var y = Math.random() * BOUNDS - BOUNDS_HALF;
			var z = Math.random() * BOUNDS - BOUNDS_HALF;
			theArray[ k + 0 ] = x;
			theArray[ k + 1 ] = y;
			theArray[ k + 2 ] = z;
			theArray[ k + 3 ] = 1;
		}
	}

	function fillVelocityTexture( texture ) {
		var theArray = texture.image.data;
		for ( var k = 0, kl = theArray.length; k < kl; k += 4 ) {
			var x = Math.random() - 0.5;
			var y = Math.random() - 0.5;
			var z = Math.random() - 0.5;
			theArray[ k + 0 ] = x * 10;
			theArray[ k + 1 ] = y * 10;
			theArray[ k + 2 ] = z * 10;
			theArray[ k + 3 ] = 1;
		}
	}
	function onWindowResize(w,h) {
		windowHalfX = w / 2;
		windowHalfY = h / 2;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w,h);
	}
	function onDocumentMouseMove( event ) {
		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;
	}
	function onDocumentTouchStart( event ) {
		if ( event.touches.length === 1 ) {
			event.preventDefault();
			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
	}
	function onDocumentTouchMove( event ) {
		if ( event.touches.length === 1 ) {
			event.preventDefault();
			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
	}
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	function render() {
		var now = performance.now();
		var delta = (now - last) / 1000;
		if (delta > 1) delta = 1; // safety cap on large deltas
		last = now;
		positionUniforms.time.value = now;
		positionUniforms.delta.value = delta;
		velocityUniforms.time.value = now;
		velocityUniforms.delta.value = delta;
		birdUniforms.time.value = now;
		birdUniforms.delta.value = delta;
		velocityUniforms.predator.value.set( 0.5 * mouseX / windowHalfX, - 0.5 * mouseY / windowHalfY, 0 );
		mouseX = 10000;
		mouseY = 10000;
		gpuCompute.compute();
		birdUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
		birdUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;
		if(!isPause){
			renderer.render( scene, camera );
		}
	}

	function play(){
		isPause=false;
		render();
	}
	function pause(){
		isPause=true;
	}
	function isPlaying(){
		return !isPause;
	}
	return {
		onWindowResize:onWindowResize,
		play:play,
		pause:pause,
		isPlaying:isPlaying
	}
}

function initBirds1(id){
	var container=document.getElementById(id);
	var isPause=false;
	if(!container){
		return;
	}
	var Bird = function () {

		var scope = this;

		THREE.Geometry.call( this );

		v(   5,   0,   0 );
		v( - 5, - 2,   1 );
		v( - 5,   0,   0 );
		v( - 5, - 2, - 1 );

		v(   0,   2, - 6 );
		v(   0,   2,   6 );
		v(   2,   0,   0 );
		v( - 3,   0,   0 );

		f3( 0, 2, 1 );

		f3( 4, 7, 6 );
		f3( 5, 6, 7 );

		this.computeFaceNormals();

		function v( x, y, z ) {
			scope.vertices.push( new THREE.Vector3( x, y, z ) );
		}

		function f3( a, b, c ) {
			scope.faces.push( new THREE.Face3( a, b, c ) );
		}

	}

	Bird.prototype = Object.create( THREE.Geometry.prototype );
	Bird.prototype.constructor = Bird;
	
	// Based on https://www.openprocessing.org/sketch/6910

	var Boid = function () {

		var vector = new THREE.Vector3(),
		_acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 100,
		_maxSpeed = 4, _maxSteerForce = 0.1, _avoidWalls = false;

		this.position = new THREE.Vector3();
		this.velocity = new THREE.Vector3();
		_acceleration = new THREE.Vector3();

		this.setGoal = function ( target ) {

			_goal = target;

		};

		this.setAvoidWalls = function ( value ) {

			_avoidWalls = value;

		};

		this.setWorldSize = function ( width, height, depth ) {

			_width = width;
			_height = height;
			_depth = depth;

		};

		this.run = function ( boids ) {

			if ( _avoidWalls ) {

				vector.set( - _width, this.position.y, this.position.z );
				vector = this.avoid( vector );
				vector.multiplyScalar( 5 );
				_acceleration.add( vector );

				vector.set( _width, this.position.y, this.position.z );
				vector = this.avoid( vector );
				vector.multiplyScalar( 5 );
				_acceleration.add( vector );

				vector.set( this.position.x, - _height, this.position.z );
				vector = this.avoid( vector );
				vector.multiplyScalar( 5 );
				_acceleration.add( vector );

				vector.set( this.position.x, _height, this.position.z );
				vector = this.avoid( vector );
				vector.multiplyScalar( 5 );
				_acceleration.add( vector );

				vector.set( this.position.x, this.position.y, - _depth );
				vector = this.avoid( vector );
				vector.multiplyScalar( 5 );
				_acceleration.add( vector );

				vector.set( this.position.x, this.position.y, _depth );
				vector = this.avoid( vector );
				vector.multiplyScalar( 5 );
				_acceleration.add( vector );

			}/* else {

				this.checkBounds();

			}
			*/

			if ( Math.random() > 0.5 ) {

				this.flock( boids );

			}

			this.move();

		};

		this.flock = function ( boids ) {

			if ( _goal ) {

				_acceleration.add( this.reach( _goal, 0.005 ) );

			}

			_acceleration.add( this.alignment( boids ) );
			_acceleration.add( this.cohesion( boids ) );
			_acceleration.add( this.separation( boids ) );

		};

		this.move = function () {

			this.velocity.add( _acceleration );

			var l = this.velocity.length();

			if ( l > _maxSpeed ) {

				this.velocity.divideScalar( l / _maxSpeed );

			}

			this.position.add( this.velocity );
			_acceleration.set( 0, 0, 0 );

		};

		this.checkBounds = function () {

			if ( this.position.x >   _width ) this.position.x = - _width;
			if ( this.position.x < - _width ) this.position.x =   _width;
			if ( this.position.y >   _height ) this.position.y = - _height;
			if ( this.position.y < - _height ) this.position.y =  _height;
			if ( this.position.z >  _depth ) this.position.z = - _depth;
			if ( this.position.z < - _depth ) this.position.z =  _depth;

		};

		//

		this.avoid = function ( target ) {

			var steer = new THREE.Vector3();

			steer.copy( this.position );
			steer.sub( target );

			steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );

			return steer;

		};

		this.repulse = function ( target ) {

			var distance = this.position.distanceTo( target );

			if ( distance < 150 ) {

				var steer = new THREE.Vector3();

				steer.subVectors( this.position, target );
				steer.multiplyScalar( 0.5 / distance );

				_acceleration.add( steer );

			}

		};

		this.reach = function ( target, amount ) {

			var steer = new THREE.Vector3();

			steer.subVectors( target, this.position );
			steer.multiplyScalar( amount );

			return steer;

		};

		this.alignment = function ( boids ) {

			var count = 0;
			var velSum = new THREE.Vector3();

			for ( var i = 0, il = boids.length; i < il; i++ ) {

				if ( Math.random() > 0.6 ) continue;

				var boid = boids[ i ];
				var distance = boid.position.distanceTo( this.position );

				if ( distance > 0 && distance <= _neighborhoodRadius ) {

					velSum.add( boid.velocity );
					count++;

				}

			}

			if ( count > 0 ) {

				velSum.divideScalar( count );

				var l = velSum.length();

				if ( l > _maxSteerForce ) {

					velSum.divideScalar( l / _maxSteerForce );

				}

			}

			return velSum;

		};

		this.cohesion = function ( boids ) {

			var count = 0;
			var posSum = new THREE.Vector3();
			var steer = new THREE.Vector3();

			for ( var i = 0, il = boids.length; i < il; i ++ ) {

				if ( Math.random() > 0.6 ) continue;

				var boid = boids[ i ];
				var distance = boid.position.distanceTo( this.position );

				if ( distance > 0 && distance <= _neighborhoodRadius ) {

					posSum.add( boid.position );
					count++;

				}

			}

			if ( count > 0 ) {

				posSum.divideScalar( count );

			}

			steer.subVectors( posSum, this.position );

			var l = steer.length();

			if ( l > _maxSteerForce ) {

				steer.divideScalar( l / _maxSteerForce );

			}

			return steer;

		};

		this.separation = function ( boids ) {

			var posSum = new THREE.Vector3();
			var repulse = new THREE.Vector3();

			for ( var i = 0, il = boids.length; i < il; i ++ ) {

				if ( Math.random() > 0.6 ) continue;

				var boid = boids[ i ];
				var distance = boid.position.distanceTo( this.position );

				if ( distance > 0 && distance <= _neighborhoodRadius ) {

					repulse.subVectors( this.position, boid.position );
					repulse.normalize();
					repulse.divideScalar( distance );
					posSum.add( repulse );

				}

			}

			return posSum;

		}

	}

	var SCREEN_WIDTH = parseInt(container.style.width)-10,
	SCREEN_HEIGHT = parseInt(container.style.height)-10,
	SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
	SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

	var camera, scene, renderer,
	birds, bird;
	brds=100;
	var boid, boids;

	init();
	animate();

	function init() {
		camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
		camera.position.z = 50;

		scene = new THREE.Scene();
		//scene.background = new THREE.Color( 0xffffff );

		birds = [];
		boids = [];

		for ( var i = 0; i < brds; i ++ ) {

			boid = boids[ i ] = new Boid();
			boid.position.x = Math.random() * 400 - 200;
			boid.position.y = Math.random() * 400 - 200;
			boid.position.z = Math.random() * 400 - 200;
			boid.velocity.x = Math.random() * 2 - 1;
			boid.velocity.y = Math.random() * 2 - 1;
			boid.velocity.z = Math.random() * 2 - 1;
			boid.setAvoidWalls( true );
			boid.setWorldSize( 500, 500, 400 );

			bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
			bird.phase = Math.floor( Math.random() * 62.83 );
			scene.add( bird );


		}

		renderer = new THREE.CanvasRenderer({alpha:true});
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

		container.addEventListener( 'mousemove', onDocumentMouseMove, false );
		container.appendChild( renderer.domElement );

		//container.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize(w,h) {
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize( w, h );
	}
	function onDocumentMouseMove( event ) {

		var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );

		for ( var i = 0, il = boids.length; i < il; i++ ) {

			boid = boids[ i ];

			vector.z = boid.position.z;

			boid.repulse( vector );

		}

	}

	//

	function animate() {
		requestAnimationFrame( animate );
		if(!isPause){
			render();
		}
	}

	function render() {

		for ( var i = 0, il = birds.length; i < il; i++ ) {

			boid = boids[ i ];
			boid.run( boids );

			bird = birds[ i ];
			bird.position.copy( boids[ i ].position );

			//var color = bird.material.color;
			//color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

			bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
			bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

			bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
			bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;

		}

		renderer.render( scene, camera );

	}
	
	function play(){
		isPause=false;
	}
	function pause(){
		isPause=true;
	}
	function isPlaying(){
		return !isPause;
	}
	return {
		onWindowResize:onWindowResize,
		onDocumentMouseMove:onDocumentMouseMove,
		isPlaying:isPlaying,
		pause:pause,
		play:play
	}
}
