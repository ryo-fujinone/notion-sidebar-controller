import { getDisplayInfoArray } from "./handleDisplay";

export const getDefaultOptions = () => {
  return {
    displays: [],
    waitTimeForSidebar: 1000,
  };
};

export const getDefaultOptionsForDisplay = () => {
  return {
    sidebarState: "default",
    preventSidebarOnHover: false,
  };
};

export const generateNewOptions = async () => {
  const displayInfoArray = await getDisplayInfoArray();
  const newOptions = { ...getDefaultOptions() };

  for (const displayInfo of displayInfoArray) {
    if (!displayInfo.isEnabled) continue;
    newOptions.displays.push({
      id: displayInfo.id,
      name: displayInfo.name,
      ...getDefaultOptionsForDisplay(),
    });
  }

  return newOptions;
};
