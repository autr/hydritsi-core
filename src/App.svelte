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
let active;


onMount(async () => {
   debug = (window.location.search == '?debug=1');
   if (window.location.pathname.length > 1 || debug) active = true;

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
  {#if active}
    <div class="hydritsi">
      <Hydritsi />
    </div>
  {/if}
</main>

<style lang="sass" global>
  
  // hide jitsi extras....
  html, body
    background: black
    *
      filter: none!important // goddamn css effects slowing tings down...
  #react
    *
      // background: none!important
      animation: none!important
      transition: none!important
      // border-radius: 0!important
      // font-family: monospace!important
      // font-size: 12px!important
    // .new-toolbox
    //   bottom: 0!important
  .action-btn, .welcome .welcome-page-button
    background: #3600ff!important
    border: 1px solid #00c1ff!important
    font-weight: bold!important
    font-family: monospace!important
  .welcome
    &:after
      content: "created by Autr"
      position: fixed
      bottom: 10px
      left: 0px
      display: block
      text-align: center
      margin: 0 auto
      width: 100%
      font-size: 12px
      font-weight: normal
      font-family: monospace
      color: white
  .videocontainer
    background: black!important
  .watermark.leftwatermark, .invite-more-container, .welcome-footer, .welcome-cards-container
    display: none!important
  .welcome .header
    height: 100vh!important
    .header-text-subtitle
      width: 360px!important
      margin: 32px auto!important
  h1, h2, h3, h4, h5, h6, .title, .header-text-title, .header-text-subtitle
    font-weight: bold!important
    text-shadow: 2px 2px #004bff
  .header-text-title
    text-shadow: 4px 4px #004bff
  .header-text-subtitle
    text-shadow: 2px 2px #ff00dc
  #largeVideoBackgroundContainer
    background: black!important
    filter: none!important
    *
      display: none!important
      filter: none!important
  .filmstrip video, .display-name-on-black video
    opacity: 1!important

  // app-specific styles...

  .hydritsi
    $bg: rgba(0,0,0,0.95)
    background: none!important
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    z-index: 2
    box-sizing: border-box
    font-family: monospace, Courier!important
    &.active
      background: linear-gradient(to right, $bg , rgba(0,0,0,0) 70% )!important
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
        background: url('/static/hydritsi-core/public/vidicon.png')
        background-size: 240px
        mix-blend-mode: lighten
</style>