"use strict";

class Main extends Game {
    constructor(canvas){
		super("Oh No You Squid'nt!", 1000, 600, canvas);
		this.root = new DisplayObjectContainer("root");

		// Add AI Squids
		this.npcs = new DisplayObjectContainer("npcs", null, this.root);
		for(var i = 0; i < 10; i++) {
			var npc = new Squid("npc" + i, "tophat.png", this.npcs);
			npc.setX(Math.floor(Math.random() * 800 + 1));
			npc.setY(Math.floor(Math.random() * 600 + 1));
			npc.px = 64
			npc.py = 50;
		}
	
		// Add Food
		this.food_layer = new DisplayObjectContainer("foods", null, this.root);
		for(var i = 0; i < 10; i++) {
			var food = new Food("food" + i, this.food_layer);
			food.setX(Math.floor(Math.random() * 800 + 1));
			food.setY(Math.floor(Math.random() * 600 + 1));
			food.addEventListener(QUEST_MANAGER, FOOD_PICKED_UP);
		}


		this.player = new PlayerSquid("player", "mario.png", this.root);
		this.player.setX(400);
		this.player.setY(300);

		SCORE = new Score("score", null, this.root);

		this.SPAWNER = new Spawner();
		this.SPAWNER.setSquidContainer(this.npcs);
		this.SPAWNER.setFoodContainer(this.food_layer);
		for(var i = 0; i < 100; i++){
			this.SPAWNER.spawnFood();
			this.SPAWNER.spawnSquid();
		}
		SOUND_MANAGER.loadSoundEffect("coin", "coin.wav");
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
