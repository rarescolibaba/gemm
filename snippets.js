loadRoot("/path/to/") // minimizes duplication
loadSprite("dino1", "dino1.png")
loadSprite("dino2", "dino2.png")

/* Customize what we load from a spritesheet, outside of scenes */
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
})

/* Inside a scene */
  const dino1 = add([sprite("dino1"), pos(0, 0), scale(4)])
  const dino2 = add([sprite("dino2"), pos(100, 0), scale(4)])
  const dino3 = add([sprite("dino3"), pos(200, 0), scale(4)])
  const dino4 = add([sprite("dino4"), pos(300, 0), scale(4)])

  dino1.play("main")
  dino2.play("main")
  dino3.play("main")
  dino4.play("main")


/* Reading input letter by letter */
	charInput((ch) => {
		input = input.charAt(input.length-1) + ch // keep last 2 chars
		console.log(input)
	})

// Maybe this will be useful later: console.log(obj.pos)
{ x: 400,
  y: 204,
  clone: [Function],
  add: [Function],
  sub: [Function],
  scale: [Function],
  dist: [Function],
  len: [Function],
  unit: [Function],
  normal: [Function],
  dot: [Function],
  angle: [Function],
  lerp: [Function],
  eq: [Function],
  str: [Function] }
// see also, math section: https://kaboomjs.com/#vec2