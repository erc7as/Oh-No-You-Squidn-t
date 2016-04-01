"use strict";

class Main extends Game {
    constructor(canvas){
		super("Oh No You Squid'nt!", 1000, 600, canvas);
		this.mode = "Flirt";
		this.root = new DisplayObjectContainer("root");

		this.player = new PlayerSquid("player", "mario.png", this.root);
		this.player.setX(400);
		this.player.setY(300);

		this.npcs = new DisplayObjectContainer("npcs", null, this.root);
		for(var i = 0; i < 10; i++) {
			var npc = new Squid("npc" + i, "tophat.png", this.npcs);
			npc.setX(Math.floor(Math.random() * 800 + 1));
			npc.setY(Math.floor(Math.random() * 600 + 1));
			npc.setStrength(Math.floor(Math.random() * (this.player.strength*2 - this.player.strength/2 + 1)) + this.player.strength/2);
			npc.px = 64
			npc.py = 50;
			npc.addEventListener(QUEST_MANAGER, COLLISION);
		}
	
		this.food_layer = new DisplayObjectContainer("foods", null, this.root);
		for(var i = 0; i < 10; i++) {
			var food = new Food("food" + i, this.food_layer);
			food.setX(Math.floor(Math.random() * 800 + 1));
			food.setY(Math.floor(Math.random() * 600 + 1));
			food.addEventListener(QUEST_MANAGER, FOOD_PICKED_UP);
		}

		SCORE = new Score("score", null, this.root);

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
				}
			}
		}
		

		// Number 1 for Flirt mode
		if (pressedKeys.contains(49)) {
			this.mode = "Flirt";
		}
		// Number 2 for Fight mode
		if (pressedKeys.contains(50)) {
			this.mode = "Fight";
		}

		$("#mode").text(this.mode);
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
	game = new Main(drawingCanvas);
	game.start();
}
