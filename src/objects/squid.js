class Squid extends PhysicsSprite {
    constructor(id, filename, parent){
	super(id, filename, parent);
	this.applyGravity = false;
	this.moveDelay = 1000;
	this.movePower = .5;
	this.updateTimer = new GameClock();
	this.moveTimer = new GameClock();
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

    update(){
	if (this.delayed && this.delayElapsed()){this.deactivateMoveDelay();}
	super.update();
    }

    // redefine move
    // Called after every draw
    move(){
	// get time since last update
	var delta_t = this.updateTimer.getElapsedTime();
	this.updateTimer.resetGameClock();

	// randomly choose a direction to move
	this.vx = this.vx * .9;
	this.vy = this.vy * .9;
	if (!this.delayed){
	    this.activateMoveDelay();
	    var direction = Math.random() * 2 * Math.PI; // angle to move
	    this.vx = (Math.cos(direction))*this.movePower;
	    this.vy = (Math.sin(direction))*this.movePower;
	    this.setRotation((direction / (2*Math.PI))*360);
	}
	
	// update position
	var newX = (this.getX()) + (this.vx * delta_t);
	var newY = (this.getY()) + (this.vy * delta_t);
	this.setX(newX);
	this.setY(newY);
    }
}
