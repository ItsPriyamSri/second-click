(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function s(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(t){if(t.ep)return;t.ep=!0;const a=s(t);fetch(t.href,a)}})();const u="dl-real",p="dl-swap",U=[{id:"dl-decoy-1",label:"DOWNLOAD NOW",shownUrl:"/ads/offer-1",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:"dl-decoy-2",label:"GET THE APP",shownUrl:"/ads/offer-2",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:u,label:"Download DemoApp",shownUrl:"/continue/real",secondUrl:null,hops:[],kind:"real",trapType:"none"},{id:"dl-decoy-3",label:"DOWNLOAD (FAST)",shownUrl:"/ads/offer-3",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:"dl-decoy-4",label:"MIRROR #1",shownUrl:"/ads/offer-4",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:"dl-decoy-5",label:"INSTALLER",shownUrl:"/ads/offer-5",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:"dl-decoy-6",label:"CLICK HERE",shownUrl:"/ads/offer-6",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:"dl-decoy-7",label:"FREE APK",shownUrl:"/ads/offer-7",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"}],P=[{id:p,label:"DemoApp.apk",shownUrl:"/ads/click-here",secondUrl:"/you-clicked-once.txt",hops:["/ads/hop-1","/ads/hop-2","/you-clicked-once.txt"],kind:"two_url",trapType:"second_click"}];function d(e){return e==="field"?U:e==="hops"?P:[]}function R(){return{room:"door",walls:{cookie:!0,notify:!0,signup:!0},personGateDone:!1,highlightedId:null,dimmedIds:[],revealedIds:[],chainVisibleFor:null,explain:null,confirmArmed:!1,confirmOpen:!1}}function T(e){const n=[];e.walls.cookie&&n.push("cookie"),e.walls.notify&&n.push("notify"),e.walls.signup&&n.push("signup"),e.personGateDone||n.push("person_gate");const s=e.room==="field"||e.room==="hops";return{visible:n.length===0&&s,blocking:n}}function w(e,n){return d(e.room).find(s=>s.id===n)}function q(e){return{...e,walls:{cookie:!1,notify:!1,signup:!1}}}function F(e,n){return{...e,walls:{...e.walls,[n]:!1}}}function M(e){return{...e,personGateDone:!0}}function N(e){return e.walls.cookie||e.walls.notify||e.walls.signup||!e.personGateDone?e:{...e,room:"field"}}function H(e){return e.room!=="field"?e:{...e,room:"hops",highlightedId:null,dimmedIds:[],revealedIds:[],chainVisibleFor:null,explain:null,confirmArmed:!1,confirmOpen:!1}}function $(e){return e.room==="field"?{...e,highlightedId:u}:e.room==="hops"?{...e,highlightedId:p}:e}function V(e){if(e.room!=="field")return{...e,dimmedIds:[]};const n=d("field").filter(s=>s.id!==u).map(s=>s.id);return{...e,dimmedIds:n}}function W(e,n){return!w(e,n)||e.revealedIds.includes(n)?e:{...e,revealedIds:[...e.revealedIds,n]}}function G(e,n){const s=w(e,n);return!s||s.hops.length===0?e:{...e,chainVisibleFor:n}}const j={decoy:"This button is an ad, not the file.",second_click:"Shown URL is not the second-click URL.",redirect_chain:"This path hops before the file.",none:"This is the real path. The agent still cannot start the file."};function K(e,n){const s=w(e,n);return s?{...e,explain:{id:n,text:j[s.trapType]}}:e}function I(e){return e.room!=="hops"||!T(e).visible?e:{...e,confirmArmed:!0}}function k(e){return e.confirmArmed?{...e,confirmOpen:!0}:e}function S(e){return{...e,confirmOpen:!1,confirmArmed:!1}}let O=R();const b=new Set;function i(){return O}function l(e){O=e;for(const n of b)n()}function z(e){return b.add(e),()=>{b.delete(e)}}function g(e){return typeof e.id=="string"&&e.id.length>0?e.id:null}function B(){const e=i();return{room:e.room,walls:e.walls,personGateDone:e.personGateDone,highlightedId:e.highlightedId,dimmedIds:e.dimmedIds,revealedIds:e.revealedIds,chainVisibleFor:e.chainVisibleFor,explain:e.explain,confirmArmed:e.confirmArmed,confirmOpen:e.confirmOpen}}function Y(){l(q(i()));const e=i();return{closed:["cookie","notify","signup"],personGateDone:e.personGateDone}}function J(){const e=i();return{room:e.room,clickables:d(e.room)}}function X(e){const n=g(e);if(!n)return{error:"id_required"};const s=i(),o=d(s.room).find(t=>t.id===n);return o?(l(W(s,n)),{id:n,shownUrl:o.shownUrl,secondUrl:o.secondUrl,revealed:!0}):{error:"unknown_id"}}function Q(e){const n=g(e);if(!n)return{error:"id_required"};const s=i(),o=d(s.room).find(t=>t.id===n);return o?o.hops.length===0?{error:"no_hops"}:(l(G(s,n)),{id:n,hops:o.hops,shown:!0}):{error:"unknown_id"}}function Z(){return l($(i())),{highlightedId:i().highlightedId}}function ee(){return l(V(i())),{dimmedIds:i().dimmedIds}}function ne(e){const n=g(e);if(!n)return{error:"id_required"};const s=i();return d(s.room).find(t=>t.id===n)?(l(K(s,n)),i().explain):{error:"unknown_id"}}function te(){return l(I(i())),i().confirmArmed?{confirmArmed:!0,confirmOpen:!1,message:"Human must confirm. The agent cannot start the file."}:{error:"not_ready",confirmArmed:!1}}function se(){return T(i())}let C={count:-1,text:"Site tools: waiting for document.modelContext…"};function ie(){return C}function A(e){C=e}function oe(e){if(e==null)return{};if(typeof e=="string"){try{const n=JSON.parse(e);if(n&&typeof n=="object"&&!Array.isArray(n))return n}catch{return{}}return{}}return typeof e=="object"&&!Array.isArray(e)?e:{}}function ae(e){if(!e||typeof e!="object")return null;const n=e.modelContext;return n&&typeof n.registerTool=="function"?n:null}function y(){const e=[],n=new Set,s=[];typeof document<"u"&&s.push(document),typeof navigator<"u"&&s.push(navigator),typeof window<"u"&&s.push(window);for(const o of s){const t=ae(o);t&&!n.has(t)&&(n.add(t),e.push(t))}return e}function re(e){return new Promise(n=>setTimeout(n,e))}async function le(e){const n=Date.now();let s=y();for(;s.length===0&&Date.now()-n<e;)await re(50),s=y();return s}const c={type:"object",properties:{},additionalProperties:!1},v={type:"object",properties:{id:{type:"string",description:"Clickable id"}},required:["id"],additionalProperties:!1},_=[{name:"get_page_state",description:"Read room, walls, paint, and confirm flags.",inputSchema:c,readOnly:!0,run:()=>B()},{name:"dismiss_walls",description:"Close cookie, notify, and signup sheets. Does not complete the person gate.",inputSchema:c,run:()=>Y()},{name:"list_clickables",description:"List download-like controls in the current room with shown and second URLs.",inputSchema:c,readOnly:!0,run:()=>J()},{name:"reveal_second_url",description:"Write shown vs second-click URL on the page for one control.",inputSchema:v,run:e=>X(e)},{name:"explain_trap",description:"Write a one-line agent caption on one control.",inputSchema:v,run:e=>ne(e)},{name:"show_redirect_chain",description:"Write the declared hop list for one control. Does not fetch.",inputSchema:v,run:e=>Q(e)},{name:"highlight_real",description:"Paint the real download path in this room.",inputSchema:c,run:()=>Z()},{name:"dim_decoys",description:"Dim decoy buttons in the field room.",inputSchema:c,run:()=>ee()},{name:"request_open",description:"Ask the human to confirm the dummy file. Does not download.",inputSchema:c,run:()=>te()},{name:"get_core_visible",description:"Whether junk walls are gone and the core download UI is showing.",inputSchema:c,readOnly:!0,run:()=>se()}];_.map(e=>e.name);function de(e){return{...e,content:[{type:"text",text:JSON.stringify(e)}]}}async function D(e){const s=await le(e??(typeof document>"u"?0:2e4));if(s.length===0)return{registered:[]};const o=[];for(const t of _){const a={name:t.name,description:t.description,inputSchema:t.inputSchema,...t.readOnly?{annotations:{readOnlyHint:!0}}:{},execute:async m=>de(t.run(oe(m)))};let r=!1;for(const m of s)try{await m.registerTool(a),r=!0}catch{}r&&o.push(t.name)}return{registered:o}}let f=!1,x=0;function ce(e){l(F(i(),e))}function L(e){const n=i(),s=[];if(s.push('<div class="site-wrapper">'),s.push(`
    <header class="site-header">
      <div class="header-top">
        <a href="this-was-an-external-link.html" class="brand-logo">
          <span class="logo-badge">APK</span>
          <span class="brand-name">FILE<span>MIRROR</span></span>
        </a>
        <div class="fake-search">
          <input type="text" placeholder="Search 500,000+ APKs & drivers..." readonly value="DemoApp 1.2" title="Read-only search query" />
          <button type="button" onclick="window.location.href='this-was-an-external-link.html'">SEARCH</button>
        </div>
      </div>
      <nav class="site-nav">
        <a href="this-was-an-external-link.html" class="nav-item active">HOME</a>
        <a href="this-was-an-external-link.html" class="nav-item">ANDROID APKS</a>
        <a href="this-was-an-external-link.html" class="nav-item">WINDOWS DRIVERS</a>
        <a href="this-was-an-external-link.html" class="nav-item">MAC</a>
        <a href="this-was-an-external-link.html" class="nav-item">TOP 100</a>
      </nav>
    </header>
  `),n.room==="door"&&(s.push(`
      <div class="main-layout">
        <div class="ad-marquee-ticker">
          <span class="marquee-content">⚠️ SYSTEM NOTICE: 3 Driver Updates Available! High Speed Download Server #4 online • 1,482,901 Downloads Completed • Verify CAPTCHA to unlock mirrors...</span>
        </div>
        <div class="ad-banner-top">
          <div class="ad-banner-content">
            <span class="ad-tag">SPONSORED</span>
            <span class="ad-text">⚠️ Your system driver or media player may be outdated! Update now.</span>
          </div>
          <a href="this-was-the-ad.html" class="ad-fake-close">✕ Ad</a>
        </div>
        <div class="app-meta-card" aria-hidden="${n.walls.cookie||n.walls.notify||n.walls.signup}">
          <div class="app-icon">APK</div>
          <div style="flex:1">
            <h2 class="app-info-title">DemoApp 1.2 for Android</h2>
            <p class="app-info-sub">Official-looking mirror package. (Mirror Server #42)</p>
            <div class="app-stats-grid">
              <div class="stat-item"><span class="stat-label">File Size</span><span class="stat-val">42.1 MB</span></div>
              <div class="stat-item"><span class="stat-label">Downloads</span><span class="stat-val">1,482,901</span></div>
              <div class="stat-item"><span class="stat-label">Rating</span><span class="stat-val">★ 4.8 / 5</span></div>
              <div class="stat-item"><span class="stat-label">Virus Scan</span><span class="stat-val" style="color:#16a34a">✓ Clean</span></div>
            </div>
    `),!n.walls.cookie&&!n.walls.notify&&!n.walls.signup&&(n.personGateDone?s.push(`
          <button type="button" class="btn-continue-gate anim-fade-in" data-act="enter-field">⚡ Continue to Mirror Downloads</button>
        `):f?s.push(`
            <div class="captcha-container">
              <div class="captcha-header">🛡️ Human Verification Required</div>
              <div class="captcha-box">
                <button type="button" class="captcha-btn loading" disabled>
                  <span class="captcha-check spinner">↻</span>
                  <span>Verifying human...</span>
                </button>
              </div>
            </div>
          `):s.push(`
            <div class="captcha-container">
              <div class="captcha-header">🛡️ Human Verification Required</div>
              <div class="captcha-box">
                <button type="button" class="captcha-btn" data-act="person">
                  <span class="captcha-check"></span>
                  <span>I am a person / not a robot</span>
                </button>
              </div>
            </div>
          `)),s.push(`
          </div>
        </div>
      </div>
    `)),n.room==="field"){s.push(`
      <div class="main-layout">
        <div class="ad-marquee-ticker">
          <span class="marquee-content">🔥 FLASH DEAL: Unlimited High Speed Download Mirror Pass - 90% OFF! • Download starting in 5s...</span>
        </div>
        <div class="ad-banner-top">
          <div class="ad-banner-content">
            <span class="ad-tag">ADVERTISEMENT</span>
            <span class="ad-text">🚀 HIGH SPEED VPN - 90% OFF TODAY ONLY!</span>
          </div>
          <a href="this-was-the-ad.html" class="ad-fake-close">✕</a>
        </div>
        
        <div class="field-grid">
          <div class="field-main">
            <h2 class="mirror-section-title">
              <span>Mirror Download Server Links</span>
              <span style="font-size:12px;color:#64748b;font-weight:600">Select a download mirror</span>
            </h2>
            <div class="mirror-list">
    `);for(const t of d("field")){const a=[t.id===n.highlightedId?"is-real":"",n.dimmedIds.includes(t.id)?"is-dim":""].filter(Boolean).join(" ");let r=t.label;t.id===u?r='<div class="real-btn-inner"><span class="real-btn-title">Download DemoApp.apk (42.1 MB)</span><span class="real-btn-sub">HTTP Direct Mirror • Standard Speed (Free)</span></div>':t.id==="dl-decoy-1"?r=`<span class="anim-down-arrow">⬇</span> ${t.label}`:t.id==="dl-decoy-3"?r=`⚡ ${t.label}`:t.id==="dl-decoy-4"?r=`↓ ${t.label}`:t.id==="dl-decoy-6"?r=`⚠️ ${t.label}`:t.id==="dl-decoy-7"&&(r=`📱 ${t.label}`),s.push(`<button type="button" class="${a}" data-click="${t.id}">${r}</button>`),n.explain?.id===t.id&&s.push(`<p class="agent" data-speaker="agent">${n.explain.text}</p>`)}s.push(`
            </div>
          </div>
          
          <div class="sidebar">
            <div class="sidebar-ad-card">
              <div class="sidebar-ad-title">SPONSORED AD</div>
              <a href="this-was-the-ad.html" class="sidebar-ad-link">⚠️ PC Performance Alert!</a>
              <div class="sidebar-ad-sub">34 errors found on your system. Click to clean now.</div>
            </div>
            <div class="sidebar-ad-card" style="background:#f0fdf4;border-color:#bbf7d0">
              <div class="sidebar-ad-title" style="color:#166534">DOWNLOAD STATUS</div>
              <div style="font-weight:700;font-size:12px;color:#15803d">Server Load: 86%</div>
              <div class="animated-progress-bar">
                <div class="progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)}if(n.room==="hops"){const t=d("hops")[0],a=t.id===n.highlightedId?"file file-swap-btn is-real":"file file-swap-btn";s.push(`
      <div class="main-layout">
        <div class="hops-container">
          <h2 style="font-size:20px;font-weight:800;margin-bottom:12px;color:#0f172a">Your file transfer is ready</h2>
          <div class="virus-scan-bar">
            <span class="scan-icon">✓</span>
            <span>PASSED 54/54 ANTIVIRUS SCANS: Kaspersky Clean, Defender Clean, VirusTotal Passed</span>
          </div>
          <div style="margin-bottom:20px">
            <button type="button" class="${a}" data-click="${t.id}">
              <span class="swap-btn-inner">
                <span class="swap-icon">📥</span>
                <span class="swap-label">DemoApp.apk</span>
                <span class="swap-meta">(42.1 MB • Mirror Server #1)</span>
              </span>
            </button>
    `),n.revealedIds.includes(p)&&s.push(`<p class="urls agent" data-speaker="agent">Shown: ${t.shownUrl}
Second click: ${t.secondUrl}</p>`),n.chainVisibleFor===p&&s.push(`<ol class="agent" data-speaker="agent">${t.hops.map(r=>`<li>${r}</li>`).join("")}</ol>`),n.explain?.id===t.id&&s.push(`<p class="agent" data-speaker="agent">${n.explain.text}</p>`),s.push("</div>"),n.confirmArmed&&s.push(`
        <div class="bar">
          <p>The agent asked to open the file. Only you can confirm.</p>
          <button type="button" data-act="open-confirm">Confirm download</button>
        </div>
      `),s.push(`
        </div>
      </div>
    `)}s.push("</div>"),s.push(`
    <div class="floating-support-badge">
      <span class="badge-dot"></span>
      <span>Live Mirror Support Online</span>
    </div>
  `),n.walls.signup?s.push(`
      <div class="wall" data-wall="signup">
        <div class="sheet sheet-signup">
          <h3>Create Free Account for Premium Speeds</h3>
          <p>Unlock 100 MB/s download speeds and skip queue times.</p>
          <div class="signup-social-btns">
            <a href="this-was-the-ad.html" class="btn-social"><span>🔵</span> Continue with Facebook</a>
            <a href="this-was-the-ad.html" class="btn-social"><span>🔴</span> Continue with Google</a>
          </div>
          <button type="button" class="btn-skip-signup" data-wall-close="signup">Skip and use low speed mirror</button>
        </div>
      </div>
    `):n.walls.notify?s.push(`
      <div class="wall wall-notify-container" data-wall="notify">
        <div class="sheet sheet-notify">
          <div class="notify-header">
            <span>🔔</span>
            <span>itspriyamsri.github.io wants to</span>
          </div>
          <p class="notify-desc">Show notifications for download status and mirror updates</p>
          <div class="notify-actions">
            <button type="button" class="btn-notify-block" data-wall-close="notify">Block</button>
            <button type="button" class="btn-notify-allow" data-wall-close="notify">Allow</button>
          </div>
        </div>
      </div>
    `):n.walls.cookie&&s.push(`
      <div class="wall" data-wall="cookie">
        <div class="sheet sheet-cmp">
          <h3 class="cmp-title">We value your privacy (CMP Consent v2.4)</h3>
          <p class="cmp-desc">We and our 482 advertising partners store and access information on your device to personalize ads and analyze traffic. Click "Accept all" to consent.</p>
          <div class="cmp-vendors-box">
            <strong>Ad Vendors:</strong> AdTech Global, TrackingPlus, MediaData Inc, DataHarvest LLC, AdTargeting Network, AnalyticOps, WebInsight, MarketTracker, AdNet360...
          </div>
          <div class="cmp-actions">
            <button type="button" class="btn-accept-cmp" data-wall-close="cookie">Accept all</button>
            <button type="button" class="btn-reject-cmp" data-wall-close="cookie">Reject non-essential cookies</button>
          </div>
        </div>
      </div>
    `),n.confirmOpen&&s.push(`
      <div class="modal-bg">
        <div class="sheet modal-sheet">
          <h3>Security Confirmation</h3>
          <p>Start dummy file download (DemoApp.apk)?</p>
          <p style="font-size:12px;color:#64748b;margin-bottom:16px">The agent cannot start this download. Human confirmation is required.</p>
          <div class="modal-actions">
            <button type="button" class="btn-confirm-dl" data-act="do-download">Download File</button>
            <button type="button" class="btn-cancel" data-act="cancel-confirm">Cancel</button>
          </div>
        </div>
      </div>
    `);const o=ie();s.push(`<p class="mcp-status" data-webmcp-tools="${String(o.count)}">${o.text}</p>`),e.innerHTML=s.join(""),e.querySelectorAll("[data-wall-close]").forEach(t=>{t.addEventListener("click",()=>{ce(t.dataset.wallClose)})}),e.querySelector("[data-act=person]")?.addEventListener("click",()=>{f||i().personGateDone||(f=!0,L(e),setTimeout(()=>{f=!1,l(M(i()))},1600))}),e.querySelector("[data-act=enter-field]")?.addEventListener("click",()=>{l(N(i()))}),e.querySelector("[data-act=open-confirm]")?.addEventListener("click",()=>{l(k(i()))}),e.querySelector("[data-act=cancel-confirm]")?.addEventListener("click",()=>{l(S(i()))}),e.querySelector("[data-act=do-download]")?.addEventListener("click",()=>{l(S(i())),window.location.href="you-clicked-once.txt"}),e.querySelectorAll("[data-click]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.click,r=i().room;r==="field"?a===u?l(H(i())):window.location.href="this-was-the-ad.html":r==="hops"&&a===p&&(t.classList.add("active-press"),setTimeout(()=>t.classList.remove("active-press"),180),!i().confirmArmed&&x===0?(x=1,window.location.href="this-was-the-ad.html"):(l(I(i())),l(k(i()))))})})}const E=document.querySelector("#app");if(!(E instanceof HTMLElement))throw new Error("#app missing");const h=()=>L(E);z(h);h();(async()=>{let e=await D(2e4);e.registered.length===0&&(A({count:0,text:y().length?"Site tools: modelContext present but registerTool failed":"Site tools: no document.modelContext. Use ChatGPT desktop in-app browser, GPT-5.6 Sol or Terra, Settings → Browser → Enable site tools. Codex CLI and plain Chrome will not see tools."}),h(),e=await D(6e4)),e.registered.length>0&&(A({count:e.registered.length,text:`Site tools: ${e.registered.length} registered`}),h())})();
