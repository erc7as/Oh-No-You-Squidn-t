"use strict";

class Food extends Sprite {
	constructor(id, parent){
		super(id, "shrimp.png", parent);
		this.setScaleX(.05);
		this.setScaleY(.05);
	}
}