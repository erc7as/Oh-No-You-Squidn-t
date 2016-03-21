class Squid extends PhysicsSprite {
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

    update(){
	if (this.delayed && this.delayElapsed()){this.deactivateMoveDelay();}
	super.update();
    }

	draw(g){
		super.draw(g);
		this.stayInside(canvasHitbox);
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
