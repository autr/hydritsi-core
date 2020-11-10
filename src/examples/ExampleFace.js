
export default (doc) => `${doc.intro}

// TODO: jazz it up....

{
	name: 'Face Example',
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

				// inputVideo is different size to outputCanvas, so scale...

				const scaleX = outputCanvas.width / inputVideo.videoWidth;
				const scaleY = outputCanvas.height / inputVideo.videoHeight;

				p5.circle( point[0] * scaleX, point[1] * scaleY, 10 );
			})
		})

	}
}
`