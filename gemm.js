// https://kaboomjs.com/#kaboom
const k = kaboom({
	global: true,
	width: 800,
	height: 400,
	clearColor: false,
	scale: 1,
	debug: true, // https://kaboomjs.com/#debug
	crisp: true,
	plugins: [loadThis],
}), z = new vec2(width(), height())

// Shadow offset
const sOff = new vec2(0, z.y / 100)
let samples = {}

function loadThis(k) {
	return {
		// Usage: loadThis("path/to/click.ogg", upto = 4") to load click1.ogg - click4.ogg as "click1" - "click4"
		loadThis(file, upto = 1, i = 1, name = null) {
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
			return upto
		}
	}
}

// Track how many samples of each sound effect there are. Find a better method to pick a random sample?
samples[clicks] = loadThis("audio/click.ogg", upto = 4)

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

	// Main menu effects
	mouseClick(() => camShake(1))

	let mouseToggle = false
	title.clicks(() => {
		if (!mouseToggle) {
			mouseToggle = true
			every("title", (obj) => {
				obj.move(0, 240)
			})
			play(`click${Math.round(rand(samples[clicks]))}`) // Play around with pitch
			// Transition: slide upward to black
			wait(0.5, () => {
				every("title", (obj) => {
					obj.move(0, -240)
				})
				play(`click${Math.round(rand(samples[clicks]))}`)
			})
			wait(1.5, () => {
				go("level1")
			})
			// Load assets for level1 here
		}
	})
})

scene("level1", () => {
	// Start with black screen
	console.log("loaded \"first\"")
})

start("mainmenu")
