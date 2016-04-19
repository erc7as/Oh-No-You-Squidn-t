"use strict";

class Squid extends PhysicsSprite {
    constructor(id, filename, parent){
		super(id, filename, parent);
		this.hitbox = this.makeHitbox();
		this.applyGravity = false;
		this.updateTimer = new GameClock();
		this.moveTimer = new GameClock();
		this.moveStatus = 'wandering' // 'wandering' 'attacking' 'fleeing'
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
	    this.updateMoveStatus();	
		if (this.delayed && this.delayElapsed()){this.deactivateMoveDelay();}
		super.update();
    }

    updateMoveStatus(){
    	// if player is close and squid is weaker then flee[fleeing].
    	// if player is close and squid is stronger then attack[attacking].
    	// otherwise wander [wandering]
    	var CLOSE_THRESHOLD = 100;  // pixels
    	var current_distance = Math.sqrt(Math.pow(this.getX() - PLAYER.getX(), 2) + Math.pow(this.getY() - PLAYER.getY(), 2));
    	if (current_distance < CLOSE_THRESHOLD){
    		if (this.strength < PLAYER.strength){
    			this.moveStatus = 'fleeing';
    		}
    		if (this.strength > PLAYER.strength){
    			this.moveStatus = 'attacking';
    		}
    	} else {
    		this.moveStatus = 'wandering';
    	}
    }

	draw(g){
		super.draw(g);
		this.stayInside(canvasHitbox);
		//g.font = "30px Helvetica";
		//g.fillText(Math.round(this.strength), this.x + 5, this.y + 5);
		// DEBUGGING
		// g.fillText(Math.round(this.direction / Math.PI * 180), this.x + 15, this.y + 15);
		// g.fillText(this.moveStatus, this.x + 35, this.y + 35);
		var scale = this.strength / PLAYER.strength;
		this.scaleX = scale;
		this.scaleY = scale;
		this.setPivotPoint([this.getWidth() / 2, this.getHeight() / 2])
	}

	// Changed to make a small square
	getWorldHitbox() {
		var worldPoint = this.convertCoordinates();
		var width = this.getWidth() * 3/5;
		return new Hitbox(worldPoint.x + width / 3, worldPoint.y + width / 3, width, width);
	}

    calculatePlayerRotation(){
    	// Return the rotation required to face the player in radians.
    	var dpx = PLAYER.getX() - this.getX();
		var dpy = PLAYER.getY() - this.getY();
		var angle =  Math.atan(dpy / dpx);
		if (dpx <= 0){ angle += Math.PI};
		return angle;
    }

    // redefine move
    // Called after every draw
    move(){
		// get time since last update
		var delta_t = this.updateTimer.getElapsedTime();
		this.updateTimer.resetGameClock();
		this.vx = (Math.cos(this.direction))*this.movePower;
		this.vy = (Math.sin(this.direction))*this.movePower;
		this.setRotation(this.direction / Math.PI * 180);	
		
		// Update Squid rotation
		if (this.moveStatus == 'wandering'){
			if (Math.random() < .1){ this.direction += this.rotationDampener*(Math.random() - .5) * (Math.PI); }
		} else if (this.moveStatus == 'attacking') {
			this.direction = this.calculatePlayerRotation();  // Face towards player
		} else if (this.moveStatus == 'fleeing'){
			this.direction = this.calculatePlayerRotation() - Math.PI; // Face away from player
		}
		// update position
		var newX = (this.getX()) + (this.vx * delta_t);
		var newY = (this.getY()) + (this.vy * delta_t);
		this.setX(newX);
		this.setY(newY);
    }
}
