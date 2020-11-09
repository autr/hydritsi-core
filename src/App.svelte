<script>

// import * as bodyPix from '@tensorflow-models/body-pix';
// import * as blazeFace from '@tensorflow-models/blazeface';
// import * as faceapi from 'face-api.js';


import { onMount } from 'svelte';
import p5Engine from 'p5';
import CodeEditor from 'svelte-code-editor';
import Prism from 'prismjs';
import Example from './examples/Basic.js';
import Debug from './Debug.svelte';
import Hydritsi from './Hydritsi.svelte';

let debug;


onMount(async () => {
   debug = (window.location.hash == '#debug');

   if (debug) console.log('[Hydritsi 🤖] 👋  using debug...');
   if (!debug) console.log('[Hydritsi 🤖] 👋  not using debug (add #debug to url to test)...');
}); 


function onWindowError( error ) {

  console.log("[Hydritsi 🤖] ❌  window error", error.lineNumber, error.message);
}

</script>
<!-- <svelte:window on:error={onWindowError} /> -->
<!-- <svelte:window on:keydown={onWindowError} /> -->
<main>
  {#if debug}<Debug />{/if}
  <div class="hydritsi">
    <Hydritsi />
  </div>
</main>

<style lang="sass" global>
  .hydritsi
    $bg: rgba(0,0,0,0.95)
    background: linear-gradient(to right, $bg , rgba(0,0,0,0) )
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    z-index: 2
    box-sizing: border-box
</style>