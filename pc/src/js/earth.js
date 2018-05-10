function earth(){
	var runAnim=true;
	var scene;
	var render;
	function init(){
		var container=document.getElementById("earthId");
		var wt=parseInt(container.clientWidth)||400;
		var ht=parseInt(container.clientHeight)||400;

		scene = new THREE.Scene();

		let fieldOfView = 40,
			aspectRatio = wt/ht,
			near = 0.1,
			far = 400;

		const camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, near, far );
		camera.position.z = 80;
		camera.position.x = 0;
		camera.position.y = 0;

		var myGreenScreenMaterial = new THREEx.ChromaKeyMaterial("src/img/globe.mp4", 0xff0000);
		var movieGeometry = new THREE.SphereGeometry(21, 50, 50);
		var vidField = new THREE.Mesh(movieGeometry, myGreenScreenMaterial);
		scene.add(vidField);

		const renderer = new THREE.WebGLRenderer({alpha:true});
		renderer.setSize(wt, ht);
		container.appendChild( renderer.domElement );

		render = () => {
			if(runAnim){
				requestAnimationFrame( render );
				//planet.rotation.y += 0.0006;
				//cloud.rotation.y += 0.0004;
				myGreenScreenMaterial.update();
				vidField.rotation.y += 0.002;
				renderer.render( scene, camera );
			}
		};
		render();
		var orbit = new THREE.OrbitControls( camera, renderer.domElement );
	}

	function pause(){
		runAnim=false;
	}
	function play(){
		runAnim=true;
		render();
	}
	function isPlaying(){
		return runAnim;
	}

	function disposeNode (node)
	{
		if (node instanceof THREE.Mesh)
		{
			if (node.geometry)
			{
				node.geometry.dispose ();
			}

			if (node.material)
			{
				if (node.material instanceof THREE.MeshFaceMaterial)
				{
					$.each (node.material.materials, function (idx, mtrl)
					{
						if (mtrl.map)           mtrl.map.dispose ();
						if (mtrl.lightMap)      mtrl.lightMap.dispose ();
						if (mtrl.bumpMap)       mtrl.bumpMap.dispose ();
						if (mtrl.normalMap)     mtrl.normalMap.dispose ();
						if (mtrl.specularMap)   mtrl.specularMap.dispose ();
						if (mtrl.envMap)        mtrl.envMap.dispose ();

						mtrl.dispose ();    // disposes any programs associated with the material
					});
				}
				else
				{
					if (node.material.map)          node.material.map.dispose ();
					if (node.material.lightMap)     node.material.lightMap.dispose ();
					if (node.material.bumpMap)      node.material.bumpMap.dispose ();
					if (node.material.normalMap)    node.material.normalMap.dispose ();
					if (node.material.specularMap)  node.material.specularMap.dispose ();
					if (node.material.envMap)       node.material.envMap.dispose ();

					node.material.dispose ();   // disposes any programs associated with the material
				}
			}
		}
	}   // disposeNode

	function disposeHierarchy (node, callback)
	{
		for (var i = node.children.length - 1; i >= 0; i--)
		{
			var child = node.children[i];
			disposeHierarchy (child, callback);
			callback (child);
		}
	}
	function clean(){
		runAnim=false;
		disposeHierarchy (scene, disposeNode);
	}
	return {
		init:init,
		clean:clean,
		pause:pause,
		play:play,
		isPlaying:isPlaying
	}
}