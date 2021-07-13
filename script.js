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
})

let w = width(), h = height()

scene("title", () => {
	add([text("gemm!", 128), origin("top"), color(0), pos(400, 14), "shadow"])
  add([text("gemm!", 128), origin("top"), pos(400, 10), , "title"])

	add([rect(480, 30), color(0), pos(96, 164), "shadow"])
  add([rect(480, 30), pos(96, 160), "title"])

  add([
    text("A minigame where you farm gemmz to earn", 12),
    pos(102, 175),
    color(0, 0, 0),
    origin("left"),
		"title"
  ])

	// check cursor pos by moving a collision box around after it. Look for a better method
	const cursor = add([rect(20, 20), color(rgba(0, 0, 0, 0)), pos(32, 32), "cursor"])

/* The engine sometimes misses some mouseRelease events
** when spamclicking, so we use mouseToggle as a check */
	let mouseToggle = false
	let didCollide = false
	mouseClick(() => {
  	cursor.use(pos(mousePos()))
		overlaps("cursor", "button", (c, b) => {
			console.log("did overlap")
			// Move outside collision bounds
			cursor.use(pos(0,0))
		})
		// Title screen effects
		if (!mouseToggle) {
			every("title", (obj) => {
				obj.move(vec2(0, 240))
			})
			mouseToggle = true
		}
		camShake(1)
	})

// camShake() reduces fps if used in mouseRelease when spamclicking
	mouseRelease(() => {
		if (mouseToggle) {
			every("title", (obj) => {
				obj.move(vec2(0, -240))
			})
			mouseToggle = false
		}
	})

	add([rect(185, 50), color(0), pos(246, 254), "shadow"])
  const startTrigger = add([rect(185, 50), pos(246, 250), "button"])

})

start("title")
