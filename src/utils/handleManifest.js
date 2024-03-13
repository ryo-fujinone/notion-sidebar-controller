export const getFromManifest = (key) => {
  const manifest = chrome.runtime.getManifest();
  return manifest[key];
};
