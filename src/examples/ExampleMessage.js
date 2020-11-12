
export default (doc) => `${doc.intro}

{
	name: 'Message Example',
	setup: () => { 

		// H Y D R A

		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.s1.init({src: inputVideo })   // create webcam source at "s1"

		synth
			.osc(10, 0.1, 2)				// create video synthf
			.diff( synth.src( synth.s1 ) )	// blend with webcam
			.scale( 1, -1 )					// mirror
			.add( synth.src( synth.s0 ) )	// blend with p5
			.scale( 1, -1 )					// mirror
			.out(  )						// send to output

	},
	update: async () => {

		// nothing to do here

	},
	draw: () => {

		// P 5

		p5.textAlign( p5.CENTER )
		p5.textSize( outputCanvas.height * 0.1 )
		p5.fill( 255 )
		
		const text = (messages.length <= 0) ? 'send a message' : messages[ messages.length - 1 ].message
		p5.text( text, outputCanvas.width/2, outputCanvas.height/2 );



	},
	onMessage: (e) => {
  		window.speechSynthesis.speak( new SpeechSynthesisUtterance( e.message ) );
	}
}
`