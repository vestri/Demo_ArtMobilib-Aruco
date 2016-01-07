/**
 * KeyboardControl
 * very basic class to move a THREE.Object3D in a 1st person fashion, using 'zqsd' by default
 *
 *
 * Constructor
 *
 * KeyboardControl( object )
 * sets the THREE.Object3D
 *
 *
 * Properties
 *
 * speed
 * sets the speed at wich the object move
 * 1.0 by default
 * 
 *
 * Methods
 *
 * connect() 
 * listen to the keyboard events
 *
 * update()
 * move the object
 *
 * disconnect()
 * remove the listeners
 */
//

var KeyboardControl = function(object) {
	var that = this;

	this.object = object;

	this.speed = 1;

  this.forwardKey = 90;
  this.backwardKey = 83;
  this.rightwardKey = 68;
  this.leftwardKey = 81;

  var enabled = false;

  var fwd = false, bwd = false, lwd = false, rwd = false;

  function onKeyDown(event) {
    enabled = true;
    if (event.which == that.forwardKey)
      fwd = true;
    else if (event.which == that.backwardKey)
      bwd = true;
    else if (event.which == that.leftwardKey)
      lwd = true;
    else if (event.which == that.rightwardKey)
      rwd = true;
  }

  function onKeyUp(event) {
    if (event.which == that.forwardKey)
      fwd = false;
    else if (event.which == that.backwardKey)
      bwd = false;
    else if (event.which == that.leftwardKey)
      lwd = false;
    else if (event.which == that.rightwardKey)
      rwd = false;
  }

  this.update = function() {
    var x = 0, z = 0;

    if (enabled) {
      if (fwd)
        z -= that.speed;
      if (bwd)
        z += that.speed;
      if (lwd)
        x -= that.speed;
      if (rwd)
        x += that.speed;

      that.object.translateX(x);
      that.object.translateZ(z);
    }
  };

  this.connect = function() {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  };

  this.disconnect = function() {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    fwd = false;
    bwd = false;
    lwd = false;
    rwd = false;
  };
};