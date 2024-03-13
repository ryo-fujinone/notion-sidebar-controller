import { useLayoutEffect } from "react";
import { useDisplayInfoArrayStore, useOptionsStore } from "../store/store";
import { generateNewOptions } from "../utils/defaultOptions";
import { getDisplayInfoArray } from "../utils/handleDisplay";
import { getFromStorage } from "../utils/handleStorage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import TabLayout from "./layouts/TabLayout";

const Options = () => {
  const updateDisplayInfoArray = useDisplayInfoArrayStore(
    (state) => state.updateDisplayInfoArray,
  );
  const updateOptions = useOptionsStore((state) => state.updateOptions);

  useLayoutEffect(() => {
    (async () => {
      const result = await getFromStorage("options");
      let options = result.options;
      const displayInfoArray = await getDisplayInfoArray();
      updateDisplayInfoArray(displayInfoArray);

      let restore = true;
      if (!options) {
        options = await generateNewOptions();
        restore = false;
      }
      updateOptions(options, restore);
    })();
  }, [updateDisplayInfoArray, updateOptions]);

  return (
    <>
      <Header />
      <TabLayout />
      <Footer />
    </>
  );
};
export default Options;
