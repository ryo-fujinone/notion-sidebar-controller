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
  const removeOptionsForNonConnectedDisplays = useOptionsStore(
    (state) => state.removeOptionsForNonConnectedDisplays,
  );

  return (
    <>
      <div className="text-xs text-center">
        <Button
          text={getI18nMessage("updateDisplayInfo")}
          onClick={async () => {
            await updateDisplaysNames();
            await addNewDisplaysOptions();
          }}
        />
        <Button
          text={getI18nMessage("resetOptions")}
          onClick={async () => {
            await updateDisplayInfoArray();
            resetOptions();
          }}
        />
      </div>
      <div className="text-xs text-center mt-2">
        <Button
          text={getI18nMessage("removeOptionsForNonConnectedDisplays")}
          onClick={async () => {
            await removeOptionsForNonConnectedDisplays();
          }}
        />
      </div>
    </>
  );
};
export default ButtonsLayout;
