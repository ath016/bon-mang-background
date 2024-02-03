/* VARIABLES **************************************************** */
// canvas setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

// object array
var ballArray = [];

// init variables
var ballNumber = undefined;
var ballRadius = 100;
var ballRange = 20;
var ballRatio = 50000;
var overlap = 0.5;
var limit = 10;

// animation variables
var frame = 0;
var duration = 100;
var refresh = 100;

// color palettes
var blkk = ['#000000'];
var whtt = ['#FFFFFF'];
var warm = ['#FFDE59', '#FFBB59', '#FF8859', '#FF8859', '#F459FF'];
var gren = ['#427F00', '#A9FF4C', '#84FF00', '#547F26', '#6ACC00'];
var lite = ['#59B5D9', '#77BF56', '#F2EA79', '#F2A057', '#F26363'];
var adel = ['#83D1BC', '#DED088', '#F5B073', '#D96459', '#E57373'];
var redd = ['#F86D20', '#F03107', '#C10202', '#730000', '#420000'];
var bech = ['#233D4D', '#FE7F2D', '#FCCA46', '#A1C181', '#579C87'];
var purp = ['#731736', '#400A34', '#EAC780', '#DA8F66', '#C03D3A'];
var bblu = ['#4AD9D9'];

// scene map
var sceneMap = new Map();
// Black
sceneMap.set(' ', {color:[blkk], bgColor:blkk, duration:[100]});
sceneMap.set('b', {color:[blkk], bgColor:blkk, duration:[100]});
// Test
sceneMap.set('q', {color:[redd], bgColor:blkk, duration:[0.25]});
sceneMap.set('w', {color:[bech], bgColor:blkk, duration:[0.5]});
sceneMap.set('e', {color:[purp], bgColor:blkk, duration:[1]});
sceneMap.set('r', {color:[gren], bgColor:blkk, duration:[1.5]});
// Nick
sceneMap.set('y', {color:[whtt], bgColor:bblu, duration:[1.5]});
// Adelaide
sceneMap.set('t', {color:[adel], bgColor:blkk, duration:[0.85]});
// Kent
sceneMap.set('a', {color:[bech], bgColor:blkk, duration:[1.25]});
sceneMap.set('s', {color:[lite, warm], bgColor:blkk, duration:[1, 1, 1, 1, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]});
sceneMap.set('d', {color:[purp], bgColor:blkk, duration:[0.9]});
sceneMap.set('f', {color:[adel], bgColor:blkk, duration:[0.4]});

// scene variables
var scene = sceneMap.get(' ');
var sceneCounter = 0;
var colorArray = scene.color[sceneCounter];
var colorCounter = 0;
var bgColor = scene.bgColor[sceneCounter];
var bgColorCounter = 0;

// spot variables
var spot = new Ball(0,0, 1);
spot.color = 'white';
var spotRange = [1, 150, 125, 100, 75, 50];



/* OBJECT ******************************************************* */

function Ball(x, y, radius) {
	// internal variables
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = randColor();
	
	// draw function
	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
	}; // end of draw
} // end of class circle



/* FUNCTIONS **************************************************** */

// collision check
function collision(ball, otherBall) {
	// variables
	var distX = otherBall.x - ball.x;
	var distY = otherBall.y - ball.y;
	var dist = otherBall.radius + ball.radius;
	
	// check distance
	if(Math.sqrt(distX * distX + distY * distY) - dist * overlap < 0) {
		return 1;
	} // end of if
	
	return 0;
} // end of check

// fill ball array
function fillBallArray() {
	// clear ball array
	ballArray = [];
	
	// temperary ball variable
	var ball = undefined;
	
	// other variables
	var radius = undefined;
	var x = undefined;
	var y = undefined;
	var timeout = 0;
	
	// fill ball array
	for(var counter = 0, index = 0; counter < ballNumber; counter++) {
		// assign random numbers
		radius = Math.random() * ballRange + ballRadius;
		x = (canvas.width - 2 * radius) * Math.random() + radius;
		y = (canvas.height - 2 * radius) * Math.random() + radius;
		
		// create ball object
		ball = new Ball(x, y, radius);
		
		for(index = 0; index < ballArray.length; index++) {
			if(collision(ballArray[index], ball) && timeout < limit) {
				counter--;
				timeout++;
				break;
			} // end of if
		} // end of for
	
		if(index == ballArray.length) {
			ballArray.push(ball);
			
			// reset timeout
			timeout = 0;
		} // end of if
	} // end of for
} // end of fill ball array

// random color function
function randColor() {
	return colorArray[colorCounter++ % colorArray.length];
	//return colorArray[Math.floor(Math.random()*colorArray.length)];
} // end of random color

// initiation
function init() {
	// update canvas dimension
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	// update ball number
	ballNumber = canvas.width * canvas.height / ballRatio;
	
	// fill ball array
	fillBallArray();
} // end of init

// animation function
function animate() {
	// opacity
	c.globalAlpha=1;
	// fill background
	c.fillStyle = bgColor;
	c.fillRect(0, 0, canvas.width, canvas.height);
	
	// opacity
	c.globalAlpha=0.75;
	// update button
	ballArray.forEach(ball => {
		ball.draw();
	}); // end of for each */
	
	// opacity
	c.globalAlpha=0.85;
	// draw spotlight
	spot.draw();
} // end of animate



/* EVENT ******************************************************** */


var interval = setInterval(function() {
	animate();
	
	// check frame
	if(frame === 0) {
		// update colors
		colorArray = scene.color[sceneCounter % scene.color.length];
		
		// update duration
		duration = scene.duration[sceneCounter % scene.duration.length];
		
		// update background color
		bgColor = scene.bgColor[sceneCounter % scene.bgColor.length];
		
		// update scene counter
		sceneCounter++;
		
		// updata ball array
		fillBallArray();
	} // end of if
	
	// update global frame
	frame = (frame + 1) % (duration * refresh);
}, 1000 / refresh); // end of set interval

//window.clearInterval(interval);

window.addEventListener('resize', function() {
	init();
}) // end of resize event listener

window.addEventListener('mousemove', function(event) {
	// update spot light location
	spot.x = event.clientX;
	spot.y = event.clientY;
}) // end of mouse move event listener

window.addEventListener('keydown', function(event) {
	// check key in map
	if(sceneMap.has(event.key)) {
		// update scene
		scene = sceneMap.get(event.key);
		
		// reset scene counter
		sceneCounter = 0;
		// reset frame
		frame = 0;
		
		// update backgound color array
		bgColor = scene.bgColor[sceneCounter];
		// update color
		colorArray = scene.color[sceneCounter];
		// update duration
		duration = scene.duration[sceneCounter];
	} // end of if
	
	// update spotlight
	if(event.key == 'h') {spot.radius = spotRange[0];} // end of if
	if(event.key == 'j') {spot.radius = spotRange[1];} // end of if
	if(event.key == 'k') {spot.radius = spotRange[2];} // end of if
	if(event.key == 'l') {spot.radius = spotRange[3];} // end of if
	if(event.key == ';') {spot.radius = spotRange[4];} // end of if
	if(event.key == '\'') {spot.radius = spotRange[5];} // end of if
	
}) // end of keydown event listener



/* START UP ***************************************************** */

init();
