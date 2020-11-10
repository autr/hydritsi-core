
export default (doc) => `${doc.intro}

{
	name: 'Emotion Example 2',
	config: {
		autoScale: true
	},
	setup: () => {

		// H Y D R A

		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.s1.init({src: inputVideo })   // create webcam source at "s1"

		store.emotions = []
		store.emojis = []
		store.fps = 0

	},
	update: async () => {

		// M A C H I N E L E A R N I N G

		// do data tasks here...

		store.emotions = await helper.getEmotions( inputVideo )

		store.fps += 1

		if (store.fps % 30 != 0) return

		store.emotions.forEach( emote => {

			let face;
			if (emote.emotion == 'angry') face = '😡'
			if (emote.emotion == 'disgusted') face = '🤢'
			if (emote.emotion == 'fear') face = '😨'
			if (emote.emotion == 'sad') face = '☹️'
			if (emote.emotion == 'surprised') face = '😮'
			if (emote.emotion == 'happy') face = '😁'

			let size = emote.value * 5;
			if (emote.emotion == 'happy') size /= 5


			let x = p5.map( Math.random(), -1, 1, 0, p5.canvas.width )
			let y = -20

			let speed = ( Math.random() + 1 ) / 2

			if (size > 0.6) store.emojis.push( { face, size, x, y, speed } )

		})


		// helpers are asyncronous functions - ie. wait for some data

	},
	draw: () => {

		// P 5

		p5.fill(255)

		for (let i = 0; i < store.emojis.length; i++ ) {
			const emoji = store.emojis[i];

			p5.textSize( emoji.size * 128 )
			// p5.textAlign( p5.CENTER )
			p5.text( emoji.face, emoji.x, emoji.y )

			emoji.y += emoji.speed * 2
			if ( emoji.y > p5.canvas.height ) store.emojis.splice( i, 1 )
		}

		// H Y D R A
		
		synth
			.osc( Math.sin(new Date() * 0.001) * 40 , 0.1, 0.8)                // create video synth
			.diff( synth.src( synth.s1 ) )    // blend with webcam
			.diff( synth.src( synth.s0 ) )    // blend with p5
			.out(  )   
	}
}
`