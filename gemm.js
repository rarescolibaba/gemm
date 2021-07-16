// https://kaboomjs.com/#kaboom
const k = kaboom({
	global: true,
	width: 800,
	height: 400,
	clearColor: false,
	scale: 1,
	debug: true, // https://kaboomjs.com/#debug
	crisp: true,
	plugins: [],
}), z = new vec2(width(), height())

// Shadow offset
const sOff = new vec2(0, z.y / 100)

const rng = makeRng(Date.now());
let samples = {}

/*
function health(hp) {
	// returned functions are assigned to the objects with a health() component
	return {
		hurt(n) {
			hp -= n;
			if (hp <= 0) {
				// trigger a custom event
				this.trigger("death");
			}
		},
		heal(n) {
			hp += n;
		},
		hp() {
			return hp;
		},
	}
}
*/

// Usage: loadThese("path/to/click.ogg", upto = 4") to load click1.ogg - click4.ogg as "click1" - "click4"
function loadThese(file, upto = 1, i = 1, name = null) {
	let parts = file.split(".")
	let type = parts.pop()
	file = parts
	if (!name) name = parts.join().split("/").pop()
	switch (type) {
		case "ogg":
		case "mp3":
		case "wav":
			for (i; i <= upto; i++)
				loadSound(`${name}${i}`, `${file}${i}.${type}`)
			break
		case "jpg":
		case "jpeg":
		case "png":
		case "img":
			for (i; i <= upto; i++)
				loadSprite(`${name}${i}`, `${file}${i}`)
			break
		case "pedit":
			for (i; i <= upto; i++)
				loadPedit(`${name}${i}`, `${file}${i}`)
		default:
			throw new Error(`unknown file type "${type}"`)
	}
	// Track how many samples of each sound effect there are
	samples["clicks"] = upto
}
// picks a random 
function playRand(asset) {
	play(asset + Math.ceil(rand(samples[`${asset}s`])))
}

loadThese("audio/click.ogg", 4)

scene("mainmenu", () => {
	add([text("gemm!", 128), origin("top"), color(0), pos(400, 14), "shadow"])
	const title = add([text("gemm!", 128), origin("top"), pos(400, 10), "title"])

	add([rect(480, 30), color(0), pos(96, 164), "shadow"])
	add([rect(480, 30), pos(96, 160), "title"])

	add([
		text("A minigame where you farm gemmz to earn", 12),
		pos(102, 175),
		color(0, 0, 0),
		origin("left"),
		"title"
	])

	let asset = "click"
	// Main menu effects
	mouseClick(() => {
		camShake(1)
	})

	let mouseToggle = false
	title.clicks(() => {
		if (!mouseToggle) {
			mouseToggle = true
			every("title", (obj) => {
				obj.move(0, 240)
			})
			playRand("click") // Play around with pitch
			// Transition: slide upward to black
			wait(0.5, () => {
				every("title", (obj) => {
					obj.move(0, -240)
				})
				playRand("click")
			})
			wait(1.5, () => {
				go("level1")
			})
			// Load assets for level1 here
			// Customize what we load from a spritesheet
			loadSprite("adventurer", "visual/adventurer.png", {
				sliceX: 7, // Number of cols
				sliceY: 16, // Number of rows
				anims: {
					// idling animSpeed: 0.25
					idle: {
						from: 0,
						to: 3,
					},
					idleSword: {
						from: 38,
						to: 41,
					},
					// attacking animSpeed: 0.1
					attack1: {
						from: 42,
						to: 46,
					}
				}
			})
		}
	})
})

scene("level1", () => {
	// Start with black screen
	console.log("loaded \"first\"")

	let endAttack = false
	
	const runr = add([
    sprite("adventurer", {
        animSpeed: 0.25,
    }),
    pos(10, 10),
    scale(4)
  ])
	runr.play("idleSword")
	// TODO: Find a method for ending attack animation smoothly, then switching to idle animation when mouse is released
	mouseClick(() => {
		if (runr.curAnim().slice(0, -1) !== "attack") runr.animSpeed = 0.1, runr.play("attack1")
		// TODO: Find a method to setInterval only while the attack animation is playing
	})
	mouseRelease(() => {
		if (runr.curAnim().slice(0, -1) == "attack") runr.animSpeed = 0.25, runr.play("idleSword")
	})
})

start("mainmenu")
