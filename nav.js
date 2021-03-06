// import { Vector2 } from 'three';
// import { Int8Attribute } from 'three';
// import * as THREE from './node_modules/three/build/three.module.js';
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

// const { Vector3 } = require("three");

// body = document.querySelector('body');
// let INTERSECTED;

// glsl ///

const vertex = `
      varying vec3 v_Normal;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_radius;
      void main() {
        vUv = uv;
        // float delta = (sin(u_time) + 1.0)/2.0;
        // vec3 v = normalize(position) * u_radius;
        // vec3 pos = mix(position, delta);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        // v_Normal = normal;
      }
      `;

const fragment =`
      uniform vec3 poof;
      varying vec3 v_Normal;
      varying vec2 vUv;
      uniform float time;
      uniform float speed;
      uniform vec2 resolution;
      float rand(vec2 co){
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main () {
        vec2 v = vUv.xy * resolution;
        float brightness = fract(rand(floor(v)) + time*speed);
        brightness *= 0.5 - length(fract(v) - vec2(0.5, 0.5));
        gl_FragColor = vec4(5.0 * brightness * poof, 1.0);
        // gl_FragColor = vec4( vec3(1, 1, 2), 1.0);
      }
      `;


  //////////////////////////////////////////////////////////
  // Scene build //



  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100000 );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0xffffff)
  document.body.appendChild( renderer.domElement );

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.5;

  controls.screenSpacePanning = false;
  controls.panSpeed = 13;

  window.addEventListener( 'resize', onWindowResize );

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  // light //
  const ambientLight = new THREE.AmbientLight( 0xcccccc, 1.1 );
  scene.add( ambientLight );

  // skybox //

  let loader = new THREE.CubeTextureLoader();
    let skybox = loader.load([
      './img/skybox/px.png',
      './img/skybox/nx.png',
      './img/skybox/py.png',
      './img/skybox/ny.png',
      './img/skybox/pz.png',
      './img/skybox/nz.png',
    ]);

    scene.background = skybox;

  /// cube 1 ///
  const geometry = new THREE.BoxGeometry(5, 5, 5);
  // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        poof: { value: new THREE.Vector3(1, 1, 1) },
        u_time: { value: 0.0 },
        u_radius: { value: 20.0 },
        time: { type: "f", value: 1.0 },
        speed: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: { x: 50, y: 50 }},
        // uTexture: { value: fillColor }
      },
      // color: new THREE.Color().setStyle( fillColor ),
      // opacity: path.userData.style.fillOpacity,
      // transparent: path.userData.style.fillOpacity < 1,
      side: THREE.DoubleSide,
      depthWrite: true,
      // wireframe: guiData.fillShapesWireframe
    } );

  const cube1 = new THREE.Mesh( geometry, material );
  cube1.position.set(50, 0, 0);
  scene.add( cube1 );


  // const geometry2 = new THREE.BoxGeometry(1, 1, 1);

  // cube 2 ///
      const material2 = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
			const cube2 = new THREE.Mesh( geometry, material2 );
      cube2.position.set(-50, 0, 0);
			scene.add( cube2 );

  // cube 3 ///
      const material3 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
			const cube3 = new THREE.Mesh( geometry, material3 );
      cube3.position.set(0, 0, -50);
			scene.add( cube3 );




      // sphere 1 ///
      const geometry2 = new THREE.IcosahedronGeometry(1, 32, 8);
      const material4 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			const sphere1 = new THREE.Mesh( geometry2, material4 );
      sphere1.position.set(50, 25, -50);
			scene.add( sphere1 );

      // sphere 2 ///

      const material5 = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
			const sphere2 = new THREE.Mesh( geometry2, material5 );
      sphere2.position.set(-50, 25, -50);
			scene.add( sphere2 );

      // sphere 3 //
      const material6 = new THREE.MeshBasicMaterial( { color: 0x000000 } );
			const sphere3 = new THREE.Mesh( geometry2, material6 );
      sphere3.position.set(0, 25, 50);
			scene.add( sphere3 );



  // desk

  let deskLoader = new THREE.GLTFLoader();
  deskLoader.load('./model/desk_set/scene.gltf', function(gltf){
    desk = gltf.scene.children[0];
    desk.scale.set(1,1,1);
    desk.position.set(-1000, -2000, 1000);
    desk.rotation.set(Math.PI/2,Math.PI/3 * 3,Math.PI);
    scene.add(gltf.scene);
  });


  // video cam //

  video = document.getElementById( 'video' );

				const texture = new THREE.VideoTexture( video );

				const projGeo = new THREE.PlaneGeometry( 16, 9 );
				projGeo.scale( 1, 1, 1 );
				const projMat = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
        const proj = new THREE.Mesh( projGeo, projMat );
					proj.position.set( 50, 10, 10);
					proj.lookAt( camera.position );
					scene.add( proj );



        const proj2 = new THREE.Mesh( projGeo, projMat );
					proj2.position.set( -50, 10, 10);
					proj2.lookAt( camera.position );
					scene.add( proj2 );



        const proj3 = new THREE.Mesh( projGeo, projMat );
					proj3.position.set( 10, 10, -50);
					proj3.lookAt( camera.position );
					scene.add( proj3 );



        const proj4 = new THREE.Mesh( projGeo, projMat );
					proj4.position.set( -50, 10, -50);
					proj4.lookAt( camera.position );
					scene.add( proj4 );

          if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

            const constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };

            navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {

              // apply the stream to the video element used in the texture

              video.srcObject = stream;
              video.play();

            } ).catch( function ( error ) {

              console.error( 'Unable to access the camera/webcam.', error );

            } );

          } else {

            console.error( 'MediaDevices interface not available.' );

          }

  // Projection scene /////
  // screenScene = new THREE.Scene();

	// screenCamera = new THREE.OrthographicCamera(
	// 	window.innerWidth  / -2, window.innerWidth  /  2,
	// 	window.innerHeight /  2, window.innerHeight / -2,
	// 	-10000, 10000 );
	// screenCamera.position.z = 1;
	// screenScene.add( screenCamera );

	// var screenGeometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );

	// firstRenderTarget = renderer.setRenderTarget( 512, 512, { format: THREE.RGBFormat } );
	// var screenMaterial = new THREE.MeshBasicMaterial( { map: firstRenderTarget } );

	// var quad = new THREE.Mesh( screenGeometry, screenMaterial );
	// // quad.rotation.x = Math.PI / 2;
	// screenScene.add( quad );

	// // final version of camera texture, used in scene.
	// var planeGeometry = new THREE.BoxGeometry( 400, 200, 1, 1 );
	// finalRenderTarget = renderer.setRenderTarget( 512, 512, { format: THREE.RGBFormat } );
	// var planeMaterial = new THREE.MeshBasicMaterial( { map: finalRenderTarget } );
	// var plane = new THREE.Mesh( planeGeometry, planeMaterial );
	// plane.position.set(0,10,-50);
	// scene.add(plane);
	// // pseudo-border for plane, to make it easier to see
	// var planeGeometry = new THREE.BoxGeometry( 420, 220, 1, 1 );
	// var planeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
	// var plane = new THREE.Mesh( planeGeometry, planeMaterial );
	// plane.position.set(0,100,-502);
	// scene.add(plane);

  // Tween ///

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector3();

      window.addEventListener( 'mousemove', onMouseMove );

      function onMouseMove( event ) {

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        const intersects = raycaster.intersectObjects( scene.children );

				if ( intersects[0] ) {
          let coords = intersects[0].object.position;
          // console.log(coords.x);
          // camera.position.set(coords.x + 1);
          // camera.updateMatrix();
          window.addEventListener( 'click', onClickeroo );
          function onClickeroo(e) {
            e.preventDefault();
            console.log('hello');
            // console.log(camera.position);
            let positionStart = camera.position;
            let positionEnd = { x : coords.x + 10, y: coords.y, z: coords.z + 10 };
            console.log(positionStart);
            console.log(positionEnd);
            let tweenPosition = new TWEEN.Tween(positionStart).to(positionEnd, 3000);
            console.log(tweenPosition);
            tweenPosition.easing(TWEEN.Easing.Linear.None);
            tweenPosition.start();

            // Make the camera look at the object
            let rotationX = intersects[0].point.x
            let rotationY = intersects[0].point.y
            let rotationZ = intersects[0].point.z

            let rotationStart = controls.target
            let rotationEnd = { x : rotationX, y: rotationY, z: rotationZ }
            let tweenRotation = new TWEEN.Tween(rotationStart).to(rotationEnd, 2000)
            tweenRotation.easing(TWEEN.Easing.Linear.None)
            tweenRotation.start()
            controls.update();
            // camera.lookAt(desk);
          };
      //       controls.target.set(coords.x, coords.y, coords.z -10 );
      //       // camera.position.x = coords.x;
      //       // camera.position.y = coords.y;
      //       // camera.position.z = coords.z - 10;
      //       // camera.position.set(coords.x -5, coords.y + 5, coords.z + 5) ;
      //       // camera.lookAt(coords);
      //       camera.updateMatrix();
      //     };
        //  } else {
        //     // camera.position.set( 0, 0, 0);
        //     camera.lookAt(0,0,0);
        //     camera.updateMatrix();
        //   }
        };
      };




      function animate() {
        requestAnimationFrame( animate );

        cube1.rotation.x += 0.01;
        cube1.rotation.y += 0.01;

        cube2.rotation.x += 0.01;
        cube2.rotation.y += 0.01;

        cube3.rotation.x += 0.01;
        cube3.rotation.y += 0.01;

        TWEEN.update();

        controls.update();

        // renderer.render( screenScene, screenCamera, finalRenderTarget, true );

        renderer.render( scene, camera );
      };

      animate();

