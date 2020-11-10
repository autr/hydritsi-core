<script>

import { onMount, createEventDispatcher } from 'svelte';

export let temp;
export let code;


// examples

import template from './examples/Template.js'
import Basic from './examples/Basic.js';
import Emotion from './examples/Emotion.js';
import EmotionTwo from './examples/EmotionTwo.js';
import Faces from './examples/Faces.js';
import Message from './examples/Message.js';

const dispatch = createEventDispatcher();

let sketches = []
let sketchIndex

let examples = [
  Basic( template ),
  Faces( template ),
  Emotion( template ),
  Message( template )
]

$: currentSketch = sketches[sketchIndex] || {}
$: changesMade = (currentSketch) ? currentSketch.code != code : false


onMount(async () => {
  console.log('[Hydritsi 💿] mounted...');
})



export function loadSketch( i ) {
  console.log("[Hydritsi 💿]  loading sketch at index...", i);
  sketchIndex = i
  temp = code = sketches[sketchIndex].code
  try {
	  console.log("[Hydritsi 💿] ✅  sketch loaded, sending code...");
	  dispatch( 'konsole', { type: 'info', message: `${sketches[sketchIndex].name} loaded` })
	  dispatch( 'change', code )
  } catch( err ) {
	  console.log("[Hydritsi 💿] ❌  error loading sketch...", err.message);
	  dispatch( 'konsole', { type: 'error', message: err.message  })
  }
}

export function loadLocalStorage() {

  console.log("[Hydritsi 💿] 🗃  loading sketches from storage...");

  sketches = [];

  let a = [...examples]

  try {
    let s = window.localStorage.getItem('hydritsi');
    if (s) {
      s = JSON.parse( s )
      a = a.concat( s )
    }
  } catch( err ) {
    console.log("[Hydritsi 💿] 🗃 ❌  error in local storage...", err.message);
    return
  }

  let skipped = 0
  let idx = 0

  a.forEach( (code, i) => {

    try {
      const sketch = parseSketch( code, i )
      const name = sketch.name

      sketches.push( {
        name,
        code
      })
      idx += 1
    } catch( err ) {
      skipped += 1
    }
  })

  console.log(`[Hydritsi 💿] 🗃 ✅  loaded ${ sketches.length } sketches, skipped ${skipped}...`, sketches);

}

function parseSketch( code, info ) {
  console.log("[Hydritsi 💿] 📛  parsing sketch...", info, code);
  try {
    eval( `window.parsing = ${code}`)
    return window.parsing;
  } catch( err ) {
    console.log("[Hydritsi 💿] 📛 ❌  error parsing sketch...", err.message);
    return null
  }
}
function onSelectChange( e ) {

  console.log("[Hydritsi 💿] 🚃  select changed...");

  const b = (changesMade) ? confirm("Lose unsaved changes?") : true

  let idx = -1
  sketches.find( (s, i) => {
    if (e.target.value == s.name) idx = i
  })
  if (b && idx != -1) {
    console.log("[Hydritsi 💿] 🚃 ✅  loading sketch...", idx);
    loadSketch( idx )
  } else {
    console.log("[Hydritsi 💿] 🚃 🛑  select cancelled to...", currentSketch.name);
    e.target.value = currentSketch.name
  }
}

function onSaveNew() {
  console.log("[Hydritsi 💿] 🆕  saving new...");
  const sketch = parseSketch( code )
  let name = sketch.name
  const old = name

  while ( sketches.find( s => {
    return s.name == name;
  }) != undefined) {
    name += ' Copy';
  }

  temp = code = code.replace("'"+old+"'", "'"+name+"'").replace('"'+old+'"', "'"+name+"'");

  sketches.push( {
    name,
    code    
  })
  console.log("[Hydritsi 💿] 🆕 ✅  saved new...", name);

  loadSketch( sketches.length - 1);

  saveLocalStorage();
}

function saveLocalStorage() {

  const flatten = sketches.map( s => s.code );
  const str = JSON.stringify( flatten.splice( examples.length ) );
  console.log("[Hydritsi 💿] 🗃  saving local storage...", flatten);
  window.localStorage.setItem('hydritsi', str );
}

</script>

<!-- <h1>{(currentSketch) ? currentSketch.name : 'loading'}</h1> -->
<div class="select mr04 mb0">
  <select value={currentSketch.name} class="bright outline" on:change={onSelectChange}>
    <option disabled>--- Examples ---</option>
    {#each sketches as sketch, i}
      <option name={sketch.name} value={sketch.name}>
        {sketch.name}{#if changesMade && sketch.name == currentSketch.name}*{/if}
      </option>
      {#if i == examples.length - 1}
        <option disabled>--- Local Storage ---</option>
      {/if}
    {/each}

    {#if examples.length == sketches.length}
      <option disabled>None</option>
    {/if}
  </select>
</div>
<button class="mr04 mb0 bright" disabled={sketchIndex < examples.length}>save</button>
<button class="mr04 mb0 bright" on:click={onSaveNew}>save new</button>
<button class="mr04 mb0 bright" disabled={sketchIndex < examples.length}>delete</button>
<button class="mr04 mb0" >import</button>
<button class="mr04 mb0" >export</button>