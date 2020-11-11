<script>

// import * as bodyPix from '@tensorflow-models/body-pix';
// import * as blazeFace from '@tensorflow-models/blazeface';
// import * as faceapi from 'face-api.js';


import { onMount } from 'svelte';
import p5Engine from 'p5';
import CodeEditor from 'svelte-code-editor';
import Prism from 'prismjs';
import Debug from './Debug.svelte';
import Hydritsi from './Hydritsi.svelte';

let debug;
let room;


onMount(async () => {
   debug = (window.location.hash.length > 2);
   if (window.location.pathname.length > 2 || debug) room = true;

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
  {#if room}
    <div class="hydritsi">
      <Hydritsi />
    </div>
  {/if}
</main>

<style lang="sass" global>
  
  // hide jitsi extras....

  .watermark.leftwatermark, .invite-more-container
    display: none!important

  // app-specific styles...

  .hydritsi
    $bg: rgba(0,0,0,0.95)
    background: linear-gradient(to right, $bg , rgba(0,0,0,0) )!important
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    z-index: 2
    box-sizing: border-box
  .hydritsi-blur-button
    position: absolute
    left: -9999px
  body, html
    padding: 0
    margin: 0
    .welcome .header .header-text-title
      font-size: 64px
      margin-bottom: 10px
    .welcome .header .header-text-subtitle
      font-weight: normal
      &:after
        content: ""
        display: block
        margin: 0 auto
        margin-top: 20px
        width: 240px
        height: 40px
        background: url('/hydritsi-core/public/vidicon.png')
        background-size: 240px
        mix-blend-mode: lighten
</style>