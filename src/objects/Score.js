"use strict";

class Score extends Sprite {
    constructor(id, filename, parent){
		super(id, filename, parent);
		this.w = 300;
		this.h = 100;
		this.x = 700;
		this.y = 0;
		this.containter = new Hitbox(this.x, this.y, this.w, this.h);
		this.score = 0;
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
		g.fillText("Score", this.x + 5, this.y + 35);

		//g.font = "20px Helvetica";
		g.fillText(this.score, (this.x + this.w) - 50, this.y + 35);

	}
}
