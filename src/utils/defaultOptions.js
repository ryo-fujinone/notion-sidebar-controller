import { getDisplayInfoArray } from "./handleDisplay";

export const getDefaultOptions = () => {
  return {
    displays: [],
    waitTimeForSidebar: 1000,
    showAllDisplayOptions: false,
    attemptToRestoreOptions: true,
  };
};

export const getDefaultOptionsForDisplay = () => {
  return {
    leftSidebarState: "default",
    rightSidebarState: "default",
    preventSidebarOnHover: false,
    bounds: {},
  };
};

export const generateNewOptions = async () => {
  const displayInfoArray = await getDisplayInfoArray();
  const newOptions = { ...getDefaultOptions() };

  for (const displayInfo of displayInfoArray) {
    if (!displayInfo.isEnabled) continue;
    newOptions.displays.push({
      ...getDefaultOptionsForDisplay(),
      id: displayInfo.id,
      name: displayInfo.name,
      bounds: displayInfo.bounds,
    });
  }

  return newOptions;
};
