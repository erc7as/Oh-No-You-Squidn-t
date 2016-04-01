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
    }

    update(pressedKeys){

    }

    addFood() {
    	this.score++;
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


		g.fillText("Lives:", this.x + 200, this.y + 35);
		var heartNum = 0;
		// Draw full hearts
		for (var i = 0; i < game.player.lives; i++, heartNum++) {
			var heart = this.fullHearts[i];
			heart.setX(this.x + 280 + (heartNum * 35));
			heart.setY(10);
			heart.draw(g);
		}
		// Draw empty hearts
		for (var i = 0; i < 3 - game.player.lives; i++, heartNum++) {
			var heart = this.emptyHearts[i];
			heart.setX(this.x + 280 + (heartNum * 35));
			heart.setY(10);
			heart.draw(g);
		}

		g.fillText("Mode:", this.x + 500, this.y + 35);
		g.fillText(game.mode, this.x + 600, this.y + 35);

		

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
