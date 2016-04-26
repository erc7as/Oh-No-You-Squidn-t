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

		this.glowBackground = {"speed": new DisplayObjectContainer("playerSpeed", "glow_speed.png", this), "invincible": new DisplayObjectContainer("playerInvincible", "glow_invincible.png", this)};
		
		for (var type in this.glowBackground) {
			var o = this.glowBackground[type];
			o.setVisible(false);
			o.setX(-29);	// Glow is bigger than player image so have to offset
			o.setY(-16.5);
		}

		this.loadMovingImages();
		this.invincible = false;
		this.speed = 6;
		this.powerUpSelected= null;
		this.powerUpBank = {};
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
		if (!this.invincible)	// Invincibility power up
			this.checkSharkCollision();
		this.checkSharkRemoval();
		this.checkPowerUpCollision();
		this.setStrength(this.squidSize + this.confidence);

		// Number 3 for use powerup
		if (pressedKeys.contains(51)) {
			this.usePowerUp();
			pressedKeys.remove(51);
		}
		// Number 4 for toggle powerup
		if (pressedKeys.contains(52)) {
			if (this.powerUpSelected == POWER_UP.SPEED && this.powerUpBank[POWER_UP.INVINCIBLE] != null)
				this.selectPowerUp(POWER_UP.INVINCIBLE)
			else if (this.powerUpBank[POWER_UP.SPEED] != null)
				this.selectPowerUp(POWER_UP.SPEED)

			pressedKeys.remove(52);
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
			this.powerUpBank[POWER_UP.SPEED] = null;
			this.glowBackground.speed.setVisible(false);
		}

		if (this.invincible
			&& (gameClock - this.powerUpBank[POWER_UP.INVINCIBLE].start > 100)) {
			this.invincible = false;
			this.glowBackground.invincible.setVisible(false);
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
			this.selectPowerUp(type);
		}
	}

	usePowerUp() {
		var type = this.powerUpSelected;
		if (this.powerUpBank[type] != null && this.powerUpBank[type].count > 0) {
			this.powerUpBank[type].count--;
			this.powerUpBank[type].start = gameClock;

			if (type == POWER_UP.SPEED) {
				this.speed *= 2;
				this.glowBackground.speed.setVisible(true);
				
				SCORE.removePowerUp(this.powerUpBank[POWER_UP.SPEED].object);

				if (this.powerUpBank[POWER_UP.INVINCIBLE] != null)
					this.selectPowerUp(POWER_UP.INVINCIBLE);
			}
			else if (type == POWER_UP.INVINCIBLE) {
				console.log("INVINCIBLE");
				this.invincible = true;
				this.glowBackground.invincible.setVisible(true);

				SCORE.removePowerUp(this.powerUpBank[POWER_UP.INVINCIBLE].object);
				
				if (this.powerUpBank[POWER_UP.SPEED] != null)
					this.selectPowerUp(POWER_UP.SPEED);
			}
		}
	}

	selectPowerUp(type) {
		this.powerUpSelected = type;
		for (var t in this.powerUpBank) {
			if (this.powerUpBank[t] != null)
				this.powerUpBank[t].object.displayImage = this.powerUpBank[t].object.defaultImage;
		}
		this.powerUpBank[type].object.displayImage = this.powerUpBank[type].object.selectedImage;
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
