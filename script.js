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

// loadRoot("/path/to/") // minimizes duplication
// loadSprite("dino1", "dino1.png")
// loadSprite("dino2", "dino2.png")

/* Customize what we load from a spritesheet
loadSprite("dino1", "path/to/spritesheet.png", {
  sliceX: 24, // Number of cols
  sliceY: 1, // Number of rows
  anims: {
    main: {
      from: 0, // Range of frames for main animation
      to: 23,
    },
    running: {
      from: 24, // Range of frames for running animation
      to: 47,
    }
  }
}) */

scene("title", () => {

/*
  const dino1 = add([sprite("dino1"), pos(0, 0), scale(4)])
  const dino2 = add([sprite("dino2"), pos(100, 0), scale(4)])
  const dino3 = add([sprite("dino3"), pos(200, 0), scale(4)])
  const dino4 = add([sprite("dino4"), pos(300, 0), scale(4)])

  dino1.play("main")
  dino2.play("main")
  dino3.play("main")
  dino4.play("main")
*/
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

/*
	charInput((ch) => {
		input = input.charAt(input.length-1) + ch // keep last 2 chars
		console.log(input)
	})
*/
})

start("title")
