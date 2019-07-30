// marco.js
const viewportHeight = 600;
const viewportWidth = 900;
const featureSize = 50;

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.getElementById("marco"),
    engine: engine,
    options: {
	    height: viewportHeight,
	    width: viewportWidth,
	    wireframe: true,
	  }
});


const staticElements = [
	[0, 0, 12, 1],
	[14, 0, 2, 1],
	[14, 5, 2, 1],
	[17, 0, 4, 1],
];

const marco = Bodies.rectangle(300, 400, 50, 100, { friction: 0.1, label: 'marco' });

var bodies = [marco];
staticElements.forEach(element => {
	let w = element[2] * featureSize;
	let x = element[0] * featureSize + w / 2;
	let h = element[3] * featureSize;
	let y = viewportHeight - (element[1] * featureSize + h / 2);
	console.log(x, y, w, h);
	const body = Bodies.rectangle(x, y, w, h, { isStatic: true });
	bodies.push(body);
});

// add all of the bodies to the world
World.add(engine.world, bodies);

// Keyboard states.
let upKey = false;
let downKey = false;
let leftKey = false;
let rightKey = false;
let shiftKey = false;

let framerate = 60;

let viewportX = 0;
let viewportY = 0;


function moveViewport(delta) {
	viewportX += delta;
	render.bounds.min.x = viewportX;	
	render.bounds.max.x = viewportX + viewportWidth;	
	Render.endViewTransform(render);
	Render.startViewTransform(render);
}



// Main game loop
function gameLoop() {
	Engine.update(engine, 1000 / framerate);
	const pMario = marco.position;
	if (marco.angularVelocity != 0)
		Body.setAngularVelocity(marco, 0);

	if (!shiftKey) {

		let xSpeed = rightKey ? 5 : (leftKey ? -5 : 0);
		let ySpeed = upKey ? -5 : 0;
		Body.setVelocity(marco, { x: xSpeed, y: ySpeed ? ySpeed : marco.velocity.y });	

	} else {

		if (rightKey)
			moveViewport(5);
		else if (leftKey)
			moveViewport(-5);

	}

	if (marco.position.y > viewportHeight * 2)
		resetGame();

	if (marco.position.y < 0)
		Body.setPosition(marco, { x: marco.position.x, y: 0 });

	// console.log(marco.position.x, render.bounds.min.x);
	if (marco.position.x > render.bounds.max.x - viewportWidth / 3)
		moveViewport(marco.position.x - (render.bounds.max.x - viewportWidth / 3));
	if (marco.position.x < render.bounds.min.x + viewportWidth / 3)
		moveViewport(marco.position.x - (render.bounds.min.x + viewportWidth / 3));


	document.getElementById("xDisplay").innerText = Math.floor(marco.position.x.toString());	
	document.getElementById("yDisplay").innerText = Math.floor(marco.position.y.toString());	
	setTimeout(gameLoop, 1000 / framerate);
}

// run the renderer
Render.run(render);

function resetGame() {
	Body.setPosition(marco, { x: 100, y: 400 });
	Body.setAngularVelocity(marco, 0);
	Body.setVelocity(marco, {x: 0, y: 0 });
	Render.endViewTransform(render);
}


function keyHandler(e, pressed) {
	switch (e.keyCode) {
		case 32: // space key
		case 38: // up arrow key
			upKey = pressed;
			break;

		case 65: // a key
		case 37: // left arrow key
			leftKey = pressed;
			break;

		case 83: // s key
		case 40: // down arrow key
			downKey = pressed;
			break;

		case 68: // d key
		case 39: // right arrow key
			rightKey = pressed;
			break

		case 82:
			resetGame();
			break;

		case 16:
			shiftKey = pressed;
			break;

		default: console.log('key', (pressed ? 'pressed' : 'lifted'), e.keyCode);
	}
}


document.addEventListener('keydown', e => keyHandler(e, true));
document.addEventListener('keyup', e => keyHandler(e, false));

gameLoop();
