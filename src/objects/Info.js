"use strict";

class Info extends Sprite {
	

    constructor(id, filename, parent, width, height){
		super(id, filename, parent);
		this.w = width;
		this.h = height;
		this.x = 0;
		this.y = 0;
		this.containter = new Hitbox(this.x, this.y, this.w, this.h);
		this.alpha = .5;

		this.WELCOME = "Welcome screen to the game";
		this.PAUSE = "Game pause screen";
		this.END = "Game over screen";

		this.welcomeScreen = new DisplayObject("welcomeScreen", "welcome.png", null);
		this.pauseScreen = new DisplayObject("pauseScreen", "pause.png", null);
		this.endScreen = new DisplayObject("endScreen", "end.png", null);

		this.screen = this.WELCOME;
		this.drawScreen();
    }

    update(pressedKeys){

    }

    addPoints() {
    	this.score++;
    }

	draw(g){
		super.draw(g);
		if (this.visible) {
			g.save();
			this.applyTransformations(g);
			
			// Draw the background
			g.fillStyle = "#FFFFFF";
			g.fillRect(this.containter.x, this.containter.y, this.containter.w, this.containter.h);

			if (this.screen == this.WELCOME) {
				this.welcomeScreen.draw(g);
			}
			else if (this.screen == this.PAUSE) {
				this.pauseScreen.draw(g);
			}
			else if (this.screen == this.END)
				this.endScreen.draw(g);

			this.reverseTransformations(g);
			g.restore();	
		}

	}

	drawScreen(g){
		if (this.screen == this.WELCOME) {
			var info = this;
			// var text = "<h1>Welcome to Oh No You Squidn't!</h1>";
			// text += "<p>How to Play: You're a squid! You want to get as high of a score as you can. You get score points by successfully fighting other squids.</p><p>You'll start out in FLIRT mode, though. Flirting increases your confidence, which in turn increases your strength (good thing).</p><p>Fighting increases your size, which also in turn increases your strength. You can toggle between FLIRT and FIGHT using the \"1\" and \"2\" keys.</p>Watch out for sharks! And keep an eye out for powerup gems!</p>";
			var button = document.createElement("input");
			button.type = "button";
			button.value = "Start Game";
			button.onclick = function() {
				info.hide();
			}
			//document.getElementById("controls").innerHTML = text;
			document.getElementById("controls").appendChild(button);
		}
		else if (this.screen == this.PAUSE) {
			var info = this;
			//var text = "<h1>Game Paused</h1>";
			document.getElementById("controls").style.top = "20%";
			var button = document.createElement("input");
			button.type = "button";
			button.value = "Resume Game";
			button.onclick = function() {
				info.hide();
			}
			//document.getElementById("controls").innerHTML = text;
			document.getElementById("controls").appendChild(button);
		}
		else if (this.screen == this.END) {
			var info = this;
			var text = "<br/><br/><h1>Score: " + SCORE.score + "</h1>";
			// var button = document.createElement("input");
			// button.type = "button";
			// button.value = "Resume Game";
			// button.onclick = function() {
			// 	info.hide();
			// }
			document.getElementById("controls").style.top = "30%";
			document.getElementById("controls").innerHTML = text;

			var button = document.createElement("input");
			button.type = "button";
			button.value = "Start New Game";
			button.onclick = function() {
				document.getElementById("controls").innerHTML = "";
				document.getElementById("controls").style.top = "10%";
				var drawingCanvas = document.getElementById('game');
				game = new Main(drawingCanvas);
				game.start();
			}
			//document.getElementById("controls").innerHTML = text;
			document.getElementById("controls").appendChild(button);
			// document.getElementById("controls").appendChild(button);
		}	

	}

	show(mode) {
		if (!this.visible) {
			game.paused = true;
			this.visible = true;
			var rootContainer = this.getParent();
			if (mode != this.END) 
				rootContainer.getChildById("game").setVisible(false);
			else {
				this.alpha = .65;
				game.playing = false;
			}
			this.screen = mode;
			this.drawScreen();
		}
	}

	hide() {
		game.paused = false;
		this.visible = false;
		var rootContainer = this.getParent();
		rootContainer.getChildById("game").setVisible(true);
		document.getElementById("controls").innerHTML = "";
	}

}