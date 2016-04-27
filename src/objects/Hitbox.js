"use strict";

/**
 * A very basic rectangle object representing a hitbox. Extends DisplayObject for the transformation properties
 * 
 * */
class Hitbox {
	
	constructor(x, y, w, h, scale, object){
		this.flipped = false;
		if (object && object.flipped) {
			this.x = x + w;
			this.y = y;
			this.flipped = true;
		}
		else {
			this.x = x;
			this.y = y;
		}
		
		this.w = w;
		this.h = h;
		this.color = "#000000";
		if (false) {
			this.scale = scale;
			this.w *= scale;
			this.h *= scale;
		}
		else
			this.scale = 1;
		
	}

	update(hitbox) {
		if (this.flipped) {
			this.x = hitbox.x + hitbox.w;
			this.y = hitbox.y + hitbox.h;
		}
		else {
			this.x = hitbox.x;
			this.y = hitbox.y;
		}
		this.w = hitbox.w * this.scale;
		this.h = hitbox.h * this.scale;
		if (this.scale != 1) {
			this.x += ((hitbox.w * this.scale) / 2);
			this.y += ((hitbox.h * this.scale) / 2);
		}
	}

	intersects(b) {
		var x = Math.max(this.x, b.x);
		var num1 = Math.min(this.x + this.w, b.x + b.w);
		var y = Math.max(this.y, b.y);
		var num2 = Math.min(this.y + this.h, b.y + b.h);
		if (num1 > x && num2 > y) {
			this.color = "#FF0000";
			return true;
		}
		else {
			this.color = "#000000";
			return false;
		}
	}

	/**
	 * Overriden. Draws a rectangle
	 */
	draw(g){
		if(this.visible){
			g.save();
			this.applyTransformations(g);
			g.strokeStyle = this.color;
			g.strokeRect(this.x, this.y, this.w, this.h);
			this.reverseTransformations(g);
			g.restore();
		}
	}

	getMinX() {
		return this.x;
	}

	getMaxX() {
		return this.x + this.w;
	}

	getMinY() {
		return this.y;
	}

	getMaxY() {
		return this.y + this.h;
	}
}
