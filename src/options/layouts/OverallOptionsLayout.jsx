import { useOptionsStore } from "../../store/store";
import { getI18nMessage } from "../../utils/handleI18n";
import ContentWrapper from "../components/ContentWrapper";

const OverallOptionsLayout = () => {
  const options = useOptionsStore((state) => state.options);
  const updateOptions = useOptionsStore((state) => state.updateOptions);
  const updateSpecificDisplayOptions = useOptionsStore(
    (state) => state.updateSpecificDisplayOptions,
  );

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

        <ul className="list-disc ml-4">
          <li className="marker:text-gray-700">
            <p className="mb-1">{getI18nMessage("deleteRightSidebarFlag")}</p>
            {options.displays.map((d) => {
              const _label = `deleteRightSidebarFlag_${d.id}`;
              return (
                <div key={d.id}>
                  <input
                    type="checkbox"
                    id={_label}
                    name={d.id}
                    className="mr-1 align-middle"
                    onChange={(e) => {
                      updateSpecificDisplayOptions(
                        d.id,
                        "deleteRightSidebarFlag",
                        e.target.checked,
                      );
                    }}
                    checked={d.deleteRightSidebarFlag}
                  />
                  <label htmlFor={_label} className="align-middle">
                    {d.name} (ID:{d.id})
                  </label>
                </div>
              );
            })}
          </li>
        </ul>
      </div>
    </ContentWrapper>
  );
};
export default OverallOptionsLayout;
