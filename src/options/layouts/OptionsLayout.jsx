import ButtonsLayout from "./ButtonsLayout";
import DisplayOptionsLayout from "./DisplayOptionsLayout";
import OverallOptionsLayout from "./OverallOptionsLayout";

const OptionsLayout = () => {
  return (
    <div>
      <DisplayOptionsLayout />
      <OverallOptionsLayout />
      <ButtonsLayout />
    </div>
  );
};
export default OptionsLayout;
