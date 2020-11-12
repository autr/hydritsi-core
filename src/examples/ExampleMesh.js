
export default (doc) => `${doc.intro}

{
	name: 'Mesh Example',
	setup: () => {

		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.src( synth.s0 ).out()    

		store.myFace = []
	},
	update: async () => {

		store.myFace = await helper.getFaceMesh( inputVideo )
	},
	draw: () => {

		// inputVideo is different size to outputCanvas, so scale (and flip)...

		const cw = outputCanvas.width
		const ch = outputCanvas.height

		const sw = outputCanvas.width / inputVideo.videoWidth
		const sh = outputCanvas.height / inputVideo.videoHeight

		const scaleX = ( value ) => value * sw
		const scaleY = ( value ) => value * sh

		if (store.myFace.length <= 0) {
			p5.text('loading face mesh model...', 40, 40 )
		}

		store.myFace.forEach( f => {
			Object.keys( f.annotations ).forEach( k => {
				const arr = f.annotations[k]

				arr.forEach( (p, i) => {
					let x = scaleX( p[0] )
					let y = scaleY( p[1] )

					if (i > 0) {

						let ox = scaleX( arr[i-1][0] )
						let oy = scaleY( arr[i-1][1] )

						p5.strokeWeight( 2 )
						p5.stroke( 255 )
						p5.line( x, y, ox, oy )
					}
				})
			})
		})
	}
}
`