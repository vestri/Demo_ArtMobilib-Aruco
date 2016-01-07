ArucoThree = function(isDevice) {
  var that = this;

  var _webcam_grabbing; // background
  var _scene;
  var _canvas;

  var _mouseControl;
  var _orientationControl;
  var _keyboardControl;
  var _geolocationControl;

  var _device_lock_screen = new DeviceLockScreenOrientation();

  var _video_grabbing;  // video Frozen, contents
  var _js_aruco_marker;
  var _trackedObjManager;

  function createCanvasElementGlobal(id) {

    var canvas = document.createElement('canvas');

    canvas.id = id;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.style.position = 'absolute';
    canvas.style.top = '0px';
    canvas.style.left = '0px';

    document.body.appendChild(canvas);

    return canvas;
  }


  this.run = function() {

    _device_lock_screen.LockPortrait();

    var three_canvas = createCanvasElementGlobal('canvasthree');


    var _geo_converter = new GeographicCoordinatesConverter();
    _geo_converter.SetOriginFromDegres(43.7141516, 7.2889739);

    _scene = new Scene( { canvas: three_canvas, fov: 40, gps_converter: _geo_converter } );
    _scene.Init();


    if (typeof cordova != 'undefined'
      && typeof cordova.plugins != 'undefined'
      && typeof cordova.plugins.CameraFov != 'undefined') {
      
      console.log('CameraFovPlugin start');
      
      cordova.plugins.CameraFov.getCameraFov('environment', function(fov) {
        console.log('Success :', fov);
        _scene.getCamera().fov = fov;
      } );
    }

    // Create background
    _webcam_grabbing = new THREEx.WebcamGrabbing();
    document.body.appendChild(_webcam_grabbing.domElement);

    // Create scene
    _video_grabbing = new THREEx.VideoGrabbing();
    _video_grabbing.domElement.src = './assets/videos/frozen360p.mp4';
    imageGrabbing = new THREEx.ImageGrabbing();
    imageGrabbing.domElement.src = './assets/images/lehublot.jpg';

    _scene.Load('assets/scenes/scene.json');

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    _scene.AddObject(light);


    var texture = new THREE.Texture(_video_grabbing.domElement);
    texture.minFilter = THREE.LinearFilter;
    
    var material = new THREE.MeshBasicMaterial( { map: texture } );
    var planeGeometry = new THREE.PlaneGeometry(1, 1);
    var mesh = new THREE.Mesh(planeGeometry, material);
    mesh.position.z = -2;
    mesh.position.x = 0.3;


    // Orient camera
    _mouseControl = new MouseControl(_scene.GetCameraBody());
    _mouseControl.connect();

    _orientationControl = new DeviceOrientationControl(_scene.GetCamera());
    _orientationControl.Connect();

    // Move camera
    _keyboardControl = new KeyboardControl(_scene.GetCameraBody());
    _keyboardControl.connect();

    //_geolocationControl = new GeolocationControl(_scene.GetCameraBody(), _geo_converter);
    //_geolocationControl.Connect();


    // Start Aruco and helper
    _js_aruco_marker = new THREEx.JsArucoMarker();
    _trackedObjManager = new TrackedObjManager( { camera: _scene.GetCamera() } );
    _trackedObjManager.Add(mesh, 'mesh', _scene.AddObject, _scene.RemoveObject);


    // Main loop
    (function loop() {

      requestAnimationFrame(loop);

      if (_video_grabbing.domElement.readyState == _video_grabbing.domElement.HAVE_ENOUGH_DATA)
        texture.needsUpdate = true;

      _mouseControl.update();
      _keyboardControl.update();
      _orientationControl.Update();
      //_geolocationControl.Update();


      var markers = _js_aruco_marker.detectMarkers(_webcam_grabbing.domElement);

      for (marker of markers) {
        if (marker.id == 1001) {
          var o = new THREE.Object3D();
          _js_aruco_marker.markerToObject3D(marker, o);
          _trackedObjManager.TrackCompose('mesh', o.position, o.quaternion, o.scale);
        }
      }

      _trackedObjManager.Update();


      _scene.Update();
      _scene.Render();

    })();
  }
}