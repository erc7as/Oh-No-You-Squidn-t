"strict"
class Spawner{
	constructor(){
		this.food_container = null;
		this.squid_container = null
		this.shark_container = null;
		this.powerup_container = null;
		this.squid_count = 0;
		this.food_count = 0;
		this.shark_count = 0;
	};

	setFoodContainer(food_container){
		this.food_container = food_container;
	};

	setSquidContainer(squid_container){
		this.squid_container = squid_container;
	};

	setSharkContainer(shark_container) {
		this.shark_container = shark_container;
	};

	setPowerupContainer(powerup_container) {
		this.powerup_container = powerup_container;
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
		var squidColors = ["blue", "green", "violet"];
		var colorIndex = Math.floor(Math.random() * 3);
		var npc = new Squid("npc" + this.squid_count, "squid_" + squidColors[colorIndex] + ".png", this.squid_container);		
		var spawn_top = Math.random() < .5;
		var spawn_left = Math.random() < .5;
		var spawn_x = 1000;
		var spawn_y = 1000;
		if (spawn_top){ spawn_y = spawn_y * -1;}
		if (spawn_left){ spawn_x = spawn_x * -1;}
		var dst_x = Math.floor(Math.random() * 800 + 1);
		var dst_y = Math.floor(Math.random() * 600 + 1);
		npc.setStrength(Math.floor(Math.random() * (PLAYER.strength*2 - PLAYER.strength/2 + 1)) + PLAYER.strength/2);
		npc.addEventListener(QUEST_MANAGER, SQUID_SPAWN);
		npc.dispatchEvent(new SpawnSquid(npc,spawn_x, spawn_y, dst_x, dst_y));
		npc.px = 64;
		npc.py = 30;
		npc.addEventListener(QUEST_MANAGER, COLLISION);
		this.squid_count += 1;
	};

	spawnShark() {
		var shark = new Shark("shark" + this.shark_count, "shark.png", this.shark_container);
		shark.setScaleX(0.5);
		shark.setScaleY(0.5);
		if (shark.lr == 0) {
			shark.setX(1000);
		} else {
			shark.flipped = true;
			shark.setX(-1000);
		}
		SOUND_MANAGER.playSoundEffect("shark");
		shark.setY(Math.floor(Math.random() * 600 + 1));
		shark.addEventListener(QUEST_MANAGER, SHARK_ATTACK);
		shark.addEventListener(QUEST_MANAGER, SHARK_DESPAWN);
		this.shark_count++;
	}

	spawnPowerup(type) {
		var powerup;
		var i = this.powerup_container.getChildren().length;
		if (type == POWER_UP.SPEED) {
			powerup = new Gem("speed" + i, "green", this.powerup_container);
		}
		else if (type == POWER_UP.LIFE) {
			var powerup = new Sprite("life" + i, "gem_red.png", this.powerup_container);
		}
		else if (type == POWER_UP.INVINCIBLE) {
			var powerup = new Gem("invincible" + i, "yellow", this.powerup_container);
		}
		powerup.setX(Math.floor(Math.random() * 800 + 1));
		powerup.setY(Math.floor(Math.random() * 600 + 50));
		powerup.event = type;
		powerup.addEventListener(QUEST_MANAGER, type);
	}
};