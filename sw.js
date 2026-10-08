/* Keeps the app shell available without internet. Network first, cache as fallback. */
const CACHE="zapysy-v1";
const FB="https://www.gstatic.com/firebasejs/10.12.2/";
const PRE=["./","icon.png",FB+"firebase-app-compat.js",FB+"firebase-auth-compat.js",FB+"firebase-firestore-compat.js"];
self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(PRE.map(u=>fetch(new Request(u,{mode:u.startsWith("http")?"no-cors":"same-origin"})).then(r=>c.put(u,r))))));
});
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  const own=u.origin===location.origin;
  const ok=own||(u.hostname==="www.gstatic.com"&&u.pathname.startsWith("/firebasejs/"))||u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com";
  if(!ok)return;
  e.respondWith(fetch(r).then(res=>{
    if(res.ok||res.type==="opaque"){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy))}
    return res;
  }).catch(()=>caches.match(r,{ignoreSearch:own}).then(m=>m||Response.error())));
});
