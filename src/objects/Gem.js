"use strict";

class Gem extends Sprite {
    constructor(id, color, parent){
		super(id, "gem_" + color + ".png", parent);
		this.defaultImage = this.displayImage;
		this.loadSelectedImage(color);
    }

    /**
	 * Loads the image, sets a flag called 'loaded' when the image is ready to be drawn
	 */
	loadSelectedImage(color){
		this.selectedImage = new Image();
	  	this.selectedImage.onload = function(){
	  		this.loaded = true;
	  	};
	  	this.selectedImage.src = 'resources/gem_glow_' + color + '.png';
	}
}