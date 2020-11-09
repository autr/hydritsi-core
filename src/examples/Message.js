
export default `
// I N T R O D U C T I O N

/*
---------------------------------------------
inputVideo      the incoming <video> element
outputCanvas    the outgoing <canvas> element
synth           HydraSynth engine
p5              P5 engine
streams         array of incoming streams
messages        array of messages
helper          object of helper functions
---------------------------------------------
*/

name: 'Message Example',
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

},
draw: () => {

  // P 5

  p5.textSize(24)

  messages.forEach( (m, i) => {

    const speed = 0.001
    const offset = p5.map( Math.sin( new Date() * speed ), -1, 1, -80, 80 )
    const w = 20
    const h = ( p5.canvas.height/2 ) + offset

    p5.fill( 255 )
    p5.text( m.message )
  })


},
onMessage: (e) => {
  synth.osc( Math.random() ).out()
},
update: () => {
}
`