import { useLayoutEffect } from "react";
import { useDisplayInfoArrayStore, useOptionsStore } from "../store/store";
import { generateNewOptions } from "../utils/defaultOptions";
import { attemptToRestoreOptions } from "../utils/handleDisplay";
import { getFromStorage } from "../utils/handleStorage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import TabLayout from "./layouts/TabLayout";

const Options = () => {
  const updateDisplayInfoArray = useDisplayInfoArrayStore(
    (state) => state.updateDisplayInfoArray,
  );
  const updateOptions = useOptionsStore((state) => state.updateOptions);
  const updateDisplaysNames = useOptionsStore(
    (state) => state.updateDisplaysNames,
  );
  const updateDisplayBounds = useOptionsStore(
    (state) => state.updateDisplayBounds,
  );
  const addNewDisplaysOptions = useOptionsStore(
    (state) => state.addNewDisplaysOptions,
  );

  useLayoutEffect(() => {
    (async () => {
      await updateDisplayInfoArray();

      const result = await getFromStorage("options");
      let options = result.options;
      let restore = true;
      if (!options) {
        options = await generateNewOptions();
        restore = false;
      }
      updateOptions(options, restore);
      await updateDisplayBounds();

      if (restore) {
        await updateDisplaysNames();
        if (options.attemptToRestoreOptions) {
          const newOptions = await attemptToRestoreOptions();
          if (newOptions) {
            updateOptions(newOptions, false);
          }
        }
        await addNewDisplaysOptions();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <TabLayout />
      <Footer />
    </>
  );
};
export default Options;
