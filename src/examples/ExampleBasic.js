
export default (doc) => `${doc.intro}
{
	name: 'Basic Example',
	setup: () => {

		// H Y D R A

		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.s1.init({src: inputVideo })   // create webcam source at "s1" 

		// H Y D R A

		synth
			.src( synth.s1 )    // webcam
			.contrast( 2 )
			.modulateRotate( osc( 0.2, 0.1, 0 ), 200, 200 ) 
			.diff( synth.src( synth.s0 ) )    // p5
			.out()    
	},
	update: async () => {
		
		// M A C H I N E L E A R N I N G

		// nothing to do here

	},
	draw: () => {

		// P 5

		const w = outputCanvas.width
		const h = outputCanvas.height
		
		p5.colorMode(p5.HSB)
		p5.fill( 200, 100, 100 )
		p5.circle( w/2, h/2, h * 0.8 )

	}
}
`