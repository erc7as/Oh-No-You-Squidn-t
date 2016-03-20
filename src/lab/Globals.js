var COLLISION = "The objects collided";
var COIN_PICKED_UP = "The coin was picked up";
var COIN_EXIT_1 = "The coin moved to the center of the screen";

var questManager = new QuestManager();
var soundManager = new SoundManager();
var pickedUpEvent = new PickedUpEvent();
var collisionEvent = new CollisionEvent();
var tweenJuggler = new TweenJuggler(); // Singleton

var gameClock = 0;
