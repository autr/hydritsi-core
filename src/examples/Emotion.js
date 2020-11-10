
export default (doc) => `${doc.intro}

{
	name: 'Emotion Example',
	config: {
		autoScale: true
	},
	setup: () => {

		// H Y D R A

		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.s1.init({src: inputVideo })   // create webcam source at "s1"

	},
	update: async () => {

		// M A C H I N E L E A R N I N G

		// do data tasks here...

		store.emotions = await helper.getEmotions( inputVideo )

		// helpers are asyncronous functions - ie. wait for some data

	},
	draw: () => {

		// P 5

		p5.fill(255)


		// H Y D R A
		
		synth
			.osc( Math.sin(new Date() * 0.001) * 40 , 0.1, 0.8)                // create video synth
			.diff( synth.src( synth.s1 ) )    // blend with webcam
			.diff( synth.src( synth.s0 ) )    // blend with p5
			.out(  )   

		if ( !store.emotions ) return

		store.emotions.forEach( (emote, i) => {

			let face;
			if (emote.emotion == 'angry') face = '😡'
			if (emote.emotion == 'disgusted') face = '🤢'
			if (emote.emotion == 'fear') face = '😨'
			if (emote.emotion == 'sad') face = '☹️'
			if (emote.emotion == 'surprised') face = '😮'
			if (emote.emotion == 'happy') face = '😁'

			let x = ( p5.canvas.width / 6 ) * i
			let y = p5.canvas.height / 2


			p5.textSize( emote.value * 800 )
			p5.textAlign( p5.CENTER )
			p5.text( face, x, y )

		})


	}}
`