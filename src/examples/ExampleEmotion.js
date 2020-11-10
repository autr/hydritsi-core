
export default (doc) => `${doc.intro}



// TODO: not working yet...

{
	name: 'Emotion Example',
	setup: () => {

		// H Y D R A

		synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
		synth.s1.init({src: inputVideo })   // create webcam source at "s1"

		store.emotions = []
		store.emojis = []
		store.fps = 0
	},
	update: async () => {

		// M A C H I N E L E A R N I N G

		// do data tasks here...

		store.emotions = await helper.getEmotions( inputVideo )

		// helpers are asyncronous functions - ie. wait for some data

		// // M A C H I N E L E A R N I N G

		// // do data tasks here...

		// store.emotions = await helper.getEmotions( inputVideo )

		// store.fps += 1

		// if (store.fps % 30 != 0) return

		// store.emotions.forEach( emote => {

		// 	let face;
		// 	if (emote.emotion == 'angry') face = '😡'
		// 	if (emote.emotion == 'disgusted') face = '🤢'
		// 	if (emote.emotion == 'fear') face = '😨'
		// 	if (emote.emotion == 'sad') face = '☹️'
		// 	if (emote.emotion == 'surprised') face = '😮'
		// 	if (emote.emotion == 'happy') face = '😁'

		// 	let size = emote.value * 5;
		// 	if (emote.emotion == 'happy') size /= 5


		// 	let x = p5.map( Math.random(), -1, 1, 0, p5.canvas.width )
		// 	let y = -20

		// 	let speed = ( Math.random() + 1 ) / 2

		// 	if (size > 0.6) store.emojis.push( { face, size, x, y, speed } )

		// })


		// // helpers are asyncronous functions - ie. wait for some data
	},
	draw: () => {

		// P 5

		p5.fill(255)


		// H Y D R A
		
		synth
			.osc( Math.sin(new Date() * 0.001) * 40 , 0.1, 0.8)                // create video synth
			.diff( synth.src( synth.s1 ) )    // blend with webcam
			.diff( synth.src( synth.s0 ) )    // blend with p5
			.out(  )   

		if ( !store.emotions ) return

		store.emotions.forEach( (emote, i) => {

			let face;
			if (emote.emotion == 'angry') face = '😡'
			if (emote.emotion == 'disgusted') face = '🤢'
			if (emote.emotion == 'fear') face = '😨'
			if (emote.emotion == 'sad') face = '☹️'
			if (emote.emotion == 'surprised') face = '😮'
			if (emote.emotion == 'happy') face = '😁'

			let x = ( p5.canvas.width / 6 ) * i
			let y = p5.canvas.height / 2


			p5.textSize( emote.value * 800 )
			p5.textAlign( p5.CENTER )
			p5.text( face, x, y )

		})


		// // P 5

		// p5.fill(255)

		// for (let i = 0; i < store.emojis.length; i++ ) {
		// 	const emoji = store.emojis[i];

		// 	p5.textSize( emoji.size * 128 )
		// 	// p5.textAlign( p5.CENTER )
		// 	p5.text( emoji.face, emoji.x, emoji.y )

		// 	emoji.y += emoji.speed * 2
		// 	if ( emoji.y > p5.canvas.height ) store.emojis.splice( i, 1 )
		// }

		// // H Y D R A
		
		// synth
		// 	.osc( Math.sin(new Date() * 0.001) * 40 , 0.1, 0.8)                // create video synth
		// 	.diff( synth.src( synth.s1 ) )    // blend with webcam
		// 	.diff( synth.src( synth.s0 ) )    // blend with p5
		// 	.out(  )   


	}}
`







// // https://www.auduno.com/clmtrackr/examples/clm_emotiondetection.html
// var vid = document.getElementById('videoel');
// var vid_width = vid.width;
// var vid_height = vid.height;
// var overlay = document.getElementById('overlay');
// var overlayCC = overlay.getContext('2d');

// function adjustVideoProportions() {
//   // resize overlay and video if proportions are different
//   // keep same height, just change width
//   var proportion = vid.videoWidth/vid.videoHeight;
//   vid_width = Math.round(vid_height * proportion);
//   vid.width = vid_width;
//   overlay.width = vid_width;
// }

// function gumSuccess( stream ) {
//   // add camera stream if getUserMedia succeeded
//   if ("srcObject" in vid) {
//     vid.srcObject = stream;
//   } else {
//     vid.src = (window.URL && window.URL.createObjectURL(stream));
//   }
//   vid.onloadedmetadata = function() {
//     adjustVideoProportions();
//     vid.play();
//   }
//   vid.onresize = function() {
//     adjustVideoProportions();
//     if (trackingStarted) {
//       ctrack.stop();
//       ctrack.reset();
//       ctrack.start(vid);
//     }
//   }
// }

// function gumFail() {
//   alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
// }

// navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
// window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

// // check for camerasupport
// if (navigator.mediaDevices) {
//   navigator.mediaDevices.getUserMedia({video : true}).then(gumSuccess).catch(gumFail);
// } else if (navigator.getUserMedia) {
//   navigator.getUserMedia({video : true}, gumSuccess, gumFail);
// } else {
//   alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
// }

// /*********** setup of emotion detection *************/
// // set eigenvector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows
// pModel.shapeModel.nonRegularizedVectors.push(9);
// pModel.shapeModel.nonRegularizedVectors.push(11);

// var ctrack = new clm.tracker({useWebGL : true});
// ctrack.init(pModel);
// var trackingStarted = false;

// function startVideo() {
//   // start video
//   vid.play();
//   // start tracking
//   ctrack.start(vid);
//   trackingStarted = true;
//   // start loop to draw face
//   drawLoop();
// }

// function drawLoop() {
//   requestAnimFrame(drawLoop);
//   overlayCC.clearRect(0, 0, vid_width, vid_height);
//   //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
//   if (ctrack.getCurrentPosition()) {
//     if (document.querySelector('#frame').checked) {
//       ctrack.draw(overlay);    
//     }
//   }
//   var cp = ctrack.getCurrentParameters();
//   var er = ec.meanPredict(cp);
//   if (er) {
//     document.querySelector('#console').innerText = er.map(s => JSON.stringify(s)).join('\n');
//   }
// }

// delete emotionModel['angry'];
// delete emotionModel['disgusted'];
// delete emotionModel['fear'];
// delete emotionModel['surprised'];
// var ec = new emotionClassifier();
// ec.init(emotionModel);

// startVideo();