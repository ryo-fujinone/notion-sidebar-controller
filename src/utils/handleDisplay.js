export const getDisplayInfoArray = async () => {
  return await chrome.system.display.getInfo().then((displayInfoArray) => {
    return displayInfoArray;
  });
};
