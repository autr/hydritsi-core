
function addScript( path ) {
    console.log('[Hydritsi 💉] 🎁 adding script...', path);
    let script = document.createElement('script');
    script.type = 'application/javascript';
    script.src = path + '?v=' + Math.random();
    script.defer = true;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function addStylesheet( path ) {
    console.log('[Hydritsi 💉] 🎁 adding link...', path);
    let link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    
    // must be set after appending to trigger

    document.getElementsByTagName('head')[0].appendChild(link);
    link.href = path + '?v=' + Math.random(); 
}

try {
	const isJitsi = details.url.indexOf( 'jitsi') != -1 || details.url.indexOf( 'jit.si') != -1;
  	if (details.url.indexOf( '/libs/') != -1 && isJitsi ) {
	    console.log('[Hydritsi 🎺] adding assets...');
	    addStylesheet( chrome.extension.getURL( 'global.css' ) ) 
	    addStylesheet( chrome.extension.getURL( 'build/bundle.css' ) ) 
	    addStylesheet( chrome.extension.getURL( 'build/prismjs/themes/prism.css' ) )
	    addStylesheet( chrome.extension.getURL( 'build/prismjs/themes/prism-okaidia.css' ) ) 
	    addScript( chrome.extension.getURL( 'libs/hydra-synth.1.3.2.js' ) )
	    addScript( chrome.extension.getURL( 'build/bundle.js' ) )
	}
} catch( err ) {
    console.error('[Hydritsi 🎺] ❌ ', err.message );
    throw err;
}
