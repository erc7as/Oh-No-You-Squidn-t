"use strict";

/**
 * Main class. Instantiate or extend Game to create a new game of your own
 */
class Demo extends Game {

	constructor(canvas){
		super("Lab 6 Demo", 800, 600, canvas);
		this.canvasBox = new Hitbox(0, 0, 850, 590);

		soundManager.loadSoundEffect("coin", "coin.wav");
		soundManager.loadSoundEffect("jump", "jump.wav");

		this.platforms = [];
		this.platforms[0] = new Hitbox(200, 250, 70, 10);
		this.platforms[1] = new Hitbox(400, 500, 75, 10);
		this.platforms[2] = new Hitbox(450, 400, 70, 10);
		this.platforms[3] = new Hitbox(330, 350, 70, 10);

		this.mario = new Mario("Mario", "mario.png");
		this.mario.pivotPoint = [64, 64];
		this.mario.x = 30;
		this.mario.y = 500;
		var marioIntroTween = new Tween(this.mario);
		marioIntroTween.animate(TweenableParam.ALPHA, 0, 1, 1500);
		marioIntroTween.animate(TweenableParam.SCALE_X, 0, 1, 1500);
		marioIntroTween.animate(TweenableParam.SCALE_Y, 0, 1, 1500);

		tweenJuggler.add(marioIntroTween);

		this.tophat = new Sprite("Hat", "tophat.png");
		this.tophat.x = 650;
		this.tophat.y = 500;

		this.coin = new Sprite("Coin", "coin.png");
		this.coin.x = 200;
		this.coin.y = 100;
		this.coin.scaleX = .5;
		this.coin.scaleY = .5;
		this.coin.setVisible(false);

		this.mario.addEventListener(questManager, COLLISION);
		this.coin.addEventListener(questManager, COIN_PICKED_UP);
	}

	update(pressedKeys){
		super.update(pressedKeys);
		this.mario.update(this.platforms);
		if (pressedKeys.contains(37) && this.mario.x > 0) // Left
			this.mario.goLeft();
			//this.mario.x -= 2;
		
		if (this.pressedKeys.contains(38)) // Up
			this.mario.jump();
			//this.mario.y -= 2;
		
		if (this.pressedKeys.contains(39) && (this.mario.x + 2) <= (this.width - this.mario.w)) // Right
			this.mario.goRight();
			//this.mario.x += 2;
		
		//if (this.pressedKeys.contains(40) && (this.mario.y + 2) <= (this.height - this.mario.h)) // Down
			//this.mario.y += 2;


		if ((this.tophat.getVisible() && this.tophat.getParent() == null) && this.mario.collidesWith(this.tophat)) {
			
			this.mario.dispatchEvent(collisionEvent);

			this.tophat.scaleX = .25;
			this.tophat.scaleY = .25;
			this.tophat.setParent(this.mario);
			this.tophat.x = -3;
			this.tophat.y = -5;
			this.tophat.rotation = -25;

			var coinIntroTween = new Tween(this.coin);
			coinIntroTween.animate(TweenableParam.ALPHA, 0, 1, 500);
			this.coin.setVisible(true);

			tweenJuggler.add(coinIntroTween);
		}

		if (this.coin.getVisible() && this.mario.collidesWith(this.coin, true)) {
			this.coin.dispatchEvent(new PickedUpEvent(this.coin));
			//this.coin.setVisible(false);
		}
			
		if (this.coin.getVisible() && this.coin.coinExitTween1 != null) {
			if (this.coin.coinExitTween1.isComplete())
				this.coin.dispatchEvent(new CoinExit1(this.coin));
		}

	}

	draw(g){
		g.clearRect(0, 0, this.width, this.height);
		super.draw(g);
		this.mario.draw(g);
		this.mario.stayInside(this.canvasBox);
		if (this.tophat.getParent() == null) this.tophat.draw(g);
		this.coin.draw(g);

		this.checkPlatformCollisions();
		this.drawPlatforms(g);
		
	}

	drawPlatforms(g) {
		this.platforms.forEach(function(r, ind){
			g.rect(r.x, r.y, r.w, r.h);
			g.stroke();
		});
	}

	checkPlatformCollisions() {
		var t = this;
		this.platforms.forEach(function(e, ind){
			//check every plaftorm
			if (
			(t.mario.isFalling) && 
			//only when player is falling
			(t.mario.x < e.x + e.w) && 
			(t.mario.x + t.mario.w > e.x) && 
			(t.mario.y + t.mario.h > e.y) && 
			(t.mario.y + t.mario.h < e.y + e.h)
			//and is directly over the platform
			) {
				t.mario.isFalling = false;
				}
		});
	}

}


/**
 * THIS IS THE BEGINNING OF THE PROGRAM
 * YOU NEED TO COPY THIS VERBATIM ANYTIME YOU CREATE A GAME
 */
function tick(){
	game.nextFrame();
	gameClock++;
}

/* Get the drawing canvas off of the  */
var drawingCanvas = document.getElementById('game');
if(drawingCanvas.getContext) {
	var game = new Demo(drawingCanvas);
	game.start();
}
