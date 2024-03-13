import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateNewOptions, getDefaultOptions } from "../utils/defaultOptions";
import { saveToStorage } from "../utils/handleStorage";

export const useDisplayInfoArrayStore = create((set) => ({
  displayInfoArray: [],
  updateDisplayInfoArray: (displayInfoArray) => {
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
    (set) => ({
      options: getDefaultOptions(),
      restore: false,
      updateOptions: (newOptions = {}, restore = false) => {
        set((state) => {
          return {
            options: { ...state.options, ...newOptions },
            restore: restore,
          };
        });
      },
      updateSpecificDisplayOptions: (id, key, value) => {
        set((state) => {
          const newOptions = structuredClone(state.options);
          const newDisplaysOptions = [];
          for (const d of state.options.displays) {
            if (id !== d.id) {
              newDisplaysOptions.push(d);
              continue;
            }
            d[key] = value;
            newDisplaysOptions.push(d);
          }
          newOptions.displays = newDisplaysOptions;
          return {
            options: { ...newOptions },
            restore: false,
          };
        });
      },
      resetOptions: async () => {
        const newOptions = await generateNewOptions();
        set(() => {
          return {
            options: { ...newOptions },
            restore: false,
          };
        });
      },
    }),
    {
      name: "options",
      storage: createJSONStorage(() => storage),
    },
  ),
);
