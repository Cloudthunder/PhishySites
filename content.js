function collectLinks() {
  return [...document.querySelectorAll("a[href]")].filter(a => 
    a.href.startsWith("http")
  );
}

function initialScan() {
  const links = collectLinks();
  console.log("PhishySites: found", links.length, "links");

  for (const a of links) {
    const result = checkUrl(a.href);
    if (result.flagged) {
      console.warn("⚠️ SUSPICIOUS:", a.href, "—", result.reason);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialScan);
} else {
  initialScan();
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
