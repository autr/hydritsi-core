
export default (doc) => `${doc.intro}
// TODO, example: how to use Hydra responsively to incoming data

{
	name: 'Synth Example',
	setup: () => {

		synth
			.osc( 10, 0.1, 2 )
			.modulate( 
				osc( 10, 0.1, 0 )
					.rotate(15) 
			)
			.add( 
				osc( 6, -0.1 )
					.rotate( 90 ) 
			)
			.colorama( ({time}) => Math.sin(time * 0.6) * 0.5 + 1 )
			.out()
	},
	update: async () => {
		// nothing to do here
	},
	draw: () => {
		// nothing to do here
	}
}
`