var gl; // Application WebGL instance
var program; // Shader program (should contain vertex & fragment shaders)

var transY1 = 0.0; // Variable containing vertical translation for first paddle
var transY2 = 0.0; // Variable containing vertical translation for second paddle

var transYLoc; // transY Uniform location from shader

var keys = {}; // Variable used to store currently pressed keys

var leftpaddle, rightpaddle, ball, field; // Game objects

/* initObjects(): Initialize game state for all basic game objects */
function initObjects() {
  // P1
  leftpaddle = { 
    x: -0.875,
    y: 0,
    w: 0.05,
    h: 0.5,
    speed: 0,
    vertices: [
      vec2(-0.9, 0.25),
      vec2(-0.85, 0.25),
      vec2(-0.85, -0.25),
      vec2(-0.9, -0.25)
    ]
  };

  // P2
  rightpaddle = {
    x: 0,
    y: 0,
    w: 0.05,
    h: 0.5,
    speed: 0,
    vertices: [
      vec2(0.85, 0.25),
      vec2(0.9, 0.25),
      vec2(0.9, -0.25),
      vec2(0.85, -0.25)
    ]
  };

  // Tennis ball
  ball = {
    x: 0,
    y: 0,
    w: 0.04,
    h: 0.04,
    speed: 0,
    vertices: [
      vec2(-0.02, 0.02),
      vec2(0.02, 0.02),
      vec2(0.02, -0.02),
      vec2(-0.02, -0.02)
    ]
  };
  
  // Play field
  field = {
    score1: 0, // P1 score
	score2: 0, // P2 score
	vertices: [
	  
	]
  };
}

/* initGL(): Spin up initial WebGL program state */
function initGL(){
  var canvas = document.getElementById( "canvas" ); // Grab canvas from HTML

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, 800, 800); // Viewport size 800x800
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 ); // Background color is black!

  initObjects(); // Spin up game state

  program = initShaders( gl, "vertex-shader", "fragment-shader" ); // Spin up our shader programs
  gl.useProgram( program ); // Bind shader program 'program' to currently used set of shaders

  var vertexBuffer = gl.createBuffer(); // Initialize buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // Bind vertexBuffer to currently used buffer

  var vertexPositionLoc = gl.getAttribLocation(program, "vertexPosition"); // Get 'vertexPosition' uniform
                                                                           // location from shader program
  gl.vertexAttribPointer(vertexPositionLoc, 2, gl.FLOAT, false, 0, 0); // Initialize it as an Attrib Array
  gl.enableVertexAttribArray(vertexPositionLoc); // Bind it as currently used attrib array

  transYLoc = gl.getUniformLocation(program, "transY"); // Populate global variable w/ transY location

  render();
}

/* render(): Main event loop, controls vertex/fragment rendering and fires 
   collision detection/score update functions when necessary. */
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT); // Clear the buffer

  renderLeftPaddle();
  renderBall();
  renderRightPaddle();

  var fragColorLoc = gl.getUniformLocation(program, "fragColor"); // TODO: This should be moved out
  gl.uniform4f(fragColorLoc, 1.0, 1.0, 1.0, 1.0); // Set pixel color uniform to white

  keyUpdate(); // Check player key presses once per frame (60hz)
  ballCollisionUpdate(); // Check ball collision

  requestAnimFrame(render); // Inform the browser we're ready to render another frame
}

/* renderLeftPaddle(): Render P1 vertices */
function renderLeftPaddle() {
  gl.bufferData(gl.ARRAY_BUFFER, flatten(leftpaddle.vertices), gl.STATIC_DRAW);
  gl.uniform1f(transYLoc, transY1);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, leftpaddle.vertices.length);
}

/* renderRightPaddle(): Render P2 vertices */
function renderRightPaddle() {
  gl.bufferData(gl.ARRAY_BUFFER, flatten(rightpaddle.vertices), gl.STATIC_DRAW);
  gl.uniform1f(transYLoc, transY2);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, rightpaddle.vertices.length);
}

var foo = 0; // Really, Ben?
var meow = 1; // REALLY, Ben?

/* renderBall(): I mean...yeah. Renders the ball. */
function renderBall() {
  gl.bufferData(gl.ARRAY_BUFFER, flatten(ball.vertices), gl.STATIC_DRAW);
  gl.uniform1f(transYLoc, ball.y);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, ball.vertices.length);
  foo = 0.01 * meow;
  ball.y = ball.y + foo;
}

/* ballCollisionUpdate(): Initial function for ball collision checks */
function ballCollisionUpdate() {
  console.log(foo);
  console.log(ball.y);
  if(ball.y > 1) {
    meow = -1;
  }
  if(ball.y < -1) {
    meow = 1;
  }
}

/* keyUpdate(): Checks for current key presses, and updates the player position accordingly */
function keyUpdate() {
  if(keys[87]) transY1 += 0.05; // W -- Move P1 paddle up
  if(keys[83]) transY1 -= 0.05; // S -- Move P1 paddle down

  if(keys[38]) transY2 += 0.05; // Up cursor key -- move P2 paddle up
  if(keys[40]) transY2 -= 0.05; // Down cursor key -- move P2 paddle down
}

/* keyDown(): Fires when key is pressed down, sets that key to pressed in the global keys variable */
// TODO: Less memory intensive way of doing this?
function keyDown(event) { 
  keys[event.keyCode] = true;
}

/* keyUp(): Fires when key is released, sets that key to un-pressed in the global keys variable */
function keyUp(event) {
  keys[event.keyCode] = false;
}
