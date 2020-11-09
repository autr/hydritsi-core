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


  function attach( ){
    console.log('[Hydritsi 🐞]  attaching to hydritsi...', limpit);
    limpit.enable( { inputVideo, outputCanvas });
  }

  onMount( async() => {
    console.log('[Hydritsi 🐞]  mounting...')
    outputCanvas.getContext('webgl', {preserveDrawingBuffer: true});

    if (navigator.mediaDevices) {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: {width: 480, height: 320} })
          .then(function (stream) { 
            streamPtr = stream;
            console.log('[Hydritsi 🐞] ✅  successfully opened', stream)
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

  });
</script>

<style lang="sass">
.inputVideo, .outputCanvas
  position: fixed
  overflow: hidden
  width: 320px
  z-index: 9
  height: 240px
.outputCanvas
  top: 0px
  right: 320px
.inputVideo
  top: 0px
  right: 0px
  video
    object-fit: contain
    height: 100%
    width: 320px
    height: 240px
  svg
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
</style>

<div class="inputVideo" on:click style="{style}" >
  <video bind:this={inputVideo}></video>
</div>
<canvas class="outputCanvas" bind:this={outputCanvas} />