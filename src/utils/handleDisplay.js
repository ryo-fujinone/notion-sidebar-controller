import { getFromStorage, saveToStorage } from "./handleStorage";

export const getDisplayInfoArray = async () => {
  return await chrome.system.display.getInfo().then((displayInfoArray) => {
    return displayInfoArray;
  });
};

export const attemptToRestoreOptions = async () => {
  try {
    const displayInfoArray = await getDisplayInfoArray();
    const result = await getFromStorage("options");
    const newOptions = structuredClone(result.options);
    const idsInOptions = newOptions.displays.map((d) => d.id);
    const newDisplayInfoArray = displayInfoArray.filter(
      (d) => !idsInOptions.includes(d.id),
    );
    if (newDisplayInfoArray.length === 0) {
      return;
    }
    for (const d of newOptions.displays) {
      const newDisplayInfo = newDisplayInfoArray.find((_d) => {
        if (d.name !== _d.name) {
          return;
        }
        const b1 = d.bounds;
        const b2 = _d.bounds;
        if (
          b1.width === b2.width &&
          b1.height === b2.height &&
          b1.top === b2.top &&
          b1.left === b2.left
        ) {
          return true;
        }
        return false;
      });
      if (!newDisplayInfo) {
        continue;
      }
      if (!newDisplayInfo.isEnabled) {
        continue;
      }
      d.id = newDisplayInfo.id;
    }
    await saveToStorage({ options: newOptions });
    return newOptions;
  } catch (e) {
    console.log(e);
  }
};
