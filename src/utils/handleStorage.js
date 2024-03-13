export const getFromStorage = (keys = null) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => {
      resolve(result);
    });
  });
};

export const saveToStorage = (obj = {}) => {
  return chrome.storage.local.set(obj);
};
