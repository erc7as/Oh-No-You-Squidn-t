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

/**
 * Picked Up Event
 */
class PowerUpEvent extends Event {

	constructor(source) {
		super(source.event, source);
	}

}

class SharkEvent extends Event {

	constructor(source) {
		super(SHARK_ATTACK, source);
	}
}

class SpawnSquid extends Event {
	constructor(source, sx, sy, dx, dy){
		super(SQUID_SPAWN, source);
		this.sx = sx;
		this.sy = sy;
		this.dx = dx;
		this.dy = dy;
	}
}
