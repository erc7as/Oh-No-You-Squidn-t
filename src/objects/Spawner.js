"strict"
class Spawner{
	constructor(){
		this.food_container = null;
		this.squid_container = null;
		this.squid_count = 0;
		this.food_count = 0;
	};

	setFoodContainer(food_container){
		this.food_container = food_container;
	};

	setSquidContainer(squid_container){
		this.squid_container = squid_container;
	};

	spawnFood(){
		console.log("Makin Food!");
		var new_food = new Food("food" + this.food_count, this.food_container);
		new_food.setX(Math.floor(Math.random() * 800 + 1));
		new_food.setY(Math.floor(Math.random() * 600 + 1));
		new_food.addEventListener(QUEST_MANAGER, FOOD_PICKED_UP);
		this.food_count += 1;
	};

	spawnSquid(){
		var npc = new Squid("npc" + this.squid_count, "tophat.png", this.squid_container);
		npc.setX(Math.floor(Math.random() * 800 + 1));
		npc.setY(Math.floor(Math.random() * 600 + 1));
		npc.setStrength(Math.floor(Math.random() * (PLAYER.strength*2 - PLAYER.strength/2 + 1)) + PLAYER.strength/2);
		npc.px = 64;
		npc.py = 50;
		npc.addEventListener(QUEST_MANAGER, COLLISION);
		this.squid_count += 1;
	};
};