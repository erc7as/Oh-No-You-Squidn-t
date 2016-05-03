"use strict";

class Instructions {
    constructor(canvas){
    	Instructions.instance = this;
		this.gameId = "Instructions";
		this.width = 1000;
		this.height = 550;
		this.canvas = canvas;
		this.canvas.setAttribute("width", this.width);
		this.canvas.setAttribute("height", this.height);

		this.g = canvas.getContext('2d'); //the graphics object
		this.playing = false;

		this.pressedKeys = new ArrayList();

		this.animation = null;

		/* Setup a key listener */
		window.addEventListener("keydown", kdl, true);
		window.addEventListener("keyup", kul, true);
		this.n = 1;
		this.n2 = 1;
		this.n3 = 0;

		document.getElementById("gameContainer").style.width = this.width + "px";	
		document.getElementById("gameContainer").style.height = this.height + "px";	

		canvasHitbox = new Hitbox(0, 0, 1000, 500);
		this.mode = "Flirt";

		this.root = new DisplayObjectContainer("root");
		this.game_layer = new DisplayObjectContainer("game", null, this.root);
		this.food_layer = new DisplayObjectContainer("foods", null, this.game_layer);
		this.npcs = new DisplayObjectContainer("npcs", null, this.game_layer);
		this.sharks = new DisplayObjectContainer("sharks", null, this.game_layer);	

		SCORE = new Score("score", null, this.game_layer, this.width);
		SOUND_MANAGER.loadSoundEffect("food", "pick_up.wav");
		SOUND_MANAGER.loadSoundEffect("gem", "ping.wav");
		SOUND_MANAGER.loadSoundEffect("success_flirt", "success.wav");
		SOUND_MANAGER.loadSoundEffect("fail", "fail.mp3");
		SOUND_MANAGER.loadSoundEffect("success_fight", "bloibb.mp3");
		SOUND_MANAGER.loadMusic("bubbles", "bubbles.wav");
		SOUND_MANAGER.loadMusic("background", "melodyoflight.mp3");
		SOUND_MANAGER.playMusic("background", this);
		SOUND_MANAGER.playMusic("bubbles", this);
		SOUND_MANAGER.loadSoundEffect("shark", "Jaws_theme.mp3");

		this.powerUps_layer = new DisplayObjectContainer("powerUps", null, this.game_layer);

		this.instructionIndex = 0;
		this.canChangeMode = true;
		SCORE.setVisible(false);
		this.game_layer.setVisible(false);
		this.displayInstruction();
    }

    static getInstance(){ return Instructions.instance; }

    nextFrame(){
		this.update(this.pressedKeys);
		this.draw(this.g);
		if(this.playing) 
			this.animation = window.requestAnimationFrame(tickInstruction);
		TweenJuggler.getInstance().nextFrame();
	}

	start(){
		this.playing = true;
		this.animation = window.requestAnimationFrame(tickInstruction);
	}

	/**
	 * For dealing with keyCodes
	 */
	addKey(keyCode){ if(this.pressedKeys.indexOf(keyCode) == -1) this.pressedKeys.push(keyCode); }
	removeKey(keyCode){ this.pressedKeys.remove(keyCode); }

    draw(g){
		g.clearRect(0, 0, this.width, this.height);
		this.root.draw(g);
    }

    update(pressedKeys){
		this.root.update(pressedKeys);

		for(var i = 0; i < this.food_layer.children.size(); i++) {
			var food = this.food_layer.children.get(i);
			if (food.exitTween1 != null) {
				if (food.exitTween1.isComplete()) {
					food.dispatchEvent(new FoodExit1(food));
				}
			}
		}
			
		// Number 1 for toggle mode
		if (this.canChangeMode && pressedKeys.contains(49)) {
			this.mode = this.mode == "Flirt" ? "Fight" : "Flirt";
			this.player.displayImage = this.mode == "Flirt" ? this.player.defaultImage : this.player.movingImages.fight.Default;
			pressedKeys.remove(49);
			$("#mode").text("Mode: " + this.mode.toUpperCase());
		}
    }

	displayInstruction() {
		switch(this.instructionIndex) {
			case 0:
				this.game_layer.setVisible(false);
				$("#instructions").html("");
				$("#controls").html("");
				$("#instructions").css("top", 40).css("left", 0).css("text-align", "center");
				$("#instructions").html("<h1>Welcome!</h1><p>Know how to play?</p>");
				var b = $("<input></input>").attr("type", "button").val("Start Game");
				var t = this;
				b.click(function() {
					t.startGame();
				});
				$("#instructions").append(b);
				$("#instructions").append($("<p></p>").text("Otherwise..."));
				var b = $("<input></input>").attr("type", "button").val("How to Play");
				var t = this;
				b.click(function() {t.instructionIndex++; t.displayInstruction();});
				$("#instructions").append(b);
			break;
			case 1:
				this.game_layer.setVisible(true);
				if (this.obj) this.obj.parent.removeChild(this.obj);
				if (!this.player) {
					this.player = new PlayerSquid("player", "player.png", this.game_layer);
					this.player.eyes = new Sprite("eyes", "eyes.png", this.player);
					this.player.eyes.x = 27;
					this.player.eyes.y = 44;
					PLAYER = this.player; // Include a global reference to player
				}
				this.player.setX(280);
				this.player.setY(100);
				$("#instructions").html("");
				$("#controls").html("");
				$("#instructions").css("top", 130).css("left", 130).css("text-align", "left");
				$("#instructions").html("<p>This is you.</p><p>Go ahead, swim around. <span style='font-size:12px;'>(arrow keys)</span></p>");
				
				var b = $("<input></input>").attr("type", "button").val("Back");
				var t = this;
				b.click(function() {t.instructionIndex--; t.displayInstruction();});
				$("#controls").append(b);

				var b = $("<input></input>").attr("type", "button").val("Next");
				var t = this;
				b.click(function() {t.instructionIndex++; t.displayInstruction();});
				$("#controls").append(b);

				

				var b = $("<input></input>").attr("type", "button").val("Start Game");
				var t = this;
				b.click(function() {
					t.startGame();
				});
				$("#controls").append($("<div></div>").css("clear", "both").css("margin-top", "5px").append(b));
			break;
			case 2:
				if (this.obj) this.obj.parent.removeChild(this.obj);
				this.player.setX(455);
				this.player.setY(200);
				$("#instructions").html("");
				$("#instructions").css("top", 30).css("left", 0).css("text-align", "center");
				$("#instructions").html("<p>As a squid, you can FLIRT and FIGHT with other squids. Try toggling between modes now (\"1\" key).</p>");
				var mode = $("<p></p>").text("Mode: FLIRT").attr("id", "mode");
				$("#instructions").append(mode);
			break;
			case 3:
				if (this.obj) this.obj.parent.removeChild(this.obj);
				SCORE.setVisible(true);
				this.mode = "Flirt";
				this.player.displayImage = this.mode == "Flirt" ? this.player.defaultImage : this.player.movingImages.fight.Default;
				this.canChangeMode = false;
				this.player.setX(130);
				this.player.setY(400);
				$("#instructions").html("");
				//$("#instructions").css("top", 30).css("left", 0).css("text-align", "center");
				$("#instructions").html("<p>FLIRTing increases your CONFIDENCE but does not affect your SCORE.<br/><span style='font-size:12px;'>(SCORE is the point of the game hint, hint)</span></p><p>FIGHTing increases your SIZE and SCORE</p><p>CONFIDENCE and SIZE are what make up your STRENGTH.<br/><span style='font-size:12px;'>(and the more strength you have, the more likely you are to be successful in your FLIRTing and FIGHTing endeavors)</span></p><p>Try FLIRTing with this lovely squid now.</p>");
				var npc = new Squid("npc", "squid_blue.png", this.npcs);
				npc.setX(500);
				npc.setY(400);
				npc.px = 64;
				npc.py = 30;
				npc.setStrength(PLAYER.strength*3/4);
				npc.addEventListener(QUEST_MANAGER, SQUID_SPAWN);
				npc.addEventListener(QUEST_MANAGER, COLLISION);
				SOUND_MANAGER.loadSoundEffect("success_fight_npc", "bloibb.mp3");
				SOUND_MANAGER.loadSoundEffect("success_flirt_npc", "success.wav");
				this.npc = npc;
				this.obj = this.npc;
			break;
			case 4:
				if (this.obj && this.obj != this.npc) this.obj.parent.removeChild(this.powerup);
				this.mode = "Fight";
				this.player.displayImage = this.mode == "Flirt" ? this.player.defaultImage : this.player.movingImages.fight.Default;
				this.canChangeMode = false;
				this.player.setX(130);
				this.player.setY(400);
				$("#instructions").html("");
				//$("#instructions").css("top", 30).css("left", 0).css("text-align", "center");
				$("#instructions").html("<p>FLIRTing increases your CONFIDENCE but does not affect your SCORE.<br/><span style='font-size:12px;'>(SCORE is the point of the game hint, hint)</span></p><p>FIGHTing increases your SIZE and SCORE</p><p>CONFIDENCE and SIZE are what make up your STRENGTH.<br/><span style='font-size:12px;'>(and the more strength you have, the more likely you are to be successful in your FLIRTing and FIGHTing endeavors)</span></p><p>Try FIGHTing with this lovely squid now.</p>");
			break;
			case 5:
				if (this.obj) this.obj.parent.removeChild(this.obj);
				this.mode = "Flirt";
				this.player.displayImage = this.mode == "Flirt" ? this.player.defaultImage : this.player.movingImages.fight.Default;
				this.canChangeMode = true;
				this.player.setX(130);
				this.player.setY(300);
				$("#instructions").html("");
				$("#instructions").css("top", 40).css("left", 0).css("text-align", "center");
				$("#instructions").html("<p>Hey look! Food! <span style='font-size:12px;'>(shrimp)<br/>Maybe eat it. Maybe you'll get stronger.</span></p>");
				var new_food = new Food("food", this.food_layer);
				new_food.setX(475);
				new_food.setY(300);
				new_food.addEventListener(QUEST_MANAGER, FOOD_PICKED_UP);
				SOUND_MANAGER.loadSoundEffect("food", "pick_up.wav");
				this.obj = new_food;
			break;
			case 6:
				if (this.obj) this.obj.parent.removeChild(this.obj);
				this.player.lives = 1;
				this.mode = "Flirt";
				this.player.displayImage = this.mode == "Flirt" ? this.player.defaultImage : this.player.movingImages.fight.Default;
				this.canChangeMode = true;
				this.player.setX(130);
				this.player.setY(300);
				$("#instructions").html("");
				$("#instructions").css("top", 40).css("left", 0).css("text-align", "center");
				$("#instructions").html("<p>Oh no! You suddenly only have one life!<br/>Not to worry... GEMs are powerups that can help you.</p><p>RED gems give you LIFE. Try picking it up.</p>");
				var powerup = new Sprite("life", "gem_red.png", this.powerUps_layer);
				powerup.setX(475);
				powerup.setY(300);
				powerup.event = POWER_UP.LIFE;
				powerup.addEventListener(QUEST_MANAGER, POWER_UP.LIFE);
				this.obj = powerup;
			break;
			case 7:
				if (this.obj) this.obj.parent.removeChild(this.obj);
				this.player.lives = 1;
				this.mode = "Flirt";
				this.player.displayImage = this.mode == "Flirt" ? this.player.defaultImage : this.player.movingImages.fight.Default;
				this.canChangeMode = true;
				this.player.setX(130);
				this.player.setY(300);
				$("#instructions").html("");
				$("#instructions").css("top", 40).css("left", 0).css("text-align", "center");
				$("#instructions").html("<p>GEMs are powerups that can help you!</p><p>GREEN gems give you SPEED. Try picking it up and using the \"2\" key to use it.</p>");
				var powerup = new Gem("speed", "green", this.powerUps_layer);
				powerup.setX(475);
				powerup.setY(300);
				powerup.event = POWER_UP.SPEED;
				powerup.addEventListener(QUEST_MANAGER, POWER_UP.SPEED);
				this.obj = powerup;
			break;
			case 8:
				if (this.obj) this.obj.parent.removeChild(this.obj);
				this.player.lives = 3;
				this.mode = "Flirt";
				this.player.displayImage = this.mode == "Flirt" ? this.player.defaultImage : this.player.movingImages.fight.Default;
				this.canChangeMode = true;
				this.player.setX(230);
				this.player.setY(300);
				$("#instructions").html("");
				$("#instructions").css("top", 40).css("left", 0).css("text-align", "center");
				$("#instructions").html("<p>GEMs are powerups that can help you!</p><p>YELLOW gems give you INVINCIBILITY. Try picking it up and using the \"2\" key to use it when the shark comes. <span style='font-size:12px'>(You have to spawn the shark with that aptly-named button down there)</span></p>");
				var powerup = new Gem("speed", "yellow", this.powerUps_layer);
				powerup.setX(465);
				powerup.setY(300);
				powerup.event = POWER_UP.INVINCIBLE;
				powerup.addEventListener(QUEST_MANAGER, POWER_UP.INVINCIBLE);
				this.powerup = powerup;

				var t = this;
				var b = $("<input></input>").attr("type", "button").val("Spawn Shark").attr("id", "spawnShark");
				b.click(function() {
					var shark = new Shark("shark", "shark.png", t.sharks);
					shark.setScaleX(0.5);
					shark.setScaleY(0.5);
					if (shark.lr == 0) {
						shark.setX(1000);
					} else {
						shark.flipped = true;
						shark.setX(-1000);
					}
					SOUND_MANAGER.playSoundEffect("shark");
					shark.setY(300);
					shark.addEventListener(QUEST_MANAGER, SHARK_ATTACK);
					shark.addEventListener(QUEST_MANAGER, SHARK_DESPAWN);
				});
				$("#controls div").before(b);	
			break;
			case 9:
				if (this.obj) this.obj.parent.removeChild(this.obj);
				$("#instructions").html("");
				$("#instructions").css("top", 70).css("left", 0).css("text-align", "center");
				$("#instructions").html("<p>That's all there is to it! You're ready!</p><p>P.S. You can always press spacebar to pause the game and review the controls!</p>");

				$("#controls").html("");
				var b = $("<input></input>").attr("type", "button").val("Start Game");
				var t = this;
				b.click(function() {
					t.startGame();
				});
				$("#controls").append(b);
			break;
		}
	}

	// Do clean up for starting the game
	startGame() {
		$("#instructions").html("");
		$("#controls").html("");
		gameClock = 0;
		SPAWNER = new Spawner();
		QUEST_MANAGER = new QuestManager();
		SOUND_MANAGER = new SoundManager();
		window.removeEventListener("keydown", kdl, true);
		window.removeEventListener("keyup", kul, true);
		window.cancelAnimationFrame(this.animation);	// VERY IMPORTANT
		var drawingCanvas = document.getElementById('game');	
		if(drawingCanvas.getContext) {
			Instructions.instance = null;
			game = new Main(drawingCanvas);
			game.start();
		}
	}
}


var kdl = function (e){ Instructions.getInstance().addKey(e.keyCode); };
var kul = function (e){ Instructions.getInstance().removeKey(e.keyCode); };

/**
 * THIS IS THE BEGINNING OF THE PROGRAM
 * YOU NEED TO COPY THIS VERBATIM ANYTIME YOU CREATE A GAME
 */
function tickInstruction(){
	game.nextFrame();
	gameClock++;
}

/* Get the drawing canvas off of the  */
var drawingCanvas = document.getElementById('game');
if(drawingCanvas.getContext) {
	game = new Instructions(drawingCanvas);
	game.start();
}
