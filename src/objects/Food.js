"use strict";

class Food extends Sprite {
	constructor(id, parent){
		super(id, "shrimp.png", parent);
		this.setScaleX(.05);
		this.setScaleY(.05);
		//this.px = 35;
		//this.py = 20;
		//this.setRotation(Math.random() * 360);
		//this.setPivotPoint([40, 24]);
		this.color = "#000000";
	}

	// Overwritten from DisplayObject to make it rotated for food
	getWorldHitbox() {
		var worldPoint = this.convertCoordinates();
		var diff = this.getWidth() - this.getHeight();
		return new Hitbox(worldPoint.x + diff/2, worldPoint.y, this.getWidth() - 7 - diff, this.getHeight() - 7);
	}


	draw(g) {
		super.draw(g);
		//g.strokeStyle = this.color;
		//g.strokeRect(this.getWorldHitbox().x, this.getWorldHitbox().y, this.getWorldHitbox().w, this.getWorldHitbox().h);
		//g.fillRect(this.x + this.px, this.y + this.py, 3, 3);
	}

}