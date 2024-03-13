import { getOverlapSize } from "overlap-area";
import { getDefaultOptions } from "../utils/defaultOptions";
import { getDisplayInfoArray } from "../utils/handleDisplay";
import { getFromManifest } from "../utils/handleManifest";
import { getFromStorage, saveToStorage } from "../utils/handleStorage";

const OPTIONS_PAGE_PATH = getFromManifest("options_page");

chrome.runtime.onInstalled.addListener(async () => {
  const options = (await getFromStorage()).options;
  if (!options) {
    chrome.tabs.create({ url: OPTIONS_PAGE_PATH });
    return;
  }

  const defaultOptions = getDefaultOptions();
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  const mergedOptionsKeys = Object.keys(mergedOptions);
  const newOptions = mergedOptionsKeys.reduce((obj, key) => {
    if (Object.hasOwn(defaultOptions, key)) {
      obj[key] = mergedOptions[key];
    }
    return obj;
  }, {});

  saveToStorage({ options: { ...newOptions } });
});

chrome.action.onClicked.addListener(() => {
  chrome.windows.getAll({ populate: true }).then((windows) => {
    const optionsPageUrl = `chrome-extension://${chrome.runtime.id}/${OPTIONS_PAGE_PATH}`;
    let optionsPageExists = false;
    for (const window of windows) {
      if (!window.focused) {
        continue;
      }
      const optionsTab = window.tabs.find((tab) => tab.url === optionsPageUrl);
      if (optionsTab) {
        chrome.tabs.update(optionsTab.id, { selected: true });
        optionsPageExists = true;
        break;
      }
    }
    if (!optionsPageExists) {
      chrome.tabs.create({ url: OPTIONS_PAGE_PATH });
    }
  });
});

chrome.runtime.onMessage.addListener(async (_, sender) => {
  const displayInfoArray = await getDisplayInfoArray();

  const windows = await chrome.windows.getAll({ populate: true });
  const target = windows.find((window) => {
    return sender.tab.windowId === window.id;
  });

  // Fix window info when not in full screen view
  const isWindows = navigator?.userAgentData?.platform === "Windows";
  if (isWindows && !target.state.includes("fullscreen")) {
    target.left += 8;
    target.top += 8;
    target.width -= 16;
    target.height -= 16;
  }

  const targetPoints = [
    [target.left, target.top],
    [target.left + target.width, target.top],
    [target.left + target.width, target.height + target.top],
    [target.left, target.height + target.top],
  ];

  // Calculate area using 'overlap-area'.
  for (const [i, display] of displayInfoArray.entries()) {
    const bounds = display.bounds;
    const points = [
      [bounds.left, bounds.top],
      [bounds.left + bounds.width, bounds.top],
      [bounds.left + bounds.width, bounds.height + bounds.top],
      [bounds.left, bounds.height + bounds.top],
    ];
    displayInfoArray[i].windowOverlapSize = getOverlapSize(
      targetPoints,
      points,
    );
  }

  // Returns the display info with the largest overlapping area with the window.
  chrome.tabs.sendMessage(
    sender.tab.id,
    displayInfoArray.reduce((acc, cur) => {
      return acc.windowOverlapSize > cur.windowOverlapSize ? acc : cur;
    }),
  );
});
