function collectLinks() {
  return [...document.querySelectorAll("a[href]")].filter(a => 
    a.href.startsWith("http")
  );
}

function scan() {
  chrome.storage.local.get('blockedSites', (result) => {
    const blockedSites = result.blockedSites || [];
    const links = collectLinks();

    for (const a of links) {
      const hostname = new URL(a.href).hostname;
      if (blockedSites.includes(hostname)) {
        console.warn("⚠️ BLOCKED SITE:", a.href);
      }

      const result = checkUrl(a.href);
      if (result.flagged) {
        console.warn("⚠️ SUSPICIOUS:", a.href, "—", result.reason);
      }
    }
  });
}

function checkUrl(url) {
  // Raw IP address URLs
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
    return { flagged: true, reason: "Raw IP address URL" };
  }

  // Suspicious free TLDs
  if (/\.(tk|ml|ga|cf|gq)(\/|$)/.test(url)) {
    return { flagged: true, reason: "Suspicious TLD" };
  }

  // Phishing keywords in the URL
  if (/verify-account|signin-update|confirm-identity|account-suspended/.test(url)) {
    return { flagged: true, reason: "Phishing keyword in URL" };
  }

  // Too many subdomains
  const hostname = new URL(url).hostname;
  if (hostname.split(".").length > 4) {
    return { flagged: true, reason: "Unusually deep subdomain" };
  }

  return { flagged: false };
}

const observer = new MutationObserver(() => {
  scan();
});

observer.observe(document.body, { childList: true, subtree: true });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scan);
} else {
  scan();
}