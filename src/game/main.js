"use strict";

class Main extends Game {
    constructor(canvas){
    	var width = 1000;
    	var height = 550;
		super("Oh No You Squid'nt!", width, height, canvas);
		this.width = width;
		this.height = height;		

		this.mode = "Flirt";
		this.root = new DisplayObjectContainer("root");
		this.npcs = new DisplayObjectContainer("npcs", null, this.root);
		this.food_layer = new DisplayObjectContainer("foods", null, this.root);

		this.player = new PlayerSquid("player", "player.png", this.root);
		this.player.setX(400);
		this.player.setY(300);
		PLAYER = this.player; // Include a global reference to player
		
		this.player.eyes = new Sprite("eyes", "eyes.png", this.player);
		this.player.eyes.x = 27;
		this.player.eyes.y = 44;
		// Moved into spawner

		// this.npcs = new DisplayObjectContainer("npcs", null, this.root);
		// for(var i = 0; i < 10; i++) {
		// 	var npc = new Squid("npc" + i, "tophat.png", this.npcs);
		// 	npc.setX(Math.floor(Math.random() * 800 + 1));
		// 	npc.setY(Math.floor(Math.random() * 600 + 1));
		// 	npc.setStrength(Math.floor(Math.random() * (this.player.strength*2 - this.player.strength/2 + 1)) + this.player.strength/2);
		// 	npc.px = 64
		// 	npc.py = 50;
		// 	npc.addEventListener(QUEST_MANAGER, COLLISION);
		// }
	
		// this.food_layer = new DisplayObjectContainer("foods", null, this.root);
		// for(var i = 0; i < 10; i++) {
		// 	var food = new Food("food" + i, this.food_layer);
		// 	food.setX(Math.floor(Math.random() * 800 + 1));
		// 	food.setY(Math.floor(Math.random() * 600 + 1));
		// 	food.addEventListener(QUEST_MANAGER, FOOD_PICKED_UP);
		// }

		SCORE = new Score("score", null, this.root, width);
		SOUND_MANAGER.loadSoundEffect("coin", "coin.wav");
		SOUND_MANAGER.loadSoundEffect("flirt", "flirt.wav");
		SOUND_MANAGER.loadSoundEffect("fightWon", "fightWon.wav");
		SOUND_MANAGER.loadSoundEffect("fightLost", "fightLost.wav");

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
				}
			}
		}
		

		// Number 1 for Flirt mode
		if (pressedKeys.contains(49)) {
			this.mode = "Flirt";
			this.player.displayImage = this.player.defaultImage;
		}
		// Number 2 for Fight mode
		if (pressedKeys.contains(50)) {
			this.mode = "Fight";
			this.player.displayImage = this.player.movingImages.fight.Default;
		}

		$("#mode").text(this.mode);

		if (this.player.lives == 0)
			this.pause();
    }

    draw(g){
		g.clearRect(0, 0, this.width, this.height);
		super.draw(g);
		this.root.draw(g);
    }

    /**
	 * Loads images for game
	 */
	loadImage(filename){
		var t = this;
		this.displayImage = new Image();
  		this.displayImage.onload = function(){
  			t.loaded = true;
  			t.w = this.width;
  			t.h = this.height;
  		};
  		this.displayImage.src = 'resources/' + filename;
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
