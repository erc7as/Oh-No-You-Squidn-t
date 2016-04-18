/**
 * Created by Student on 4/8/2016.
 */
class Shark extends PhysicsSprite {

    constructor(id, filename, parent){
        super(id, filename, parent);
        this.hitbox = this.makeHitbox();
        this.applyGravity = false;
        this.updateTimer = new GameClock();
        this.moveTimer = new GameClock();
        this.movePower = 0.1;  // speed of movement
        this.delayed = false;
        this.lr = Math.floor(Math.random() * 2);
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
    }

    // redefine move
    // Called after every draw
    move(){
        // get time since last update
        var delta_t = this.updateTimer.getElapsedTime();
        this.updateTimer.resetGameClock();

        //moves left or right across the screen horizontally
        if (this.lr == 0) {
            this.vx = -0.25;
        } else {
            this.vx = 0.25;
        }
        
        // update position
        var newX = (this.getX()) + (this.vx * delta_t);
        this.setX(newX);
    }

}