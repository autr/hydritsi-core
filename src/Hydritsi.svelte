<script>

import { onMount } from 'svelte';

import * as tf from '@tensorflow/tfjs-core'
import * as blazeFaceEngine from '@tensorflow-models/blazeface';
import * as faceMeshEngine from '@tensorflow-models/face-landmarks-detection';
import * as classifyEngine from '@tensorflow-models/mobilenet'
import * as cocoSSDEngine from '@tensorflow-models/coco-ssd'
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm'
import * as cpu from '@tensorflow/tfjs-backend-cpu'
import * as webgl from '@tensorflow/tfjs-backend-webgl'


tfjsWasm.setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@latest/dist/tfjs-backend-wasm.wasm');


import p5Engine from 'p5';

import CodeEditor from 'svelte-code-editor';
import System from './System.svelte'


let debounce;
let errorMessage = null;


let system; // ref
let inputVideo, 
    outputCanvas, 
    hydra,
    synth,
    faceapi, 
    streams, 
    messages,
    p5,
    store;

let blazeFace = null;
let isLoadingBlazeFace = false;
let isSetup = false;

let clmEmotionClassifier = null;
let clmTracker = null;

let temp, code = ''

let cocoSSD, isLoadingCocoSSD;
let faceMesh, isLoadingFaceMesh
let classify, isLoadingClassify;

let helper = {
  getFastFace: async ( video ) => {

      if ( !blazeFace && !isLoadingBlazeFace ) {
        isLoadingBlazeFace = true;
        console.log("[Hydritsi 🐙] 🤦‍♀️  loading blaze face...");
        setKonsole('info', 'loading face model');
        await tf.setBackend('wasm')
        blazeFace = await blazeFaceEngine.load()
        setKonsole('success', 'face model loaded');
        console.log("[Hydritsi 🐙] 🤦‍♀️ ✅  blaze face loaded...", blazeFace);
      }
      if (! blazeFace ) return [];


      return await blazeFace.estimateFaces( video, false);
  },
  getClassifications: async( video ) => {

      if ( !classify && !isLoadingClassify ) {
        isLoadingClassify = true;
        console.log("[Hydritsi 🐙] 🌐  loading classifier...");
        setKonsole('info', 'loading classifier');
        await tf.setBackend('wasm')

        classify = await classifyEngine.load({
          version: 1,
          alpha: 0.25
        });
        setKonsole('success', 'classifier loaded');
        console.log("[Hydritsi 🐙] 🌐 ✅  classifier loaded...", classify);
      }
      if (! classify ) return [];
      const data = await classify.classify( video );
      if (data.length > 0) console.log(data);
      return data;
  },
  getFaceMesh: async ( video ) => {

      if ( !faceMesh && !isLoadingFaceMesh ) {
        isLoadingFaceMesh = true;
        console.log("[Hydritsi 🐙] 🌐  loading face mesh...");
        setKonsole('info', 'loading face mesh');
        await tf.setBackend('wasm')

        faceMesh = await faceMeshEngine.load(
          faceMeshEngine.SupportedPackages.mediapipeFacemesh,
            { maxFaces: 1 }
        );

        setKonsole('success', 'face mesh loaded');
        console.log("[Hydritsi 🐙] 🌐 ✅  face mesh loaded...", faceMesh);
      }
      if (! faceMesh ) return [];


      return await faceMesh.estimateFaces({
        input: video,
        returnTensors: false,
        flipHorizontal: false,
        predictIrises: true
      });
  },
  getDetectedObjects: async ( video ) => {

      if ( !cocoSSD && !isLoadingCocoSSD ) {
        isLoadingCocoSSD = true;
        console.log("[Hydritsi 🐙] 🎲  loading coco ssd...");
        setKonsole('info', 'loading coco ssd');
        await tf.setBackend('wasm')
        cocoSSD = await cocoSSDEngine.load({
          base: 'lite_mobilenet_v2'
        })
        setKonsole('success', 'coco ssd loaded');
        console.log("[Hydritsi 🐙] 🎲 ✅  coco ssd loaded...", cocoSSD);
      }
      if (! cocoSSD ) return [];

      const canvas = document.createElement("canvas");
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      const image = new Image()
      image.src = canvas.toDataURL();

      return await cocoSSD.detect( image );
  },
  getEmotions: async( video ) => {

    if (!clmEmotionClassifier && !clmTracker) {

      console.log("[Hydritsi 🐙] 🤩  loading clmtracker emotions...");

      clmTracker = new clm.tracker({useWebGL : true});
      clmTracker.init( pModel );

      // set eigenvector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows

      pModel.shapeModel.nonRegularizedVectors.push(9);
      pModel.shapeModel.nonRegularizedVectors.push(11);

      delete emotionModel['angry'];
      delete emotionModel['disgusted'];
      delete emotionModel['fear'];
      delete emotionModel['surprised'];

      clmEmotionClassifier = new emotionClassifier();
      clmEmotionClassifier.init(emotionModel);

      clmTracker.start( video );
    }

    const found = clmTracker.getCurrentPosition()
    const params = clmTracker.getCurrentParameters();
    const predict = clmEmotionClassifier.meanPredict(params);
    return predict;

  }
}

let config = {
    autoScale: true
}

let lastX, lastY, timestamp, dt = 0;

onMount(async () => {

  console.log('[Hydritsi 🐙] mounted!');

  window.limpit = limpit;
  window.config = config;

  window.inputVideo = inputVideo = null;
  window.outputCanvas = outputCanvas = null;
  window.hydra = hydra = null;
  window.synth = synth = null;
  window.faceapi = faceapi = faceapi;
  window.streams = streams = [];
  window.messages = messages = [];
  window.store = store = {};

  console.log('[Hydritsi 🐙] reloading sketches...', system);

  system.loadLocalStorage()

  setKonsole('success', 'hydritsi mounted' )


  console.log('[Hydritsi 🐙] creating p5...');
  window.p5 = p5 = new p5Engine( setupP5 )

  system.loadSketch( 0 )
}); 


let konsole = {};

function setKonsole( type, message ) {
  const d = new Date();
  const zero = (i) => (i < 10) ? "0" + i : i;
  konsole = {
    type,
    message,
    time: `${zero(d.getHours())}:${zero(d.getMinutes())}:${zero(d.getSeconds())}`,
    bright: true
  }

  setTimeout( () => {
    konsole.bright = false
  }, 10)
}

const limpit  = {

  update: async function( inputVideo, outputCanvas  ) {

      // if (!store.faceApiLoaded) {

          // faceapi.nets.ssdMobilenetv1.isLoaded
          // faceapi.nets.faceLandmark68Net.isLoaded
          // faceapi.nets.faceExpressionNet.isLoaded

          // await faceapi.nets.ssdMobilenetv1.load('/static/models/')
          // await faceapi.loadFaceLandmarkModel('/static/models/')
          // await faceapi.loadFaceExpressionModel('/static/models/')
          // store.faceApiLoaded = true;

          // console.log('[Hydritsi 🐙] face api loaded!');
      // }

    // update...
    if (!isSetup) return;
    try {
        await window.sketch.update();
        lastUpdateError = false;
    } catch(err) {
        if (!lastUpdateError) {
          console.log("[Hydritsi 🐙] 🔧 ❌  couldn't run sketch update...", err.message);
          lastUpdateError = true;
          setKonsole('error', err.message);
        }
    }  

  },


  disable: function( e ) {

      console.log('[Hydritsi 🐙] ✋  disabling hydritsi...', e);

      window.inputVideo = inputVideo = null;
      window.outputCanvas = outputCanvas = null;
      window.hydra = hydra = null;
      setKonsole('success', 'disabled hydritsi...');
      isSetup = false;
  },
  enable: function( e ) {


      console.log('[Hydritsi 🐙] 👽  enabling hydritsi...', e);

      window.inputVideo = inputVideo = e.inputVideo;
      window.outputCanvas = outputCanvas = e.outputCanvas;

      if (!hydra) {
          window.hydra = hydra = new Hydra({ canvas: e.outputCanvas, autoLoop: false });
          window.hydra.setResolution(outputCanvas.width, outputCanvas.height)
          window.synth = synth = hydra.synth;
          setTimeout( evaluate, 10);
      }

      setKonsole('success', 'enabled hydritsi...');

  },
  attach: function(e) {
      console.log('[Hydritsi 🐙] 🎬  attaching video...', e);
      streams.push( e );
      try {
          const refresh = window.sketch.onAttach( e );
          console.log("[Hydritsi 🐙] 📺 ✅  attached processed", e);
          if (refresh) evaluate();
      } catch(err) {
          console.log("[Hydritsi 🐙] 🎬 📍  sketch attach function not run (optional)...", err.message, e);
      }  
  },
  detach: function(e) {
      console.log('[Hydritsi 🐙] 📺  detaching video...', e);
      streams = streams.filter( s => s.videoTrack.participantId != e.videoTrack.participantId );
      try {
          const refresh = window.sketch.onDetach( e );
          console.log("[Hydritsi 🐙] 📺 ✅  detached processed", e);
          if (refresh) evaluate();
      } catch(err) {
          console.log("[Hydritsi 🐙] 📺 📍  sketch detach function not run (optional)...", err.message, e);
      }  
  },
  message: function(e) {
      console.log('[Hydritsi 🐙] 💬  received message...', e);
      messages.push( e );
      try {
          const refresh = window.sketch.onMessage( e );
          console.log("[Hydritsi 🐙] 📺 ✅  message processed", e);
          if (refresh) evaluate();
      } catch(err) {
          console.log("[Hydritsi 🐙] 💬 📍  sketch message function not run (optional)...", err.message, e);
      }  

  }
}



function evaluate( e ) {
  if (e) code = e.detail
  clearTimeout( debounce );
  debounce = setTimeout( () => { 
      console.log('[Hydritsi 🐙] 🔧  evaluating sketch code...');
      temp = code;
      let success = false;
      try {

          const c = `window.sketch = ${temp};`;
          console.log('[Hydritsi 🐙] 🔧 👶  evaluating new sketch code...');
          eval( c);
          success = true;
          errorMessage = false;
          setKonsole('success', 'sketch successfully reloaded');
          console.log('[Hydritsi 🐙] 🔧 👶 ✅  successfully updated sketch code...');

      } catch( err) {

          setKonsole('error', err.message);
          console.log('.........', err, err.stack)
          console.log("[Hydritsi 🐙] 🔧 👶 ❌  couldn't eval new sketch code...", err.message, '\n', err.stack);
          try {
              const c = `window.sketch = ${code};`;
              console.log('[Hydritsi 🐙] 🔧 👵  evaluating old sketch code...');

              eval( c );
              success = true;
              errorMessage = false;
              console.log('[Hydritsi 🐙] 🔧 👵 ✅  fell back to original sketch code...');

          } catch( err2 ) {
            console.log("[Hydritsi 🐙] 🔧 👵 ❌  couldn't eval old sketch code...", err.message, '\n', err.stack);
            errorMessage = err.message;
          }
      }

    if (success) {

      lastP5DrawError = false;
      lastP5HydraError = false;
      lastUpdateError = false;

      try {
        console.log('[Hydritsi 🐙] 🔧  running sketch setup...');
        window.sketch.setup();
        isSetup = true;
      } catch( err ) {
        console.log("[Hydritsi 🐙] 🔧 ❌  couln't run sketch setup:", err.message, err.stack);
        errorMessage = err.message;
        setKonsole('error', err.message);
      }
    }
  }, 750);


}


let lastP5DrawError, lastP5HydraError, lastUpdateError;

function setupP5( p ) {

      p.setup = () => { 

          console.log('[Hydritsi 🐙] 🚨  setting up p5...', window.sketch);
          p5.createCanvas(640, 360);

          // this.loadTensorFlow();


      }
      p.draw = () => { 


          const t = Date.now();
          dt = t - timestamp;

          // only draw P5 if outputCanvas from JitsiBlurEffect.js has been inited...


          if (outputCanvas) {

              p5.clear();
              p5.background(0);

              // scale everything to outputCanvas:
              // makes things simpler when drawing video tracks, or CV outputs...

              if (config.autoScale) {
                  let x, y;
                  x = p5.width / outputCanvas.width;
                  y = p5.height / outputCanvas.height;
                  if ( x != lastX || y != lastY ) {
                      console.log("[Hydritsi 🐙] 🚨  p5 autoscaling to:", x, y);
                      p5.scale( x, y );
                      lastX = x;
                      lastY = y;
                  }
              }

              // EZ-access draw...
              if (isSetup) {
                try {
                    window.sketch.draw( )
                    lastP5DrawError = false;
                } catch( err ) {
                  if (!lastP5DrawError) {
                    console.log("[Hydritsi 🐙] 🔧 ❌  couldn't run sketch draw function...", err.message, window.sketch);
                    setKonsole('error', err.message);
                    lastP5DrawError = true;
                  }
                }

              }

              if (hydra) {

                  try {
                      hydra.tick( dt  )
                      lastP5HydraError = false;
                  } catch( err ) {
                    if (!lastP5HydraError) {
                      console.log("[Hydritsi 🐙] 🚨 ❌  couldn't render hydra...", err.message);
                      lastP5HydraError = true;
                      setKonsole('error', err.message);
                    }
                  }
              }
          }

          timestamp = t;
      }
}

function onKonsole(e) {
  setKonsole( e.detail.type, e.detail.message );
}


</script>
<header class="header">
  <div class="actions">
    <System bind:this={system} bind:temp={temp} bind:code={code} on:konsole={onKonsole}  />
    <a href="https://github.com/autr/hydritsi-core" target="_blank" class="mr04">about</a>
    <a href="https://github.com/autr/hydritsi-core" target="_blank" class="mr04">learn</a>
  </div>
  <div class="konsole {konsole.type} " class:bright={konsole.bright}>[{konsole.time}] {konsole.message}</div>
</header>
<div class="code-wrapper">
  <CodeEditor code={code} loc={true} autofocus={false} lang="javascript" on:change={evaluate} />
</div>

<style lang="sass" global>

@import '../sassis/sassis.sass' 

$header: 80px
html
  .p5Canvas
    display: none
  .hydritsi
    +terminal-theme()

    flex-direction: column
    color: white
    .konsole
      transition: 0.4s ease color
      &.bright
        transition-duration: 0s 
    *
      box-sizing: border-box
    .header
      display: flex
      flex-direction: column
      flex-basis: $header
      flex-shrink: 0
      min-height: $header
      padding: 10px
      .actions, .konsole
        flex-basis: 0
        flex-grow: 1
        display: flex
        align-items: center
      .actions
          display: flex
          flex-direction: row
    .code-wrapper
      flex-grow: 0
      flex-shrink: 0
      flex-basis: calc( 100vh - #{$header})
      max-height: calc( 100vh - #{$header})
      overflow: auto
      .codejar-wrap
        margin-bottom: 120px
        .codejar-linenumbers
          background: none!important
        code[class*="language-"], pre[class*="language-"]
          background: transparent
</style>