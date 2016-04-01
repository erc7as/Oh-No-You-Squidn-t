"use strict";

class Main extends Game {
    constructor(canvas){
		super("Oh No You Squid'nt!", 1000, 600, canvas);
		this.root = new DisplayObjectContainer("root");
		this.npcs = new DisplayObjectContainer("npcs", null, this.root);
		this.food_layer = new DisplayObjectContainer("foods", null, this.root);

		this.player = new PlayerSquid("player", "mario.png", this.root);
		this.player.setX(400);
		this.player.setY(300);
		PLAYER = this.player; // Include a global reference to player
		
		SCORE = new Score("score", null, this.root);
		SOUND_MANAGER.loadSoundEffect("coin", "coin.wav");
		SPAWNER.setSquidContainer(this.npcs);
		SPAWNER.setFoodContainer(this.food_layer);
		for(var i = 0; i < 10; i++){
			SPAWNER.spawnFood();
			SPAWNER.spawnSquid();
		}
    }

    update(pressedKeys){
		super.update(pressedKeys);
		this.root.update(pressedKeys);

		for(var i = 0; i < this.food_layer.children.size(); i++) {
			var food = this.food_layer.children.get(i);
			if (food.exitTween1 != null) {
				if (food.exitTween1.isComplete()) {
					food.dispatchEvent(new FoodExit1(food));
					//this.food_layer.children.remove(food);
				}
			}
		}
		
		
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
