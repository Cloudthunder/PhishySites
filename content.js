function collectLinks() {
  return [...document.querySelectorAll("a[href]")].filter(a => 
    a.href.startsWith("http")
  );
}

function initialScan() {
  const links = collectLinks();
  console.log("PhishySites: found", links.length, "links");
  console.log(links.map(a => a.href));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialScan);
} else {
  initialScan();
}