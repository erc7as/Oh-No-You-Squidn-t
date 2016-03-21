"use strict";

/**
 * Picked Up Event
 */
class PickedUpEvent extends Event {

	constructor(source) {
		super(COIN_PICKED_UP, source);
	}

}

/**
 * Coin Exit Event
 */
class CoinExit1 extends Event {

	constructor(source) {
		super(COIN_EXIT_1, source);
	}

}

/**
 * Collision Event
 */
class CollisionEvent extends Event {

	constructor(source) {
		super(COLLISION, source);
	}

}