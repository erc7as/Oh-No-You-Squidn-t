var COLLISION = "The objects collided";
var FOOD_PICKED_UP = "The food was picked up";
var FOOD_EXIT_1 = "The food moved to the center of the screen";
var SHARK_ATTACK = "A shark attacked!";
var SHARK_DESPAWN = "The shark went away.";

var PLAYER = null;
var SPAWNER = new Spawner();
var QUEST_MANAGER = new QuestManager();
var SOUND_MANAGER = new SoundManager();
// var pickedUpEvent = new PickedUpEvent();
var collisionEvent = new CollisionEvent();
var tweenJuggler = new TweenJuggler(); // Singleton
var canvasHitbox = new Hitbox(0, 0, 950, 530);

var gameClock = 0;
var SCORE;
var game;