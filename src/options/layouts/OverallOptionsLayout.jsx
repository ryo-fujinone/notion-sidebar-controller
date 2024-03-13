import { useOptionsStore } from "../../store/store";
import { getI18nMessage } from "../../utils/handleI18n";
import ContentWrapper from "../components/ContentWrapper";

const OverallOptionsLayout = () => {
  const options = useOptionsStore((state) => state.options);
  const updateOptions = useOptionsStore((state) => state.updateOptions);

  return (
    <ContentWrapper>
      <div>
        <ul className="list-disc ml-4">
          <li className="marker:text-gray-700">
            <p className="mb-1">{getI18nMessage("waitTimeForSidebar")}</p>
            <input
              type="number"
              name="waitTimeForSidebar"
              className="w-14 bg-gray-50"
              onChange={(e) => {
                updateOptions({
                  waitTimeForSidebar: parseInt(e.target.value),
                });
              }}
              value={options.waitTimeForSidebar}
            ></input>
            <span className="ml-1">{getI18nMessage("millisecond")}</span>
          </li>
        </ul>
      </div>
    </ContentWrapper>
  );
};
export default OverallOptionsLayout;
