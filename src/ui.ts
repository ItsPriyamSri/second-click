import { getClickables, REAL_FIELD_ID, SWAP_ID } from "./catalog";
import {
  cancelConfirm,
  completePersonGate,
  dismissOneWall,
  enterField,
  enterHops,
  openConfirm,
} from "./reducers";
import { getState, setState } from "./store";
import type { WallId } from "./state";
import { getWebmcpStatus } from "./webmcp";

let isVerifyingPerson = false;

function closeWall(wall: WallId) {
  setState(dismissOneWall(getState(), wall));
}

export function render(root: HTMLElement): void {
  const s = getState();
  const parts: string[] = [];
  parts.push(`<div class="site-wrapper">`);
  
  // Header Chrome
  parts.push(`
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
  `);

  if (s.room === "door") {
    parts.push(`
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
        <div class="app-meta-card" aria-hidden="${s.walls.cookie || s.walls.notify || s.walls.signup}">
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
    `);

    if (!s.walls.cookie && !s.walls.notify && !s.walls.signup) {
      if (!s.personGateDone) {
        if (isVerifyingPerson) {
          parts.push(`
            <div class="captcha-container">
              <div class="captcha-header">🛡️ Human Verification Required</div>
              <div class="captcha-box">
                <button type="button" class="captcha-btn loading" disabled>
                  <span class="captcha-check spinner">↻</span>
                  <span>Verifying human...</span>
                </button>
              </div>
            </div>
          `);
        } else {
          parts.push(`
            <div class="captcha-container">
              <div class="captcha-header">🛡️ Human Verification Required</div>
              <div class="captcha-box">
                <button type="button" class="captcha-btn" data-act="person">
                  <span class="captcha-check"></span>
                  <span>I am a person / not a robot</span>
                </button>
              </div>
            </div>
          `);
        }
      } else {
        parts.push(`
          <button type="button" class="btn-continue-gate anim-fade-in" data-act="enter-field">⚡ Continue to Mirror Downloads</button>
        `);
      }
    }

    parts.push(`
          </div>
        </div>
      </div>
    `);
  }

  if (s.room === "field") {
    parts.push(`
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
    `);

    for (const c of getClickables("field")) {
      const cls = [
        c.id === s.highlightedId ? "is-real" : "",
        s.dimmedIds.includes(c.id) ? "is-dim" : "",
      ]
        .filter(Boolean)
        .join(" ");

      let buttonContent = c.label;
      if (c.id === REAL_FIELD_ID) {
        buttonContent = `<div class="real-btn-inner"><span class="real-btn-title">Download DemoApp.apk (42.1 MB)</span><span class="real-btn-sub">HTTP Direct Mirror • Standard Speed (Free)</span></div>`;
      } else if (c.id === "dl-decoy-1") {
        buttonContent = `<span class="anim-down-arrow">⬇</span> ${c.label}`;
      } else if (c.id === "dl-decoy-3") {
        buttonContent = `⚡ ${c.label}`;
      } else if (c.id === "dl-decoy-4") {
        buttonContent = `↓ ${c.label}`;
      } else if (c.id === "dl-decoy-6") {
        buttonContent = `⚠️ ${c.label}`;
      } else if (c.id === "dl-decoy-7") {
        buttonContent = `📱 ${c.label}`;
      }

      parts.push(
        `<button type="button" class="${cls}" data-click="${c.id}">${buttonContent}</button>`,
      );

      if (s.explain?.id === c.id) {
        parts.push(`<p class="agent" data-speaker="agent">${s.explain.text}</p>`);
      }
    }

    parts.push(`
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
    `);
  }

  if (s.room === "hops") {
    const c = getClickables("hops")[0];
    const cls = c.id === s.highlightedId ? "file file-swap-btn is-real" : "file file-swap-btn";

    parts.push(`
      <div class="main-layout">
        <div class="hops-container">
          <h2 style="font-size:20px;font-weight:800;margin-bottom:12px;color:#0f172a">Your file transfer is ready</h2>
          <div class="virus-scan-bar">
            <span class="scan-icon">✓</span>
            <span>PASSED 54/54 ANTIVIRUS SCANS: Kaspersky Clean, Defender Clean, VirusTotal Passed</span>
          </div>
          <div style="margin-bottom:20px">
            <button type="button" class="${cls}" data-click="${c.id}">${c.label}</button>
    `);

    if (s.revealedIds.includes(SWAP_ID)) {
      parts.push(
        `<p class="urls agent" data-speaker="agent">Shown: ${c.shownUrl}\nSecond click: ${c.secondUrl}</p>`,
      );
    }
    if (s.chainVisibleFor === SWAP_ID) {
      parts.push(
        `<ol class="agent" data-speaker="agent">${c.hops.map((h) => `<li>${h}</li>`).join("")}</ol>`,
      );
    }
    if (s.explain?.id === c.id) {
      parts.push(`<p class="agent" data-speaker="agent">${s.explain.text}</p>`);
    }

    parts.push(`</div>`);

    if (s.confirmArmed) {
      parts.push(`
        <div class="bar">
          <p>The agent asked to open the file. Only you can confirm.</p>
          <button type="button" data-act="open-confirm">Confirm download</button>
        </div>
      `);
    }

    parts.push(`
        </div>
      </div>
    `);
  }

  parts.push(`</div>`); // End site-wrapper

  // Floating Annoying Support Badge
  parts.push(`
    <div class="floating-support-badge">
      <span class="badge-dot"></span>
      <span>Live Mirror Support Online</span>
    </div>
  `);

  // Sequential Walls & Overlays
  if (s.walls.signup) {
    parts.push(`
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
    `);
  } else if (s.walls.notify) {
    parts.push(`
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
    `);
  } else if (s.walls.cookie) {
    parts.push(`
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
    `);
  }

  if (s.confirmOpen) {
    parts.push(`
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
    `);
  }

  const mcp = getWebmcpStatus();
  parts.push(
    `<p class="mcp-status" data-webmcp-tools="${String(mcp.count)}">${mcp.text}</p>`,
  );

  root.innerHTML = parts.join("");

  // Event bindings
  root.querySelectorAll("[data-wall-close]").forEach((el) => {
    el.addEventListener("click", () => {
      closeWall((el as HTMLElement).dataset.wallClose as WallId);
    });
  });

  root.querySelector("[data-act=person]")?.addEventListener("click", () => {
    if (isVerifyingPerson || getState().personGateDone) return;
    isVerifyingPerson = true;
    render(root);
    setTimeout(() => {
      isVerifyingPerson = false;
      setState(completePersonGate(getState()));
    }, 1600);
  });

  root.querySelector("[data-act=enter-field]")?.addEventListener("click", () => {
    setState(enterField(getState()));
  });
  root.querySelector("[data-act=open-confirm]")?.addEventListener("click", () => {
    setState(openConfirm(getState()));
  });
  root.querySelector("[data-act=cancel-confirm]")?.addEventListener("click", () => {
    setState(cancelConfirm(getState()));
  });
  root.querySelector("[data-act=do-download]")?.addEventListener("click", () => {
    setState(cancelConfirm(getState()));
    window.location.href = "you-clicked-once.txt";
  });

  root.querySelectorAll("[data-click]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = (el as HTMLElement).dataset.click;
      const room = getState().room;
      if (room === "field") {
        if (id === REAL_FIELD_ID) setState(enterHops(getState()));
        else window.location.href = "this-was-the-ad.html";
      }
    });
  });
}