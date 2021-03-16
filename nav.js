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



  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100000 );

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

			camera.position.z = 5;


  // desk

  let deskLoader = new THREE.GLTFLoader();
  deskLoader.load('./model/desk_set/scene.gltf', function(gltf){
    desk = gltf.scene.children[0];
    desk.scale.set(1,1,1);
    desk.position.set(-1000, -2000, 1000);
    desk.rotation.set(Math.PI/2,Math.PI/3 * 3,Math.PI);
    scene.add(gltf.scene);
  });

  // Tween ///

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector3();

    // window.addEventListener('click', (event) => {
    //   event.preventDefault()
    //   // Get the mouse position
    //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    //   raycaster.setFromCamera(mouse, camera)

    //   var intersects = raycaster.intersectObjects(scene.children)
    //   for (var i=0; i<intersects.length; i++) {

    //     // Move the camera towards the object and stay 1000 above it on z axis
    //     var positionX = intersects[i].point.x
    //     var positionY = intersects[i].point.y
    //     var positionZ = (intersects[i].point.z) + 1000

    //     var positionStart = camera.position
    //     var positionEnd = { x : positionX, y: positionY, z: positionZ }
    //     var tweenPosition = new TWEEN.Tween(positionStart).to(positionEnd, 2000)
    //     tweenPosition.easing(TWEEN.Easing.Linear.None)
    //     tweenPosition.start()

    //     // Make the camera look at the object
    //     var rotationX = intersects[i].point.x
    //     var rotationY = intersects[i].point.y
    //     var rotationZ = intersects[i].point.z

    //     var rotationStart = controls.target
    //     var rotationEnd = { x : rotationX, y: rotationY, z: rotationZ }
    //     var tweenRotation = new TWEEN.Tween(rotationStart).to(rotationEnd, 2000)
    //     tweenRotation.easing(TWEEN.Easing.Linear.None)
    //     tweenRotation.start()

    //   }
    // });


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
            camera.lookAt(desk);
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
        renderer.render( scene, camera );
      };

      animate();

