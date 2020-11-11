
export default (doc) => `${doc.intro}
// TODO, example: how to get nonsense object classifications (ie. dog, bottle, hat)

{
	name: 'Classify Example',
	setup: () => {
		store.objects = [];
	},
	update: async () => {

		store.objects = await helper.getClassifications( inputVideo )
	},
	draw: () => {
		console.log(store.objects)
	}
}
`