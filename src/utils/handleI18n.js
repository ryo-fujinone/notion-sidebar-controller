export const getI18nMessage = (key = "") => {
  const message = chrome.i18n.getMessage(key);
  return message !== "" ? message : key;
};
