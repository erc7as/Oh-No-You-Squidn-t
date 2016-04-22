"use strict";

class Score extends Sprite {
    constructor(id, filename, parent, width){
		super(id, filename, parent);
		this.w = width;
		this.h = 50;
		this.x = 0;
		this.y = 0;
		// Update canvasHitbox to not include score, so squids cannot go there
		canvasHitbox.y = this.h;
		this.containter = new Hitbox(this.x, this.y, this.w, this.h);
		this.score = 0;

		this.createHearts();
		this.powerUp = {};
    }

    update(pressedKeys){

    }

    addPoints() {
    	this.score++;
    	if (this.score % 10 == 0 && PLAYER.powerUpBank[POWER_UP.INVINCIBLE] == null) {
    		SPAWNER.spawnPowerup(POWER_UP.INVINCIBLE);
    	}
    	else if (this.score % 10 == 0 && PLAYER.lives < 3) {
    		SPAWNER.spawnPowerup(POWER_UP.LIFE);
    	}
    	else if (this.score % 5 == 0 && PLAYER.powerUpBank[POWER_UP.SPEED] == null) {
    		SPAWNER.spawnPowerup(POWER_UP.SPEED);
    	}
    }

    addPowerUp(object) {
    	var x = this.x + 850;
    	if (object.event == POWER_UP.INVINCIBLE) x += 40
    	if (this.powerUp[object.event] == null) {
    		this.powerUp[object.event] = {"count" : 0, "object": object};
    		this.powerUp[object.event].object.x = x;
	    	this.powerUp[object.event].object.y = this.y + 6;
	    	this.powerUp[object.event].object.scaleX = .5;
	    	this.powerUp[object.event].object.scaleY = .5;
    	}
    	this.powerUp[object.event].count++;
    }

    removePowerUp(object) {
    	this.powerUp[object.event].count--; 
    	if (this.powerUp[object.event].count == 0) {
    		object.parent.removeChild(object);
    		this.powerUp[object.event] = null;
    	}
    }

	draw(g){
		super.draw(g);
		g.fillStyle = "#FFFFFF";
		g.fillRect(this.containter.x, this.containter.y, this.containter.w, this.containter.h);
		g.strokeStyle = "#000000";
		g.strokeRect(this.containter.x, this.containter.y, this.containter.w, this.containter.h);
		
		g.fillStyle = "#000000";
		g.font = "30px Helvetica";
		g.fillText("Score:", this.x + 5, this.y + 35);

		//g.font = "20px Helvetica";
		g.fillText(this.score, this.x + 100, this.y + 35);

		g.fillText("Strength:", this.x + 150, this.y + 35);
		g.fillText(Math.round(game.player.strength), this.x + 280, this.y + 35);

		g.font = "10px Helvetica";
		g.fillText("Size:", this.x + 340, this.y + 20);
		g.fillText(Math.round(game.player.squidSize), this.x + 400, this.y + 20);

		g.fillText("Confidence:", this.x + 340, this.y + 35);
		g.fillText(Math.round(game.player.confidence), this.x + 400, this.y + 35);

		g.font = "30px Helvetica";
		g.fillText("Lives:", this.x + 440, this.y + 35);
		var heartNum = 0;
		// Draw full hearts
		for (var i = 0; i < game.player.lives; i++, heartNum++) {
			var heart = this.fullHearts[i];
			heart.setX(this.x + 520 + (heartNum * 35));
			heart.setY(10);
			heart.draw(g);
		}
		// Draw empty hearts
		for (var i = 0; i < 3 - game.player.lives; i++, heartNum++) {
			var heart = this.emptyHearts[i];
			heart.setX(this.x + 520 + (heartNum * 35));
			heart.setY(10);
			heart.draw(g);
		}

		g.fillText("Mode:", this.x + 640, this.y + 35);
		g.fillText(game.mode, this.x + 740, this.y + 35);


	}

	createHearts() {
		this.fullHearts = [];
		this.emptyHearts = [];
		for (var i = 0; i < 3; i++) {
			this.fullHearts.push(new DisplayObject("fullHeart" + i, "heartFull.png", null));
			this.emptyHearts.push(new DisplayObject("emptyHeart" + i, "heartEmpty.png", null));
		}
	}
}
