import { useOptionsStore } from "../../store/store";
import ContentWrapper from "../components/ContentWrapper";
import DisplayOptions from "../components/DisplayOptions";

const DisplayOptionsLayout = () => {
  const options = useOptionsStore((state) => state.options);
  const updateSpecificDisplayOptions = useOptionsStore(
    (state) => state.updateSpecificDisplayOptions,
  );
  return (
    <ContentWrapper>
      <ul className="list-disc ml-4">
        {options.displays.map((d) => {
          return (
            <DisplayOptions
              key={d.id}
              options={d}
              updateSpecificDisplayOptions={updateSpecificDisplayOptions}
              showAllDisplayOptions={options.showAllDisplayOptions}
            />
          );
        })}
      </ul>
    </ContentWrapper>
  );
};
export default DisplayOptionsLayout;
