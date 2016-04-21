"use strict";

/**
 * 
 */
class QuestManager extends IEventListener {

	constructor() {
		super();
	}

	handleEvent(event) {
		if (event.eventType == COLLISION) {
			var npc = event.getSource();
			npc.removeEventListener(QUEST_MANAGER, COLLISION);
			if (game.mode == "Fight"){
				var ratio = game.player.strength/npc.strength;
				var rand = Math.random();
				var rand2 = Math.random();
				if (ratio >= 1) {
					npc.parent.children.remove(npc);
					SCORE.addPoints();
					SPAWNER.spawnSquid();
					SOUND_MANAGER.playSoundEffect("fightWon");
				}
				else if (rand <= ratio && rand2 <= ratio){
					npc.parent.children.remove(npc);
					SCORE.addPoints();
					SPAWNER.spawnSquid();
					SOUND_MANAGER.playSoundEffect("fightWon");
				}
				else {
					game.player.lives--;
					console.log("lost a life!!!");
					SOUND_MANAGER.playSoundEffect("fightLost");
				}
			}
			else {
				var ratio = game.player.strength/npc.strength;
				var rand = Math.random();
				if (ratio >= 1) {
					game.player.confidence++;
					SOUND_MANAGER.playSoundEffect("flirt");
				}
				else if (rand <= ratio){
					game.player.confidence += 1/ratio;
					SOUND_MANAGER.playSoundEffect("flirt");
				}
				else {
					game.player.confidence -= 1/ratio;
				}
			}

		}

		// Part of Coin object
		if (event.eventType == FOOD_PICKED_UP) {
			SOUND_MANAGER.playSoundEffect("coin");
			SPAWNER.spawnFood();  // Spawn new Food
			var food = event.getSource();
			food.exitTween1 = new Tween(food);
			food.exitTween1.animate(TweenableParam.SCALE_X, .5, 2, 500);
			food.exitTween1.animate(TweenableParam.SCALE_Y, .5, 2, 500);
			food.exitTween1.animate(TweenableParam.X, food.getX(), 300, 500);
			food.exitTween1.animate(TweenableParam.Y, food.getY(), 150, 500);

			tweenJuggler.add(food.exitTween1);
			food.addEventListener(QUEST_MANAGER, FOOD_EXIT_1);

			//var coinExitTween2 = new Tween(this);
			//coinExitTween2.animate(TweenableParam.ALPHA, 1, 0, 1000);
		
			food.removeEventListener(QUEST_MANAGER, FOOD_PICKED_UP);
			game.player.squidSize++;
		}

		if (event.eventType == FOOD_EXIT_1) {
			var food = event.getSource();
			var foodExitTween2 = new Tween(food);
			foodExitTween2.animate(TweenableParam.ALPHA, 1, 0, 500);
			foodExitTween2.animate(TweenableParam.ALPHA, 1, 0, 500);
			tweenJuggler.add(foodExitTween2);
			//var coinExitTween2 = new Tween(this);
			//coinExitTween2.animate(TweenableParam.ALPHA, 1, 0, 1000);
		
			food.removeEventListener(QUEST_MANAGER, FOOD_EXIT_1);
			food.parent.children.remove(food);
		}

		if (event.eventType == SHARK_ATTACK) {
			var shark = event.getSource();
			shark.removeEventListener(QUEST_MANAGER, SHARK_ATTACK);
			game.player.lives--;
			console.log("lost a life!!!");
			SOUND_MANAGER.playSoundEffect("fightLost");
		}

		if (event.eventType == SQUID_SPAWN) {
			var squid = event.getSource();
			var squidEnterTween = new Tween(squid);
			squidEnterTween.animate(TweenableParam.ALPHA, .0, 1, 6000);
			squidEnterTween.animate(TweenableParam.X, event.sx, event.dx, 10000);
			squidEnterTween.animate(TweenableParam.Y, event.sy, event.dy, 10000);
			tweenJuggler.add(squidEnterTween);
		}

		if (event.eventType == POWER_UP.SPEED) {
			var powerUp = event.getSource();
			powerUp.removeEventListener(QUEST_MANAGER, POWER_UP.SPEED);
			SCORE.addPowerUp(powerUp);

			game.player.addPowerUp(POWER_UP.SPEED, powerUp);
		}

		if (event.eventType == POWER_UP.LIFE) {
			var powerUp = event.getSource();
			powerUp.removeEventListener(QUEST_MANAGER, POWER_UP.LIFE);
			game.player.addPowerUp(POWER_UP.LIFE, powerUp);
			powerUp.parent.children.remove(powerUp);
		}

		if (event.eventType == POWER_UP.INVINCIBLE) {
			var powerUp = event.getSource();
			powerUp.removeEventListener(QUEST_MANAGER, POWER_UP.INVINCIBLE);
			SCORE.addPowerUp(powerUp);

			game.player.addPowerUp(POWER_UP.INVINCIBLE, powerUp);
		}
	}

}