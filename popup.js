const toggle = document.getElementById('toggle');
const status = document.getElementById('status');
const body   = document.getElementById('body');

toggle.addEventListener('change', () => {
  const on = toggle.checked;
  status.textContent = on ? 'On' : 'Off';
  body.classList.toggle('on', on);
});

const siteInput = document.getElementById('siteInput');
const addBtn    = document.getElementById('addBtn');

addBtn.addEventListener('click', () => {
  const raw = siteInput.value.trim();
  if (!raw) return;

  try {
    const hostname = new URL(raw).hostname;
    addSite(hostname);
    siteInput.value = '';
  } catch {
    alert('Please paste a valid URL, e.g. https://example.com');
  }
});

function addSite(url) {
  chrome.storage.local.get('blockedSites', (result) => {
    const sites = result.blockedSites || [];
    if (!sites.includes(url)) {
      sites.push(url);
      chrome.storage.local.set({ blockedSites: sites });
    }
  });
}