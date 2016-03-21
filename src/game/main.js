"use strict";

class Main extends Game {
    constructor(canvas){
	super("Oh No You Squid'nt!", 800, 600, canvas);
	this.root = new DisplayObjectContainer("root");
	this.player = new Squid("player", "mario.png", this.root);
	this.player.setX(400);
	this.player.setY(300);
    }

    update(pressedKeys){
	
	super.update(pressedKeys);
	this.root.update();
    }

    draw(g){
	g.clearRect(0, 0, this.width, this.height);
	super.draw(g);
	this.root.draw(g);
    }
}


/**
 * THIS IS THE BEGINNING OF THE PROGRAM
 * YOU NEED TO COPY THIS VERBATIM ANYTIME YOU CREATE A GAME
 */
function tick(){
	game.nextFrame();
	gameClock++;
}

/* Get the drawing canvas off of the  */
var drawingCanvas = document.getElementById('game');
if(drawingCanvas.getContext) {
	var game = new Main(drawingCanvas);
	game.start();
}
