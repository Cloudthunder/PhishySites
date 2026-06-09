function addSite(url) {
  chrome.storage.local.get('blockedSites', (result) => {
    const sites = result.blockedSites || [];
    if (!sites.includes(url)) {
      sites.push(url);
      chrome.storage.local.set({ blockedSites: sites });
    }
  });
}

function removeSite(url) {
  chrome.storage.local.get('blockedSites', (result) => {
    const sites = (result.blockedSites || []).filter(s => s !== url);
    chrome.storage.local.set({ blockedSites: sites });
  });
}