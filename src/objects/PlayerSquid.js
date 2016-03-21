"use strict";

class PlayerSquid extends Squid {
    constructor(id, filename, parent){
	super(id, filename, parent);
	this.applyGravity = false;
	this.updateTimer = new GameClock();
	this.moveTimer = new GameClock();
	this.rotationDampener = .5; // variabilitiy of rotation
	this.movePower = 0.1;  // speed of movement
	this.direction = Math.random() * 2 * Math.PI; // random initial direction
	this.delayed = false;
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
}
