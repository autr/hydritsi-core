<script>

import { onMount, createEventDispatcher } from 'svelte';

export let temp;
export let code;


// examples

import Data from './examples/Data.js'
import Basic from './examples/ExampleBasic.js';
import Emotion from './examples/ExampleEmotion.js';
import Face from './examples/ExampleFace.js';
import Mesh from './examples/ExampleMesh.js';
import Message from './examples/ExampleMessage.js';
import Multi from './examples/ExampleMulti.js';
import Synth from './examples/ExampleSynth.js';
import Classify from './examples/ExampleClassify.js';
import Three from './examples/ExampleThree.js';

const dispatch = createEventDispatcher();

let sketches = []
let sketchIndex

let examples = [
  Basic( Data ),
  Synth( Data ),
  // Multi( Data ),
  Face( Data ),
  Mesh( Data ),
  Message( Data ),
  // Emotion( Data ),
  Classify( Data )
  // Three( Data )
]

$: currentSketch = sketches[sketchIndex] || {}
$: changesMade = (currentSketch) ? currentSketch.code != code : false


onMount(async () => {
  console.log('[Hydritsi 💿] ✅  mounted System...');
})

export function initLoadSketch() {

  console.log("[Hydritsi 💿] #️⃣  loading sketch from hash...");
  try {
    const n = decodeURI(window.location.hash).substring(1)
    const found = sketches.filter( s => s.name == n )[0]
    const idx = sketches.indexOf(found)
    if (found) {
      console.log("[Hydritsi 💿] #️⃣ ✅  loading hash sketch...", n);
      loadSketch( idx )
    } else {
      console.log("[Hydritsi 💿] #️⃣ ❌  not found, reverting to 0...", n, idx);
      loadSketch(0);
    }
  } catch( err ) {
    console.log("[Hydritsi 💿] #️⃣ ❌  error parsing hash...", err.message);
    loadSketch(0);
  }
}

export function loadSketch( i ) {
  console.log("[Hydritsi 💿]  loading sketch at index...", i);
  sketchIndex = i
  temp = code = sketches[sketchIndex].code
  window.location.hash = sketches[sketchIndex].name
  try {
	  console.log("[Hydritsi 💿] ✅  sketch loaded...");
	  dispatch( 'konsole', { type: 'info', message: `${sketches[sketchIndex].name} loaded` })
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

  a.forEach( (c, i) => {

    try {
      const sketch = parseSketch( c )
      const name = sketch.name

      sketches.push( {
        name,
        code: c
      })
      idx += 1
    } catch( err ) {
      skipped += 1
    }
  })

  console.log(`[Hydritsi 💿] 🗃 ✅  loaded ${ sketches.length } sketches, skipped ${skipped}...`);
  console.log('[Hydritsi 💿] 🗃 ✅  sketches:', JSON.stringify( sketches.map( s => s.name ), null, 2));

}

function parseSketch( c, info ) {
  console.log("[Hydritsi 💿] 📛  parsing sketch...", (info) ? info : '' );
  try {
    eval( `window.parsing = ${c}`)
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
    dispatch( 'change', code )
  } else {
    console.log("[Hydritsi 💿] 🚃 🛑  select cancelled to...", currentSketch.name);
    e.target.value = currentSketch.name
  }
}

function onSaveNew() {
  console.log("[Hydritsi 💿] 🆕  saving new...", currentSketch);
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

function onExport() {
  const flatten = sketches.map( s => s.code );
  const str = JSON.stringify( flatten.splice( examples.length ), null, 2 );
  let blob = new Blob([str], { type: 'text/json' });

  let a = document.createElement('a');
  a.download = 'hydritsi-sketches.json';
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}

function onImportReceived( e ) {

  console.log("[Hydritsi 💿] 🤞  importing..."); 
  try {
    let count = 0;
    let arr = JSON.parse( e.target.result );

    for (let i = 0; i < arr.length; i++) {
      let c = arr[i];
      const sketch = parseSketch(c, 'from import');
      let name = sketch.name;
      const old = name;
      while ( sketches.find( s => {
        return s.name == name;
      }) != undefined) {
        name += ' Copy';
      }
      c = c.replace("'"+old+"'", "'"+name+"'").replace('"'+old+'"', "'"+name+"'");
      console.log("[Hydritsi 💿] 🤞 ✅  success importing...", old, '->', name);
      sketches.push( { code: c, name } );
      count += 1;
    }

    console.log(`[Hydritsi 💿] 🤞 ✅  ${count} sketches imported...`, e.target, sketches);

    saveLocalStorage();
    loadLocalStorage();

    file.value = ''

  } catch( err ) {
    console.log("[Hydritsi 💿] 🤞 ❌  error importing...", err.message, e.target.result);

  }
}

let file;

function onImport( e ) {
  fileActive = false;
  const files = e.target.files;
  const file = files[0];           
  const reader = new FileReader();
  reader.onload = onImportReceived;
  reader.readAsText(file)
}

function onDelete() {
  console.log("[Hydritsi 💿] 🗑  deleting...", currentSketch.name);

  const idx = sketches.indexOf(currentSketch);
  if (idx != -1) {
    if (confirm(`Delete "${currentSketch.name}"?`)) {
      sketches.splice( idx, 1 );
      loadSketch( idx - 1 );
      saveLocalStorage();
      dispatch( 'change', code )
    }
  }

}

function onSave() {
  console.log("[Hydritsi 💿] 💾  saving...", currentSketch.name);
  try {
    currentSketch.name = parseSketch( currentSketch.code ).name;
    currentSketch.code = code;
    console.log("[Hydritsi 💿] 💾 ✅  saved...", currentSketch.name);
  } catch( err ) {
    console.log("[Hydritsi 💿] 💾 ❌  error saving...", err.message);
  }
}

function saveLocalStorage() {

  const flatten = sketches.map( s => s.code );
  const str = JSON.stringify( flatten.splice( examples.length ) );
  console.log("[Hydritsi 💿] 🗃  saving local storage...");
  window.localStorage.setItem('hydritsi', str );
}

let fileActive = false;

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
<button 
  class="mr04 mb0 bright" 
  disabled={sketchIndex < examples.length || !changesMade}
  on:click={onSave}>
  save
</button>
<button 
  class="mr04 mb0 bright" 
  on:click={onSaveNew}>
  save new
</button>
<button 
  class="mr04 mb0 bright" 
  on:click={onDelete} 
  disabled={sketchIndex < examples.length}>
  delete
</button>
<button 
  class:filled={ fileActive }
  class="mr04 mb0 relative">
  import
  <input 
    on:mousedown={ e => fileActive = true }
    on:blur={ e => fileActive = false }
    class="fill invisible"
    type="file" 
    bind:this={file}
    enctype="multipart/form-data"  
    on:change={onImport}/>
</button>
<button 
  class="mr04 mb0" 
  on:click={onExport}>
  export
</button>