"use strict";

class Main extends Game {
    constructor(canvas){
	super("Oh No You Squid'nt!", 800, 600, canvas);
	this.player = new Squid("player", "mario.png");
    }

    update(pressedKeys){
	super.update(pressedKeys);
    }

    draw(g){
	super.draw(g);
	this.player.draw(g);
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
