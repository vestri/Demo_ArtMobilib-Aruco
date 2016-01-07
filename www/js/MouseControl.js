/**
 * MouseControl
 * very basic class to rotate a THREE.Object3D in a 1st person fashion with the mouse
 *
 *
 * Constructor
 *
 * MouseControl( object, direction )
 * sets the THREE.Object3D
 * (optional) direction: you can restrict the rotation to one axis,
 * by passing one of the values of MouseControlDirection
 *
 *
 * Properties
 *
 * sensitivity
 * sets the sensitivity
 * 1.0 by default
 * 
 *
 * Methods
 *
 * connect() 
 * listen to the mouse events
 *
 * update()
 * rotate the object
 *
 * disconnect()
 * remove the listeners
 */
//

MouseControlDirection = {
	HORIZONTAL: 1,
	VERTICAL: 2
};

MouseControl = function(object, direction) {
	var that = this;

	var minX = -Math.PI / 2;
	var maxX = Math.PI / 2;

	var enabled = false;

  var movement = { x: 0, y: 0 };

  this.sensitivity = 1;
  this.object = object;

  if (direction !== undefined) {
    this.horizontal = direction & MouseControlDirection.HORIZONTAL;
    this.vertical = direction & MouseControlDirection.VERTICAL;
  } else {
    this.horizontal = true;
    this.vertical = true;
  }

  this.onMouseMove = function(event) {
    enabled = true;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    movement.x += movementX;
    movement.y += movementY;
  }

  this.update = function() {
    if (enabled) {

      var euler = new THREE.Euler();
      euler.setFromQuaternion(that.object.quaternion);
      euler.reorder('YXZ');


      if (that.horizontal)
        euler.y -= movement.x / 100 * that.sensitivity;
      if (that.vertical) {
        euler.x -= movement.y / 100 * that.sensitivity;
        if (euler.x < minX)
          euler.x = minX;
        if (euler.x > maxX)
          euler.x = maxX;
      }

      that.object.quaternion.setFromEuler(euler);

    }

    movement.x = 0;
    movement.y = 0;
  }

  this.connect = function() {
    document.addEventListener('mousemove', that.onMouseMove);
  }

  this.disconnect = function() {
    document.removeEventListener('mousemove', that.onMouseMove);
    enabled = false;
  }
}