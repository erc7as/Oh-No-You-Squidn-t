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

	playSoundEffect(id, volume) {
		if (volume) this.soundEffects[id].volume = volume;
		this.soundEffects[id].play();
	} //sound effects are short and are removed once complete

	loadMusic(id, filename) {
		this.music[id] = new Audio('resources/' + filename);
	}

	playMusic(id, game) {
		this.music[id].volume = 0.40;
		this.music[id].loop = true;
		//while (game.playing)
			this.music[id].play();
	} //music loops and plays forever, consider adding a parameter for looping

	pauseMusic(id, game) {
		this.music[id].pause();
	}

	unpauseMusic(id, game) {
		this.music[id].play();
	}
}