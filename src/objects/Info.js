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

			this.reverseTransformations(g);
			g.restore();	
		}

	}

	drawScreen(g){
		if (this.screen == this.WELCOME) {
			var info = this;
			var text = "<h1>Welcome to Oh No You Squidn't!</h1>";
			text += "<p>How to Play:</p>";
			var button = document.createElement("input");
			button.type = "button";
			button.value = "Start Game";
			button.onclick = function() {
				info.hide();
			}
			document.getElementById("controls").innerHTML = text;
			document.getElementById("controls").appendChild(button);
		}
		else if (this.screen == this.PAUSE) {
			var info = this;
			var text = "<h1>Game Paused</h1>";
			var button = document.createElement("input");
			button.type = "button";
			button.value = "Resume Game";
			button.onclick = function() {
				info.hide();
			}
			document.getElementById("controls").innerHTML = text;
			document.getElementById("controls").appendChild(button);
		}
		else if (this.screen == this.END) {
			var info = this;
			var text = "<h1>Game Over!</h1>";
			text += "<h2>Score: " + SCORE.score + "</h2>";
			// var button = document.createElement("input");
			// button.type = "button";
			// button.value = "Resume Game";
			// button.onclick = function() {
			// 	info.hide();
			// }
			document.getElementById("controls").innerHTML = text;
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