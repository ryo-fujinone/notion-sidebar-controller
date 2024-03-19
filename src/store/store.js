import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  generateNewOptions,
  getDefaultOptions,
  getDefaultOptionsForDisplay,
} from "../utils/defaultOptions";
import { getDisplayInfoArray } from "../utils/handleDisplay";
import { saveToStorage } from "../utils/handleStorage";

export const useDisplayInfoArrayStore = create((set) => ({
  displayInfoArray: [],
  updateDisplayInfoArray: async () => {
    const displayInfoArray = await getDisplayInfoArray();
    set(() => ({ displayInfoArray }));
  },
}));

const storage = {
  setItem: async (key, value) => {
    const state = JSON.parse(value).state;
    if (state.restore) return;
    const options = state.options;
    saveToStorage({ [key]: options });
  },
};

export const useOptionsStore = create(
  persist(
    (set, get) => ({
      options: getDefaultOptions(),
      restore: false,
      updateOptions: (newOptions = {}, restore = false) => {
        set((state) => ({
          options: { ...state.options, ...newOptions },
          restore: restore,
        }));
      },
      updateSpecificDisplayOptions: (id, key, value) => {
        const newOptions = structuredClone(get().options);
        const newDisplaysOptions = [];
        for (const d of get().options.displays) {
          if (id !== d.id) {
            newDisplaysOptions.push(d);
            continue;
          }
          d[key] = value;
          newDisplaysOptions.push(d);
        }
        newOptions.displays = newDisplaysOptions;
        set(() => ({
          options: { ...newOptions },
          restore: false,
        }));
      },
      updateDisplaysNames: async () => {
        await useDisplayInfoArrayStore.getState().updateDisplayInfoArray();
        const displayInfoArray =
          useDisplayInfoArrayStore.getState().displayInfoArray;

        const newOptions = structuredClone(get().options);
        const newDisplaysOptions = [];
        for (const d of newOptions.displays) {
          const displayInfo = displayInfoArray.find((_d) => d.id === _d.id);
          if (!displayInfo) {
            newDisplaysOptions.push(d);
            continue;
          }
          // Update name as name may change even for the same ID.
          newDisplaysOptions.push({
            ...d,
            name: displayInfo.name,
          });
        }
        newOptions.displays = newDisplaysOptions;

        set(() => ({
          options: { ...newOptions },
          restore: false,
        }));
      },
      addNewDisplaysOptions: async () => {
        await useDisplayInfoArrayStore.getState().updateDisplayInfoArray();
        const displayInfoArray =
          useDisplayInfoArrayStore.getState().displayInfoArray;

        const newOptions = structuredClone(get().options);
        const idsInOptions = newOptions.displays.map((d) => d.id);
        const newDisplayInfoArray = displayInfoArray.filter(
          (d) => !idsInOptions.includes(d.id),
        );
        for (const d of newDisplayInfoArray) {
          newOptions.displays.push({
            id: d.id,
            name: d.name,
            ...getDefaultOptionsForDisplay(),
          });
        }

        set(() => ({
          options: { ...newOptions },
          restore: false,
        }));
      },
      resetOptions: async () => {
        const newOptions = await generateNewOptions();
        set(() => ({
          options: { ...newOptions },
          restore: false,
        }));
      },
    }),
    {
      name: "options",
      storage: createJSONStorage(() => storage),
    },
  ),
);
