import { useDisplayInfoArrayStore, useOptionsStore } from "../../store/store";
import { getDefaultOptionsForDisplay } from "../../utils/defaultOptions";
import { getDisplayInfoArray } from "../../utils/handleDisplay";
import { getI18nMessage } from "../../utils/handleI18n";
import Button from "../components/Button";

const ButtonsLayout = () => {
  const updateDisplayInfoArray = useDisplayInfoArrayStore(
    (state) => state.updateDisplayInfoArray,
  );
  const updateOptions = useOptionsStore((state) => state.updateOptions);
  const options = useOptionsStore((state) => state.options);
  const resetOptions = useOptionsStore((state) => state.resetOptions);

  const handleClickUpdateDisplayInfoBtn = async () => {
    const displayInfoArray = await getDisplayInfoArray();
    updateDisplayInfoArray(displayInfoArray);

    const newOptions = structuredClone(options);
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

    // Generate options for displays connected for the first time.
    const idsInOptions = newDisplaysOptions.map((d) => d.id);
    const _newDisplayInfoArray = displayInfoArray.filter(
      (d) => !idsInOptions.includes(d.id),
    );
    for (const d of _newDisplayInfoArray) {
      newDisplaysOptions.push({
        id: d.id,
        name: d.name,
        ...getDefaultOptionsForDisplay(),
      });
    }

    newOptions.displays = newDisplaysOptions;
    updateOptions(newOptions);
  };

  const handletClickResetBtn = async () => {
    const displayInfoArray = await getDisplayInfoArray();
    updateDisplayInfoArray(displayInfoArray);
    resetOptions();
  };

  return (
    <div className="text-xs text-center">
      <Button
        text={getI18nMessage("updateDisplayInfo")}
        onClick={handleClickUpdateDisplayInfoBtn}
      />
      <Button
        text={getI18nMessage("resetOptions")}
        onClick={handletClickResetBtn}
      />
    </div>
  );
};
export default ButtonsLayout;
