// https://kaboomjs.com/#kaboom
const k = kaboom({
  global: true,
  width: 800,
  height: 400,
	clearColor: false,
	scale: 1,
	debug: true, // https://kaboomjs.com/#debug
	crisp: true,
	plugins: [], // hopefully doesn't overwrite
}), z = new vec2(width(), height())

// Shadow offset
const sOff = new vec2(0, z.y/100)

//TODO: Trim audio files so they start right at the sound effect
loadSound("click1", "click1.ogg")
loadSound("click2", "click2.ogg")
loadSound("click3", "click3.ogg")
loadSound("click4", "click4.ogg")
// I really should find a better method for this
const clickSounds = ["click1", "click2", "click3", "click4"]

scene("mainmenu", () => {
	add([text("gemm!", 128), origin("top"), color(0), pos(400, 14), "shadow"])
  const title = add([text("gemm!", 128), origin("top"), pos(400, 10), , "title"])

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
	let mouseToggle = false
	title.clicks(() => {
		if (!mouseToggle) {
			mouseToggle = true
			every("title", (obj) => {
				obj.move(0, 240)
			})
			play(choose(clickSounds)) // Play around with pitch
			// Transition: slide upward to black
			wait(0.5, () => {
				every("title", (obj) => {
					obj.move(0, -240)
				})
			})
			wait(1.5, () => {
				go("first")
			})
			// Load in assets here? (test from "first") Find a better method (loop)
			camShake(2)
		}
	})
})

scene("first", () => {
	// Start with black screen
	console.log("loaded \"first\"")
})

start("mainmenu")
