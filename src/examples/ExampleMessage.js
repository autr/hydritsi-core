
export default (doc) => `${doc.intro}

{
	name: 'Message Example',
	setup: () => { 

		// H Y D R A

		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.s1.init({src: inputVideo })   // create webcam source at "s1"

		synth
			.osc(20, 0.1, 0.8)                // create video synthf
			.diff( synth.src( synth.s1 ) )    // blend with webcam
			.diff( synth.src( synth.s0 ) )    // blend with p5
			.out(  )                          // send to output

	},
	update: async () => {
		
		// M A C H I N E L E A R N I N G

		// nothing to do here

	},
	draw: () => {

		// P 5

		p5.textSize(64)
		p5.fill( 255 )

		if (messages.length <= 0) {
			p5.text( 'send a chat message', outputCanvas.width/2, outputCanvas.height/2 );
		}

		messages.forEach( (m, i) => {

			const speed = 0.001
			const offset = p5.map( Math.sin( (new Date() * speed) + i ), -1, 1, -200, 200 ) 
			const x = i * 300
			while ( x > outputCanvas.width ) x - outputCanvas.width;
			const y = ( outputCanvas.height/2 ) + offset

			p5.text( m.message, x, y )
		})


	},
	onMessage: (e) => {
		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.s1.init({src: inputVideo })   // create webcam source at "s1"

		synth
			.osc(Math.random() * 20, 0.1, 0.8)                // create video synthf
			.diff( synth.src( synth.s1 ) )    // blend with webcam
			.diff( synth.src( synth.s0 ) )    // blend with p5
			.out(  )                          // send to output
	}
}
`