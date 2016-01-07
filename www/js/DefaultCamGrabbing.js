DefaultCamGrabbing = function() {
  var domElement = document.createElement('video');
  domElement.setAttribute('autoplay', true);
  domElement.style.zIndex = -1;
  domElement.style.position = 'absolute';
  domElement.style.top = '0px'
  domElement.style.left = '0px'
  domElement.style.width = '100%'
  domElement.style.height = '100%'


  compatibility.getUserMedia( { video: true, audio: false }, function(stream){
    domElement.src = compatibility.URL.createObjectURL(stream);
  }, function(error) {
    console.error("Cant getUserMedia()! due to ", error);
  });

  this.domElement = domElement;
};