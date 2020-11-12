
export default (doc) => `${doc.intro}

// TODO: jazz it up....

{
	name: 'Face Example',
	setup: () => {

		// H Y D R A

		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.s1.init({src: inputVideo })   // create webcam source at "s1"

		synth
			.src( synth.s1 )					// webcam
			.blend( osc( 1, 2, 3, 4 ) )			// synth
			.diff( synth.src( synth.s0 ) )		// p5
			.out(  )							// send to output

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


		const cw = outputCanvas.width
		const ch = outputCanvas.height

		const sw = outputCanvas.width / inputVideo.videoWidth
		const sh = outputCanvas.height / inputVideo.videoHeight

		// inputVideo is different size to outputCanvas, so scale (and flip)...

		const scaleX = ( value ) => value * sw
		const scaleY = ( value ) => value * sh

		store.myFace.forEach( face => {

			// draw rectangle...

			let tlx = scaleX( face.topLeft[0] )
			let tly = scaleY( face.topLeft[1] )
			let brx = scaleX( face.bottomRight[0] )
			let bry = scaleY( face.bottomRight[1] )

			let w = brx - tlx
			let h = bry - tly

			p5.fill( 255, 0, 0 )
			p5.rect( tlx, tly, w, h )

			p5.stroke( 0, 255, 255 )
			p5.strokeWeight( 4 )

			p5.line( 0, 0, tlx, tly )
			p5.line( cw, 0, brx, tly )
			p5.line( cw, ch, brx, bry )
			p5.line( 0, ch, tlx, bry )

			p5.fill( 0, 0, 255 )
			p5.strokeWeight( 0 )

			face.landmarks.forEach( point => {


				let x = scaleX( point[0] )
				let y = scaleY( point[1] )

				p5.circle( x, y, ch * 0.1 )

			})
		})

	}
}
`