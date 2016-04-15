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
		if (this.parent.sharkPresent){
			this.checkSharkCollision();
		}
		this.setStrength(this.squidSize + this.confidence);
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
	}

	goLeft() {
		//this.vx = -3;
		this.x -= 3.0;
		this.eyes.setX(20);
		this.eyes.setY(40);
		if (game.mode == "Flirt")
			this.displayImage = this.movingImages.flirt.Left;
		else
			this.displayImage = this.movingImages.fight.Left;
	}

	goRight() {
		//this.vx = 3;
		this.x += 3.0;
		this.eyes.setX(30);
		this.eyes.setY(40);
		if (game.mode == "Flirt")
			this.displayImage = this.movingImages.flirt.Right;
		else
			this.displayImage = this.movingImages.fight.Right;
	}

	goUp() {
		//this.vx = -3;
		this.y -= 3.0;
		this.eyes.setX(25);
		this.eyes.setY(38);
		if (game.mode == "Flirt")
			this.displayImage = this.movingImages.flirt.Up;
		else
			this.displayImage = this.movingImages.fight.Up;
	}

	goDown() {
		//this.vx = 3;
		this.y += 3.0;
		this.eyes.setX(25);
		this.eyes.setY(47);
		if (game.mode == "Flirt")
			this.displayImage = this.movingImages.flirt.Down;
		else
			this.displayImage = this.movingImages.fight.Down;
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

	checkSharkCollision() {
		var shark = this.parent.getChildById("sharks").getChildren();
		console.log("shark?");
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
}
