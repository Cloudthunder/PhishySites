// ── Batch check via background ────────────────────────────────────────────────
async function scanLinks(anchors) {
  if (anchors.length === 0) return;

  // Deduplicate URLs while tracking which anchors map to each
  const urlToAnchors = {};
  for (const a of anchors) {
    const url = a.href;
    if (!urlToAnchors[url]) urlToAnchors[url] = [];
    urlToAnchors[url].push(a);
  }

  const urls = Object.keys(urlToAnchors);

  // Split into chunks of 50 (Safe Browsing API limit)
  const CHUNK = 50;
  for (let i = 0; i < urls.length; i += CHUNK) {
    const chunk = urls.slice(i, i + CHUNK);

    chrome.runtime.sendMessage({ type: "CHECK_URLS", urls: chunk }, (response) => {
      if (!response) return;
      const { results } = response;

      for (const url of chunk) {
        const linkedAnchors = urlToAnchors[url];
        const result = results[url];

        for (const anchor of linkedAnchors) {
          if (result && result.flagged) {
            flagLink(anchor, result.reason, result.source);
          } else {
            markSafe(anchor);
          }
        }
      }
    });
  }
}

// ── Initial scan ──────────────────────────────────────────────────────────────
function initialScan() {
  injectStyles();
  const links = collectLinks();
  scanLinks(links);
}

// ── Watch for dynamically added links ─────────────────────────────────────────
function watchDOM() {
  const observer = new MutationObserver(() => {
    const newLinks = collectLinks();
    if (newLinks.length > 0) scanLinks(newLinks);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { initialScan(); watchDOM(); });
} else {
  initialScan();
  watchDOM();
}
