
export default `


// p5
// hydra
// streams
// participants
// tensorflow

// setup function and hydra here...

window.setup = () => {

	hydra.s0.init( {src: p5.canvas })
	hydra.src( hydra.s0 ).out();
	hydra.s1.init( { src: cc.me } );
	hydra.osc(20, 0.1, 0.8).diff( hydra.src( hydra.s0 ) ).diff( hydra.src( hydra.s1 ) ).out(  );
	//hydra.src( hydra.o1 ).out(s0);
	// s0.init( { src: cc.p5 })
	// osc(20, 0.1, 0.8).blend(o1).out(o2)
	// s0.init( { src: cc.me, dynamic: true })
	// //s1.init( { src: cc.p5.canvas, dynamic: true })
	// src( s0 ).scale(0.8,0.8).diff(o2).out(o1);
}

// perform update cycles here...

window.onMessage = (e) => {
	console.log('MESSAGE>>>>', e);
	return;
	var msg = new SpeechSynthesisUtterance(e.message);
	window.speechSynthesis.speak(msg);
}

window.update = async () => {
	if (cc.me) cc.faces = await cc.blazeFace.estimateFaces( cc.me, false);


	// const options = new faceapi.SsdMobilenetv1Options( { 0.5 } );
	// // const results = await faceapi.detectAllFaces( cc.me, options)
	// // .withFaceLandmarks()
	// // .withFaceExpressions();

	// console.log(options);
}

window.draw = () => {

	p5.noStroke();

	p5.background(Math.random() * 20,0,Math.random() * 25);

	if (cc.me !== undefined) {
		p5.fill(255)
		// p5.canvas.getContext('2d').drawImage( cc.me, 0,0)
	}

	if (cc.faces) {
		cc.faces.forEach( face => {
			p5.stroke(2);
			p5.noFill();
			const x = face.topLeft[0];
			const y = face.topLeft[1];
			const w = face.bottomRight[0] - x;
			const h = face.bottomRight[1] - y;
			p5.rect( x, y, w, h );
			p5.noStroke();
			face.landmarks.forEach( dot => {
				p5.fill( Math.random() * 255,Math.random() * 255,Math.random() * 255 )
				p5.ellipse( dot[0], dot[1], 5, 5 )
			})
		});
	}

	if (cc.body) {
		if (cc.body.allPoses) {
			cc.body.allPoses.forEach( pose => {
				pose.keypoints.forEach( part => {
					if (part.score > 0.4) {
						p5.fill( Math.random() * 255 )
						p5.ellipse( part.position.x, part.position.y, 20, 20 )
					}
				})
			});
		}
	}
}


`