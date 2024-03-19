import { useDisplayInfoArrayStore, useOptionsStore } from "../../store/store";
import { getI18nMessage } from "../../utils/handleI18n";
import Button from "../components/Button";

const ButtonsLayout = () => {
  const updateDisplayInfoArray = useDisplayInfoArrayStore(
    (state) => state.updateDisplayInfoArray,
  );
  const resetOptions = useOptionsStore((state) => state.resetOptions);

  const updateDisplaysNames = useOptionsStore(
    (state) => state.updateDisplaysNames,
  );
  const addNewDisplaysOptions = useOptionsStore(
    (state) => state.addNewDisplaysOptions,
  );

  const handleClickUpdateDisplayInfoBtn = async () => {
    await updateDisplaysNames();
    await addNewDisplaysOptions();
  };

  const handleClickResetBtn = async () => {
    await updateDisplayInfoArray();
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
        onClick={handleClickResetBtn}
      />
    </div>
  );
};
export default ButtonsLayout;
