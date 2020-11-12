
export default (doc) => `${doc.intro}
{
	name: 'Classify Example',
	setup: () => {

		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.s1.init({src: inputVideo })   // create webcam source at "s1"

		synth.src( synth.s1 )
			.scale( 1, -1 )					// mirror
			.add( 
				osc(10,0,1)
					.kaleid(50)
					.modulateScale(
						osc(2,-0.5,2)
					) 
				)
			.diff( synth.src( synth.s0 ) ) 
			.scale( 1, -1 )					// mirror
			.out(  )            

		store.objects = [];
	},
	update: async () => {

		store.objects = await helper.getClassifications( inputVideo )
		if (store.objects.length <= 0) store.objects.push( {className: 'loading', probability: 1 })
	},
	draw: () => {

		store.objects.sort( (a, b) => b.probability - a.probability )

		
		p5.textSize( outputCanvas.height * 0.1 )
		p5.textAlign( p5.CENTER )
		p5.textFont('monospace')
		p5.angleMode( p5.DEGREES )
		
		if (store.objects.length > 0) {

			p5.translate( outputCanvas.width/2, outputCanvas.height/2 )
			p5.push()
			p5.rotate( (new Date() * 0.01) % 360 )
			p5.push();
			const text = store.objects[0].className
			const len = text.length

			for ( let i = 0; i < len; i++ ) {

				const t = text[i]
				
				p5.push()
				p5.translate( outputCanvas.height * 0.4, 0 )
				p5.push()
				p5.rotate( 90 )
				p5.fill( 255 )
				p5.text( t , 0, 0 )
				p5.pop()
				p5.pop()
				p5.rotate( 360 / len )
			}
			
			
			p5.pop()
			p5.pop()
			p5.fill( 255 )
			p5.textSize( outputCanvas.height * 0.07 )
			p5.text( text.replace(/ /g, "\\n"), 0, outputCanvas.height * -0.15 )
		}
	}
}
`