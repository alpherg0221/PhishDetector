(async() => {
  const src = chrome.runtime.getURL("src/detector.js");
  await import(src);
})();