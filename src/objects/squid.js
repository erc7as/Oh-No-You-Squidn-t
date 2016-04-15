"use strict";

class Squid extends PhysicsSprite {
    constructor(id, filename, parent){
		super(id, filename, parent);
		this.hitbox = this.makeHitbox();
		this.applyGravity = false;
		this.updateTimer = new GameClock();
		this.moveTimer = new GameClock();
		this.rotationDampener = .5; // variabilitiy of rotation
		this.movePower = 0.1;  // speed of movement
		this.direction = Math.random() * 2 * Math.PI; // random initial direction
		this.delayed = false;
		this.strength = 0;

    }

	setStrength(strength) {
		this.strength = strength;
	}

    makeHitbox(){
		return (new Hitbox(this.getX(), this.getY(), this.getWidth(), this.getHeight(), 1/2));   
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

    update(){
	    this.hitbox = this.makeHitbox();	
		if (this.delayed && this.delayElapsed()){this.deactivateMoveDelay();}
		super.update();
    }

	draw(g){
		super.draw(g);
		this.stayInside(canvasHitbox);
		g.font = "30px Helvetica";
		g.fillText(Math.round(this.strength), this.x + 5, this.y + 5);
		var scale = this.strength / PLAYER.strength;
		this.scaleX = scale;
		this.scaleY = scale;
		this.setPivotPoint([this.getWidth() / 2, this.getHeight() / 2])
	}

    // redefine move
    // Called after every draw
    move(){
		// get time since last update
		var delta_t = this.updateTimer.getElapsedTime();
		this.updateTimer.resetGameClock();

		// randomly choose a direction to move
		this.vx = (Math.cos(this.direction))*this.movePower;
		this.vy = (Math.sin(this.direction))*this.movePower;
		this.setRotation((this.direction / (2*Math.PI))*360);	
		if (Math.random() < .1){ this.direction += this.rotationDampener*(Math.random() - .5) * (Math.PI); }
		
		// update position
		var newX = (this.getX()) + (this.vx * delta_t);
		var newY = (this.getY()) + (this.vy * delta_t);
		this.setX(newX);
		this.setY(newY);
    }
}
