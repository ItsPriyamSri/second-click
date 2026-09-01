(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();const p="dl-real",u="dl-swap",T=[{id:"dl-decoy-1",label:"DOWNLOAD NOW",shownUrl:"/ads/offer-1",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:"dl-decoy-2",label:"GET THE APP",shownUrl:"/ads/offer-2",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:p,label:"Download DemoApp",shownUrl:"/continue/real",secondUrl:null,hops:[],kind:"real",trapType:"none"},{id:"dl-decoy-3",label:"DOWNLOAD (FAST)",shownUrl:"/ads/offer-3",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:"dl-decoy-4",label:"MIRROR #1",shownUrl:"/ads/offer-4",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:"dl-decoy-5",label:"INSTALLER",shownUrl:"/ads/offer-5",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:"dl-decoy-6",label:"CLICK HERE",shownUrl:"/ads/offer-6",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"},{id:"dl-decoy-7",label:"FREE APK",shownUrl:"/ads/offer-7",secondUrl:null,hops:[],kind:"decoy",trapType:"decoy"}],C=[{id:u,label:"DemoApp.apk",shownUrl:"/ads/click-here",secondUrl:"/you-clicked-once.txt",hops:["/ads/hop-1","/ads/hop-2","/you-clicked-once.txt"],kind:"two_url",trapType:"second_click"}];function d(e){return e==="field"?T:e==="hops"?C:[]}function _(){return{room:"door",walls:{cookie:!0,notify:!0,signup:!0},personGateDone:!1,highlightedId:null,dimmedIds:[],revealedIds:[],chainVisibleFor:null,explain:null,confirmArmed:!1,confirmOpen:!1}}function A(e){const n=[];e.walls.cookie&&n.push("cookie"),e.walls.notify&&n.push("notify"),e.walls.signup&&n.push("signup"),e.personGateDone||n.push("person_gate");const t=e.room==="field"||e.room==="hops";return{visible:n.length===0&&t,blocking:n}}function b(e,n){return d(e.room).find(t=>t.id===n)}function E(e){return{...e,walls:{cookie:!1,notify:!1,signup:!1}}}function L(e,n){return{...e,walls:{...e.walls,[n]:!1}}}function U(e){return{...e,personGateDone:!0}}function P(e){return e.walls.cookie||e.walls.notify||e.walls.signup||!e.personGateDone?e:{...e,room:"field"}}function R(e){return e.room!=="field"?e:{...e,room:"hops",highlightedId:null,dimmedIds:[],revealedIds:[],chainVisibleFor:null,explain:null,confirmArmed:!1,confirmOpen:!1}}function q(e){return e.room==="field"?{...e,highlightedId:p}:e.room==="hops"?{...e,highlightedId:u}:e}function N(e){if(e.room!=="field")return{...e,dimmedIds:[]};const n=d("field").filter(t=>t.id!==p).map(t=>t.id);return{...e,dimmedIds:n}}function F(e,n){return!b(e,n)||e.revealedIds.includes(n)?e:{...e,revealedIds:[...e.revealedIds,n]}}function M(e,n){const t=b(e,n);return!t||t.hops.length===0?e:{...e,chainVisibleFor:n}}const W={decoy:"This button is an ad, not the file.",second_click:"Shown URL is not the second-click URL.",redirect_chain:"This path hops before the file.",none:"This is the real path. The agent still cannot start the file."};function $(e,n){const t=b(e,n);return t?{...e,explain:{id:n,text:W[t.trapType]}}:e}function G(e){return e.room!=="hops"||!A(e).visible?e:{...e,confirmArmed:!0}}function H(e){return e.confirmArmed?{...e,confirmOpen:!0}:e}function w(e){return{...e,confirmOpen:!1,confirmArmed:!1}}let D=_();const v=new Set;function s(){return D}function r(e){D=e;for(const n of v)n()}function V(e){return v.add(e),()=>{v.delete(e)}}function g(e){return typeof e.id=="string"&&e.id.length>0?e.id:null}function j(){const e=s();return{room:e.room,walls:e.walls,personGateDone:e.personGateDone,highlightedId:e.highlightedId,dimmedIds:e.dimmedIds,revealedIds:e.revealedIds,chainVisibleFor:e.chainVisibleFor,explain:e.explain,confirmArmed:e.confirmArmed,confirmOpen:e.confirmOpen}}function K(){r(E(s()));const e=s();return{closed:["cookie","notify","signup"],personGateDone:e.personGateDone}}function z(){const e=s();return{room:e.room,clickables:d(e.room)}}function B(e){const n=g(e);if(!n)return{error:"id_required"};const t=s(),i=d(t.room).find(o=>o.id===n);return i?(r(F(t,n)),{id:n,shownUrl:i.shownUrl,secondUrl:i.secondUrl,revealed:!0}):{error:"unknown_id"}}function Y(e){const n=g(e);if(!n)return{error:"id_required"};const t=s(),i=d(t.room).find(o=>o.id===n);return i?i.hops.length===0?{error:"no_hops"}:(r(M(t,n)),{id:n,hops:i.hops,shown:!0}):{error:"unknown_id"}}function J(){return r(q(s())),{highlightedId:s().highlightedId}}function X(){return r(N(s())),{dimmedIds:s().dimmedIds}}function Q(e){const n=g(e);if(!n)return{error:"id_required"};const t=s();return d(t.room).find(o=>o.id===n)?(r($(t,n)),s().explain):{error:"unknown_id"}}function Z(){return r(G(s())),s().confirmArmed?{confirmArmed:!0,confirmOpen:!1,message:"Human must confirm. The agent cannot start the file."}:{error:"not_ready",confirmArmed:!1}}function ee(){return A(s())}let I={count:-1,text:"Site tools: waiting for document.modelContext…"};function ne(){return I}function k(e){I=e}function te(e){if(e==null)return{};if(typeof e=="string"){try{const n=JSON.parse(e);if(n&&typeof n=="object"&&!Array.isArray(n))return n}catch{return{}}return{}}return typeof e=="object"&&!Array.isArray(e)?e:{}}function oe(e){if(!e||typeof e!="object")return null;const n=e.modelContext;return n&&typeof n.registerTool=="function"?n:null}function y(){const e=[],n=new Set,t=[];typeof document<"u"&&t.push(document),typeof navigator<"u"&&t.push(navigator),typeof window<"u"&&t.push(window);for(const i of t){const o=oe(i);o&&!n.has(o)&&(n.add(o),e.push(o))}return e}function se(e){return new Promise(n=>setTimeout(n,e))}async function ie(e){const n=Date.now();let t=y();for(;t.length===0&&Date.now()-n<e;)await se(50),t=y();return t}const c={type:"object",properties:{},additionalProperties:!1},m={type:"object",properties:{id:{type:"string",description:"Clickable id"}},required:["id"],additionalProperties:!1},x=[{name:"get_page_state",description:"Read room, walls, paint, and confirm flags.",inputSchema:c,readOnly:!0,run:()=>j()},{name:"dismiss_walls",description:"Close cookie, notify, and signup sheets. Does not complete the person gate.",inputSchema:c,run:()=>K()},{name:"list_clickables",description:"List download-like controls in the current room with shown and second URLs.",inputSchema:c,readOnly:!0,run:()=>z()},{name:"reveal_second_url",description:"Write shown vs second-click URL on the page for one control.",inputSchema:m,run:e=>B(e)},{name:"explain_trap",description:"Write a one-line agent caption on one control.",inputSchema:m,run:e=>Q(e)},{name:"show_redirect_chain",description:"Write the declared hop list for one control. Does not fetch.",inputSchema:m,run:e=>Y(e)},{name:"highlight_real",description:"Paint the real download path in this room.",inputSchema:c,run:()=>J()},{name:"dim_decoys",description:"Dim decoy buttons in the field room.",inputSchema:c,run:()=>X()},{name:"request_open",description:"Ask the human to confirm the dummy file. Does not download.",inputSchema:c,run:()=>Z()},{name:"get_core_visible",description:"Whether junk walls are gone and the core download UI is showing.",inputSchema:c,readOnly:!0,run:()=>ee()}];x.map(e=>e.name);function ae(e){return{...e,content:[{type:"text",text:JSON.stringify(e)}]}}async function S(e){const t=await ie(e??(typeof document>"u"?0:2e4));if(t.length===0)return{registered:[]};const i=[];for(const o of x){const a={name:o.name,description:o.description,inputSchema:o.inputSchema,...o.readOnly?{annotations:{readOnlyHint:!0}}:{},execute:async h=>ae(o.run(te(h)))};let l=!1;for(const h of t)try{await h.registerTool(a),l=!0}catch{}l&&i.push(o.name)}return{registered:i}}function re(e){r(L(s(),e))}function le(e){const n=s(),t=[];if(t.push('<div class="site-wrapper">'),t.push(`
    <header class="site-header">
      <div class="header-top">
        <a href="#" class="brand-logo">
          <span class="logo-badge">APK</span>
          <span class="brand-name">FILE<span>MIRROR</span></span>
        </a>
        <div class="fake-search">
          <input type="text" placeholder="Search 500,000+ APKs & drivers..." readonly value="DemoApp 1.2" />
          <button type="button">SEARCH</button>
        </div>
      </div>
      <nav class="site-nav">
        <a href="#" class="nav-item active">HOME</a>
        <a href="#" class="nav-item">ANDROID APKS</a>
        <a href="#" class="nav-item">WINDOWS DRIVERS</a>
        <a href="#" class="nav-item">MAC</a>
        <a href="#" class="nav-item">TOP 100</a>
      </nav>
    </header>
  `),n.room==="door"&&(t.push(`
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
    `),!n.walls.cookie&&!n.walls.notify&&!n.walls.signup&&(n.personGateDone?t.push(`
          <button type="button" class="btn-continue-gate" data-act="enter-field">⚡ Continue to Mirror Downloads</button>
        `):t.push(`
          <div class="captcha-container">
            <div class="captcha-header">🛡️ Human Verification Required</div>
            <div class="captcha-box">
              <button type="button" class="captcha-btn ${n.personGateDone?"done":""}" data-act="person">
                <span class="captcha-check">${n.personGateDone?"✓":""}</span>
                <span>I am a person / not a robot</span>
              </button>
            </div>
          </div>
        `)),t.push(`
          </div>
        </div>
      </div>
    `)),n.room==="field"){t.push(`
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
    `);for(const o of d("field")){const a=[o.id===n.highlightedId?"is-real":"",n.dimmedIds.includes(o.id)?"is-dim":""].filter(Boolean).join(" ");let l=o.label;o.id!==p&&(l=`<span class="anim-down-arrow">⬇</span> ${o.label} <span class="anim-sparkle">✨</span>`),t.push(`<button type="button" class="${a}" data-click="${o.id}">${l}</button>`),n.explain?.id===o.id&&t.push(`<p class="agent" data-speaker="agent">${n.explain.text}</p>`)}t.push(`
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
    `)}if(n.room==="hops"){const o=d("hops")[0],a=o.id===n.highlightedId?"file file-swap-btn is-real":"file file-swap-btn";t.push(`
      <div class="main-layout">
        <div class="hops-container">
          <h2 style="font-size:20px;font-weight:800;margin-bottom:12px;color:#0f172a">Your file transfer is ready</h2>
          <div class="virus-scan-bar">
            <span class="scan-icon">✓</span>
            <span>PASSED 54/54 ANTIVIRUS SCANS: Kaspersky Clean, Defender Clean, VirusTotal Passed</span>
          </div>
          <div style="margin-bottom:20px">
            <button type="button" class="${a}" data-click="${o.id}"><span class="anim-down-arrow">⬇</span> ${o.label}</button>
    `),n.revealedIds.includes(u)&&t.push(`<p class="urls agent" data-speaker="agent">Shown: ${o.shownUrl}
Second click: ${o.secondUrl}</p>`),n.chainVisibleFor===u&&t.push(`<ol class="agent" data-speaker="agent">${o.hops.map(l=>`<li>${l}</li>`).join("")}</ol>`),n.explain?.id===o.id&&t.push(`<p class="agent" data-speaker="agent">${n.explain.text}</p>`),t.push("</div>"),n.confirmArmed&&t.push(`
        <div class="bar">
          <p>The agent asked to open the file. Only you can confirm.</p>
          <button type="button" data-act="open-confirm">Confirm download</button>
        </div>
      `),t.push(`
        </div>
      </div>
    `)}t.push("</div>"),t.push(`
    <div class="floating-support-badge">
      <span class="badge-dot"></span>
      <span>Live Mirror Support Online</span>
    </div>
  `),n.walls.cookie&&t.push(`
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
    `),n.walls.notify&&t.push(`
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
    `),n.walls.signup&&t.push(`
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
    `),n.confirmOpen&&t.push(`
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
    `);const i=ne();t.push(`<p class="mcp-status" data-webmcp-tools="${String(i.count)}">${i.text}</p>`),e.innerHTML=t.join(""),e.querySelectorAll("[data-wall-close]").forEach(o=>{o.addEventListener("click",()=>{re(o.dataset.wallClose)})}),e.querySelector("[data-act=person]")?.addEventListener("click",()=>{r(U(s()))}),e.querySelector("[data-act=enter-field]")?.addEventListener("click",()=>{r(P(s()))}),e.querySelector("[data-act=open-confirm]")?.addEventListener("click",()=>{r(H(s()))}),e.querySelector("[data-act=cancel-confirm]")?.addEventListener("click",()=>{r(w(s()))}),e.querySelector("[data-act=do-download]")?.addEventListener("click",()=>{r(w(s())),window.location.href="you-clicked-once.txt"}),e.querySelectorAll("[data-click]").forEach(o=>{o.addEventListener("click",()=>{const a=o.dataset.click;s().room==="field"&&(a===p?r(R(s())):window.location.href="this-was-the-ad.html")})})}const O=document.querySelector("#app");if(!(O instanceof HTMLElement))throw new Error("#app missing");const f=()=>le(O);V(f);f();(async()=>{let e=await S(2e4);e.registered.length===0&&(k({count:0,text:y().length?"Site tools: modelContext present but registerTool failed":"Site tools: no document.modelContext. Use ChatGPT desktop in-app browser, GPT-5.6 Sol or Terra, Settings → Browser → Enable site tools. Codex CLI and plain Chrome will not see tools."}),f(),e=await S(6e4)),e.registered.length>0&&(k({count:e.registered.length,text:`Site tools: ${e.registered.length} registered`}),f())})();
