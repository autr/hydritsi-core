
export default (doc) => `${doc.intro}

{
	name: 'Basic Example',
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

		// nothing to do here

	},
	draw: () => {

		// H Y D R A

		synth
			.osc(20, 0.1, 0.8)                // video synth
			.diff( synth.src( synth.s1 ) )    // blend with webcam
			.diff( synth.src( synth.s0 ) )    // blend with p5
			.out(  )                          // send to output


		// P 5

		const w = p5.canvas.width
		const h = p5.canvas.height

		p5.fill( 255 )
		p5.rect( 40, 40, w - 80, h - 80)

		p5.fill( 0 )
		p5.circle( w/2, h/2, h/2)

	}
}
`