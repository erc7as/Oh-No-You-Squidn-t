"use strict";

class PlayerSquid extends Squid {
    constructor(id, filename, parent){
		super(id, filename, parent);
		this.squidSize = 1;
		this.confidence = 1;
		this.strength = 10;
		this.lives = 3;
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
	}

	goRight() {
		//this.vx = 3;
		this.x += 3.0;
	}

	goUp() {
		//this.vx = -3;
		this.y -= 3.0;
	}

	goDown() {
		//this.vx = 3;
		this.y += 3.0;
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
}
