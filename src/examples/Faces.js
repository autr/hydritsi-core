
export default (doc) => `${doc.intro}

{
	name: 'Face Example',
	config: {
		autoScale: true
	},
	setup: () => {

		// H Y D R A

		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.s1.init({src: inputVideo })   // create webcam source at "s1"

		synth
			.osc(20, 0.1, 0.8)                // create video synth
			.diff( synth.src( synth.s1 ) )    // blend with webcam
			.diff( synth.src( synth.s0 ) )    // blend with p5
			.out(  )                          // send to output

		store.myFace = [];

	},
	update: async () => {

		// M A C H I N E L E A R N I N G

		// do data tasks here...

		store.myFace = await helper.getFastFace( inputVideo );

		// helpers are asyncronous functions - ie. wait for some data

	},
	draw: () => {

		// P 5


		p5.fill(255);

		store.myFace.forEach( face => {
			face.landmarks.forEach( point => {
				p5.circle( point[0], point[1], 10 );
			})
		})

	}
}
`