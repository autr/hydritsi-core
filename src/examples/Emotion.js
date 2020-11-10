
export default `
// I N T R O D U C T I O N

/*
---------------------------------------------
inputVideo      the incoming <video> element
outputCanvas    the outgoing <canvas> element
synth           HydraSynth engine
p5              P5 engine
streams         array of incoming streams
messages        array of incoming messages
store           blank object for storing vars
helper          object of helper functions
sketch          the object below (ie. this)
---------------------------------------------
*/

name: 'Basic Example',
config: {
  autoScale: true
},
setup: () => {

  // H Y D R A

  synth.s0.init({src: p5.canvas })    // create p5 source at "s0"
  synth.s1.init({src: inputVideo })   // create webcam source at "s1"

  store.emotions = []

},
update: async () => {

  // M A C H I N E L E A R N I N G

  // do data tasks here...

  store.emotions = await helper.getEmotions( inputVideo )

  // helpers are asyncronous functions - ie. wait for some data

},
draw: () => {

  // P 5

  p5.fill(255)
  p5.textSize(128)
  p5.textAlign( p5.CENTER )
  p5.text('😜😂😍', p5.canvas.width/2, p5.canvas.height/2)

  // H Y D R A
  
  synth
    .osc( Math.sin(new Date() * 0.001) * 40 , 0.1, 0.8)                // create video synth
    .diff( synth.src( synth.s1 ) )    // blend with webcam
    .diff( synth.src( synth.s0 ) )    // blend with p5
    .out(  )   

}
`