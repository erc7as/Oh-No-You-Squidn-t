"use strict";

/**
 * Picked Up Event
 */
class PickedUpEvent extends Event {

	constructor(source) {
		super(FOOD_PICKED_UP, source);
	}

}

/**
 * Coin Exit Event
 */
class FoodExit1 extends Event {

	constructor(source) {
		super(FOOD_EXIT_1, source);
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

class SharkEvent extends Event {

	constructor(source) {
		super(SHARK_ATTACK, source);
	}
}

class SharkDespawn extends Event {

	constructor(source) {
		super(SHARK_DESPAWN, source);
	}
}