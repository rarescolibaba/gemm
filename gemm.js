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
const dir = {
	"up": new vec2(0, -1),
	"down": new vec2(0, 1),
	"left": new vec2(-1, 0),
	"right": new vec2(1, 0),
	"ul": new vec2(-0.707, -0.707),
	"ur": new vec2(0.707, -0.707),
	"dl": new vec2(-0.707, 0.707),
	"dr": new vec2(0.707, 0.707)
}
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
					run: {
						from: 8,
						to: 13,
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
	
	add([rect(z.x, 30), pos(0, z.y-30), solid(), "floor"])
	const runr = add([
    sprite("adventurer", {
        animSpeed: 0.25,
    }),
    pos(10, 10),
    scale(4),
		body({
        // force of .jump()
        jumpForce: 640,
        // maximum fall velocity
        maxVel: 2400,
    })
  ])
	runr.play("idleSword")

	let playerSpeed = 420, attMod = 1, facingRight = true, running = false
	const attacking = function() {return runr.curAnim().slice(0, -1) == "attack"}

	// This is probably inefficient. Look for a better method to handle movement?
	keyDown("a", () => {
		if (!running && !attacking()) running = true, runr.animSpeed = 0.1, runr.play("run")
		// correct sprite position
		if (facingRight) {
			facingRight = false
			runr.use(scale(-runr.scale.x, runr.scale.y))
			runr.move(runr.width*runr.scale.y*60, 0)
		}
		runr.move(dir.left.scale(playerSpeed * attMod))
	})
	keyDown("d", () => {
		if (!running && !attacking()) running = true, runr.animSpeed = 0.1, runr.play("run")
		// correct sprite position
		if (!facingRight) {
			facingRight = true
			runr.use(scale(-runr.scale.x, runr.scale.y))
			runr.move(-runr.width*runr.scale.y*60, 0)
		}
		runr.move(dir.right.scale(playerSpeed * attMod))
	})
	// Find a better method to end animations when keys are released
	keyRelease("a", () => {
		running = false
		if (!attacking()) runr.animSpeed = 0.25, runr.play("idle"), attMod = 1
	})
	keyRelease("d", () => {
		running = false
		if (!attacking()) runr.animSpeed = 0.25, runr.play("idle"), attMod = 1
	})
	keyPress("space", () => {
		// Implement jumping on surfaces, but not freely
	})
	mouseClick(() => {
		// TODO: Find a method to setInterval only while the attack animation is playing
		if (!attacking()) runr.animSpeed = 0.1, runr.play("attack1"), attMod = 0.2
	})
	mouseRelease(() => {
		if (attacking()) {
			if (running) runr.animSpeed = 0.1, runr.play("run"), attMod = 1
			else runr.animSpeed = 0.25, runr.play("idle"), attMod = 1
		}
	})
})

start("mainmenu")
