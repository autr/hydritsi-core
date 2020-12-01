chrome.webRequest.onBeforeRequest.addListener( function (details) {
  const isJitsi = details.url.indexOf( 'jitsi') != -1 || details.url.indexOf( 'jit.si') != -1;
  if (details.url.indexOf( '/libs/') != -1 && isJitsi ) {
    console.log('[Hydritsi 💉] 💌 redirecting url...', details.url);
    const i = details.url.lastIndexOf('/');
    const url = 'jitsi-meet' + details.url.substring( i )
    const redirect = chrome.runtime.getURL(url);
    console.log('[Hydritsi 💉] 💌 ✅  redirected to...', redirect);
    return { redirectUrl: redirect }
  }
}, {
   urls: ["<all_urls>"], 
   types: ["script", "stylesheet"]
}, ["blocking"] )

