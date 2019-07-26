// mario.js

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
    element: document.getElementById("mario"),
    engine: engine,
    options: {
	    height: 600
	  }
});


const staticElements = [
	[300, 580, 600, 50],
	[750, 580, 100, 50],
];

const mario = Bodies.rectangle(100, 400, 50, 100, { friction: 0.1, label: 'mario' });

var bodies = [mario];
staticElements.forEach(element => {
	const body = Bodies.rectangle(element[0], element[1], element[2], element[3], { isStatic: true });
	bodies.push(body);
});

// add all of the bodies to the world
World.add(engine.world, bodies);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

function resetGame() {
	Body.set(mario, 'position', { x: 100, y: 400 });

}

function keyboardHandler(e) {
	const pMario = mario.position;
	const pMarioBottom = { x: pMario.x, y: pMario.y + 50 };
	var xTranslate = 0;
	console.log('mario position', pMario);
	switch (e.keyCode) {
		case 32: // space key
		case 38: // up arrow key
			console.log('space bar and up arrow key', mario);
			Body.applyForce(mario, pMario, { x: 0, y: -0.1 });
			break;

		case 65: // a key
		case 37: // left arrow key
			console.log('a or left arrow key');
			xTranslate = -10;
			break;

		case 83: // s key
		case 40: // down arrow key
			console.log('s or down arrow key');
			break;

		case 68: // d key
		case 39: // right arrow key
			console.log('d or right arrow key');
			xTranslate = 10;
			// Body.applyForce(mario, pMario, { x: 0.1, y: 0 });
			break

		case 82:
			resetGame();
			break;

		default: console.log('key', e.keyCode);
	}
	// Render.lookAt(render, mario, { x: 100, y: 100 });
	console.log(render.bounds);
	if (xTranslate != 0) {
		Body.set(mario, 'position', { x: pMario.x + xTranslate, y: pMario.y });	
		render.bounds.max.x += xTranslate;
		render.bounds.min.x += xTranslate;
		// Render.startViewTransform(render);
	}
}

document.addEventListener('keydown', keyboardHandler);
