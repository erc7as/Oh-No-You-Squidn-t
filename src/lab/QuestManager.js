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
			$("#log").append("<p>------QUEST COMPLETE</p>");
			$("#log").append("<br/><p>---New Quest: Pick up coin!</p>");
		}

		// Part of Coin object
		if (event.eventType == COIN_PICKED_UP) {
			$("#log").append("<p>------QUEST COMPLETE</p>");
			soundManager.playSoundEffect("coin");

			var coin = event.getSource();
			coin.coinExitTween1 = new Tween(coin);
			coin.coinExitTween1.animate(TweenableParam.SCALE_X, .5, 2, 500);
			coin.coinExitTween1.animate(TweenableParam.SCALE_Y, .5, 2, 500);
			coin.coinExitTween1.animate(TweenableParam.X, coin.getX(), 300, 500);
			coin.coinExitTween1.animate(TweenableParam.Y, coin.getY(), 150, 500);

			tweenJuggler.add(coin.coinExitTween1);
			coin.addEventListener(questManager, COIN_EXIT_1);

			//var coinExitTween2 = new Tween(this);
			//coinExitTween2.animate(TweenableParam.ALPHA, 1, 0, 1000);
		
			coin.removeEventListener(questManager, COIN_PICKED_UP);
			
		}

		if (event.eventType == COIN_EXIT_1) {
			var coin = event.getSource();
			var coinExitTween2 = new Tween(coin);
			coinExitTween2.animate(TweenableParam.ALPHA, 1, 0, 500);
			coinExitTween2.animate(TweenableParam.ALPHA, 1, 0, 500);

			tweenJuggler.add(coinExitTween2);
			//var coinExitTween2 = new Tween(this);
			//coinExitTween2.animate(TweenableParam.ALPHA, 1, 0, 1000);
		
			coin.removeEventListener(questManager, COIN_EXIT_1);
		}
	}

}