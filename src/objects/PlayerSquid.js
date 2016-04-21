"use strict";

class PlayerSquid extends Squid {
    constructor(id, filename, parent){
		super(id, filename, parent);
		this.squidSize = 5;
		this.confidence = 5;
		this.strength = 10;
		this.lives = 3;
		this.defaultImage = this.displayImage;
		this.movingImages = {"flirt": {"Right": null, "Left": null, "Up": null, "Down": null}, "fight": {"Default": null, "Right": null, "Left": null, "Up": null, "Down": null}};
		this.loadMovingImages();

		this.speed = 6;
		this.powerUpSelected= null;
		this.powerUpBank = [];
    }

    /**
	 * Loads the image, sets a flag called 'loaded' when the image is ready to be drawn
	 */
	loadMovingImages(){
		for (var direction in this.movingImages.flirt) {
			this.movingImages.flirt[direction] = new Image();
	  		this.movingImages.flirt[direction].onload = function(){
	  			this.loaded = true;
	  		};
	  		this.movingImages.flirt[direction].src = 'resources/player' + direction + '.png';
		};

		for (var direction in this.movingImages.fight) {
			this.movingImages.fight[direction] = new Image();
	  		this.movingImages.fight[direction].onload = function(){
	  			this.loaded = true;
	  		};
	  		if (direction == "Default")
	  			this.movingImages.fight[direction].src = 'resources/playerFight.png';
	  		else
	  			this.movingImages.fight[direction].src = 'resources/player' + direction + 'Fight.png';
		};
		
	}

    activateMoveDelay(){
	this.delayed = true;
	this.moveTimer.resetGameClock();
    }

    delayElapsed(){
		return (this.moveTimer.getElapsedTime() >= this.moveDelay);
    }

    deactivateMoveDelay(){
		this.delayed = false;
    }

    update(pressedKeys){
		if (this.delayed && this.delayElapsed()){this.deactivateMoveDelay();}
		super.update();

		if (pressedKeys.contains(37) && this.x > 0) // Left
			this.goLeft();
		
		if (pressedKeys.contains(38) && this.y > 0) // Up
			this.goUp();
		
		if (pressedKeys.contains(39)) // Right
			this.goRight();

		if (pressedKeys.contains(40)) // Down
			this.goDown();

		this.checkSquidCollision();
		this.checkFoodCollision();
		this.checkSharkCollision();
		this.checkSharkRemoval();
		this.checkPowerUpCollision();
		this.setStrength(this.squidSize + this.confidence);

		// Number 3 for use powerup
		if (pressedKeys.contains(51)) {
			this.usePowerUp();
		}
		// Number 4 for toggle powerup
		if (pressedKeys.contains(52)) {
			for (var type in this.powerUpBank) {
				if (type != this.powerUpSelected) {
					this.powerUpSelected = type;
					break;
				}
			}
			console.log("Power up: " + this.powerUpSelected);
		}
    }

	draw(g){
		super.draw(g);
		this.stayInside(canvasHitbox);
	}

    // redefine move
    // Called after every draw
    move() {
		this.x += this.vx;
		this.y += this.vy;

		this.vx *= .95;
		this.vy *= .95;

		// Turn off speed
		if (this.powerUpBank[POWER_UP.SPEED] != null 
			&& this.speed > 10 
			&& (gameClock - this.powerUpBank[POWER_UP.SPEED].start) > 100) {

			this.speed = 6;
			SCORE.removePowerUp(this.powerUpBank[POWER_UP.SPEED].object)
			if (this.powerUpBank[POWER_UP.SPEED].count == 0)
				this.powerUpBank[POWER_UP.SPEED] = null;
		}

		// water
		// if (this.vx > 0)
		// 	this.vx -= .1;
		// else
		// 	this.vx += .1;
		// if (this.vy > 0)
		// 	this.vy -= .1;	
		// else
		// 	this.vy += .1;	
	}

	goLeft() {
		this.vx = this.speed * -1;
		//this.x -= 3.0;
		this.eyes.setX(20);
		this.eyes.setY(40);
		if (game.mode == "Flirt")
			this.displayImage = this.movingImages.flirt.Left;
		else
			this.displayImage = this.movingImages.fight.Left;
	}

	goRight() {
		this.vx = this.speed;
		//this.x += 3.0;
		this.eyes.setX(30);
		this.eyes.setY(40);
		if (game.mode == "Flirt")
			this.displayImage = this.movingImages.flirt.Right;
		else
			this.displayImage = this.movingImages.fight.Right;
	}

	goUp() {
		this.vy = this.speed * -1;
		//this.y -= 3.0;
		this.eyes.setX(25);
		this.eyes.setY(38);
		if (game.mode == "Flirt")
			this.displayImage = this.movingImages.flirt.Up;
		else
			this.displayImage = this.movingImages.fight.Up;
	}

	goDown() {
		this.vy = this.speed;
		//this.y += 3.0;
		this.eyes.setX(25);
		this.eyes.setY(47);
		if (game.mode == "Flirt")
			this.displayImage = this.movingImages.flirt.Down;
		else
			this.displayImage = this.movingImages.fight.Down;
	}

	addPowerUp(type, object) {
		if (type == POWER_UP.LIFE) {
			this.lives++;
		}
		else {
			if (this.powerUpBank[type] == null)
				this.powerUpBank[type] = {"count":0, "object": object, "start": null};
			
			this.powerUpBank[type].count++;
			this.powerUpSelected = type;
		}
	}

	usePowerUp() {
		var type = this.powerUpSelected;
		if (this.powerUpBank[type] != null && this.powerUpBank[type].count > 0) {
			this.powerUpBank[type].count--;
			this.powerUpBank[type].start = gameClock;

			if (type == POWER_UP.SPEED) {
				this.speed *= 2;
			}
			else if (type == POWER_UP.INVINCIBLE) {
				console.log("INVINCIBLE");
				SCORE.removePowerUp(this.powerUpBank[POWER_UP.INVINCIBLE].object)
				if (this.powerUpBank[POWER_UP.INVINCIBLE].count == 0)
					this.powerUpBank[POWER_UP.INVINCIBLE] = null;
			}
		}
	}

	makeHitbox(){
		return (new Hitbox(this.getX(), this.getY(), this.getWidth(), this.getHeight(), 1));   
    }

	checkSquidCollision() {
		// This is an ArrayList object (part of engine)
		var npcs = this.parent.getChildById("npcs").getChildren();
		this.hitbox.color = "#000000";
		for (var i = 0; i < npcs.size(); i++) {
			if (this.collidesWith(npcs.get(i))) {
				npcs.get(i).dispatchEvent(new CollisionEvent(npcs.get(i)));
				// var npcHitbox = npcs.get(i).hitbox;
				// if (this.hitbox.getMinX() < npcHitbox.getMinX()) {
				// 	this.x -= 3;
				// }
				// else if (this.hitbox.getMaxX() > npcHitbox.getMaxX()) {
				// 	this.x += 3;
				// }
			}
			else {
				if (!npcs.get(i).hasEventListener(QUEST_MANAGER, COLLISION)){
					npcs.get(i).addEventListener(QUEST_MANAGER, COLLISION);
				}
				//npcs.get(i).hitbox.color = "#000000";
			}
		};
	}

	checkFoodCollision() {
		// This is an ArrayList object (part of engine)
		var food = this.parent.getChildById("foods").getChildren();
		this.hitbox.color = "#000000";
		for (var i = 0; i < food.size(); i++) {
			if (this.collidesWith(food.get(i))) {
				food.get(i).dispatchEvent(new PickedUpEvent(food.get(i)));
			}
		};
	}

	checkPowerUpCollision() {
		// This is an ArrayList object (part of engine)
		var powerUps = this.parent.getChildById("powerUps").getChildren();
		this.hitbox.color = "#000000";
		for (var i = 0; i < powerUps.size(); i++) {
			if (this.collidesWith(powerUps.get(i))) {
				powerUps.get(i).dispatchEvent(new PowerUpEvent(powerUps.get(i)));
			}
		};
	}

	checkSharkCollision() {
		var shark = this.parent.getChildById("sharks").getChildren();
		for (var i = 0; i < shark.size(); i++) {
			if(this.collidesWith(shark.get(i))) {
				shark.get(i).dispatchEvent(new SharkEvent(shark.get(i)));
			} else {
				if (!shark.get(i).hasEventListener(QUEST_MANAGER, SHARK_ATTACK)) {
					shark.get(i).addEventListener(QUEST_MANAGER, SHARK_ATTACK);
				}
			}
		}

	}
	
	checkSharkRemoval() {
		var shark = this.parent.getChildById("sharks").getChildren();
		for (var i = 0; i < shark.size(); i++) {
			if ((shark.get(i).lr == 0) && (shark.get(i).x < 0-shark.get(i).w)){
				shark.get(i).dispatchEvent(new SharkDespawn(shark.get(i)));
			} else if (shark.get(i).x > 1000) {
				shark.get(i).dispatchEvent(new SharkDespawn(shark.get(i)));
			}
		}
	}
}
