"use strict";

/**
 * A sound manager
 * 
 * */
class SoundManager {

	constructor() {
		this.soundEffects = [];
		this.music = [];
	}

	loadSoundEffect(id, filename) {
		this.soundEffects[id] = new Audio('resources/' + filename);
	}

	playSoundEffect(id) {
		this.soundEffects[id].play();
	} //sound effects are short and are removed once complete

	loadMusic(id, filename) {
		this.music[id] = new Audio('resources/' + filename);
	}

	playMusic(id, game) {
		this.music[id].volume = 0.40;
		//if (game.playing)
			this.music[id].play();
	} //music loops and plays forever, consider adding a parameter for looping
}