<script>

  import { onMount, onDestroy } from 'svelte'
  export let style;
  let inputVideo;
  let outputCanvas;
  let streamPtr;

  onDestroy(() => {
    if (!streamPtr) return;
    streamPtr.getTracks().forEach(function(track) {
      console.log('[Hydritsi 🐞] ☠️  destroying stream:', track);
      track.stop();
    });
  });

  function onFrame() {
    window.limpit.update();
    window.requestAnimationFrame( onFrame );
    
  }

  function attach( ){
    console.log('[Hydritsi 🐞] attaching debugger to hydritsi...' );
    limpit.enable( { inputVideo, outputCanvas });
  }

  onMount( async() => {
    console.log('[Hydritsi 🐞] ✅  mounted Debug...')
    outputCanvas.getContext('webgl', {preserveDrawingBuffer: true});

    if (navigator.mediaDevices) {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: {width: 640, height: 360} })
          .then(function (stream) { 
            streamPtr = stream;
            console.log('[Hydritsi 🐞] ✅  successfully opened...', stream.id)
            inputVideo.srcObject = stream;
            inputVideo.onloadedmetadata = function(e) {
              inputVideo.play();

              attach();

            };
          })
          .catch(function (err) {
            console.log('[Hydritsi 🐞] ❌  error opening:', err)
          }); 
      }
    } else {
      alert('SSL is needed for mediaDevices')
    }

    window.requestAnimationFrame( onFrame );

  });
</script>

<style lang="sass">

@import '../sassis/sassis.sass' 
.hydritsi-debugger
  +terminal-theme
  .inputVideo, .outputCanvas, .debugger
    position: fixed
    overflow: hidden
    z-index: 9
  .inputVideo, .outputCanvas
    width: 320px
    height: 180px
  .debugger
    top: 10px
    right: 10px
  .outputCanvas
    top: 300px
    right: 10px
  .inputVideo
    top: 40px
    right: 10px
    video
      object-fit: contain
      height: 100%
      width: 320px
      height: 180px
    svg
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
</style>

<div class="hydritsi-debugger">
  <div class="filled bright debugger">debugger</div>
  <div class="inputVideo" on:click style="{style}" >
    <video bind:this={inputVideo}></video>
  </div>
  <canvas class="outputCanvas" bind:this={outputCanvas} />
</div>