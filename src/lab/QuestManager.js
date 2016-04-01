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
			npc.parent.children.remove(npc);
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
			SCORE.addFood();
		}
	}

}