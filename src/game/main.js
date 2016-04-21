"use strict";

class Main extends Game {
    constructor(canvas){
    	var width = 1000;
    	var height = 550;
		super("Oh No You Squid'nt!", width, height, canvas);
		this.width = width;
		this.height = height;
		this.n = 1;
		this.n2 = 1;
		this.n3 = 0;

		this.height = height;	
		document.getElementById("gameContainer").style.width = width + "px";	
		document.getElementById("gameContainer").style.height = height + "px";	

		canvasHitbox = new Hitbox(0, 0, 1000, 500);

		this.mode = "Flirt";
		this.paused = true;		// Initially paused so user can click "Start Game"

		this.root = new DisplayObjectContainer("root");

		//this.npcs = new DisplayObjectContainer("npcs", null, this.root);
		//this.food_layer = new DisplayObjectContainer("foods", null, this.root);
		//this.sharks = new DisplayObjectContainer("sharks", null, this.root);


		this.game_layer = new DisplayObjectContainer("game", null, this.root);
		this.npcs = new DisplayObjectContainer("npcs", null, this.game_layer);
		this.food_layer = new DisplayObjectContainer("foods", null, this.game_layer);
		this.sharks = new DisplayObjectContainer("sharks", null, this.game_layer);

		this.player = new PlayerSquid("player", "player.png", this.game_layer);
		this.player.setX(400);
		this.player.setY(300);
		PLAYER = this.player; // Include a global reference to player
		
		this.player.eyes = new Sprite("eyes", "eyes.png", this.player);
		this.player.eyes.x = 27;
		this.player.eyes.y = 44;

		SCORE = new Score("score", null, this.game_layer, width);
		SOUND_MANAGER.loadSoundEffect("coin", "coin.wav");
		SOUND_MANAGER.loadSoundEffect("flirt", "flirt.wav");
		SOUND_MANAGER.loadSoundEffect("fightWon", "fightWon.wav");
		SOUND_MANAGER.loadSoundEffect("fightLost", "fightLost.wav");

		SPAWNER.setSquidContainer(this.npcs);
		SPAWNER.setFoodContainer(this.food_layer);
		SPAWNER.setSharkContainer(this.sharks);
		for(var i = 0; i < 10; i++){
			SPAWNER.spawnFood();
			SPAWNER.spawnSquid();
		}

		// Powerups
		this.powerUps_layer = new DisplayObjectContainer("powerUps", null, this.game_layer);
		SPAWNER.setPowerupContainer(this.powerUps_layer);
		// var speed = new Sprite("speed", "gem_green.png", this.powerUps_layer);
		// speed.x = 50;
		// speed.y = 100;
		// speed.event = POWER_UP.SPEED;
		// speed.addEventListener(QUEST_MANAGER, POWER_UP.SPEED);


		// Make info screen (for initial, pause, and end game)
		this.infoScreen = new Info("info", null, this.root, width, height);
		this.game_layer.setVisible(false);

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

		// Spacebar for pause
		if (pressedKeys.contains(32)) {
			this.infoScreen.show(this.infoScreen.PAUSE);
		}

		$("#mode").text(this.mode);

		if (this.player.lives == 0)
			this.infoScreen.show(this.infoScreen.END);

		if(this.player.strength > (this.n * 20)){
			SPAWNER.spawnShark();
			this.n++;
		}

		if(SCORE.score > (this.n2 * 10)) {
			SPAWNER.spawnShark();
			this.n2++;
		}

		if(this.player.strength > ((this.n3 * 20) + 100)){
			SPAWNER.spawnShark();
			this.n3++;
		}

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
