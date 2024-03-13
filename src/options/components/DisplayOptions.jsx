import { useDisplayInfoArrayStore } from "../../store/store";
import { getI18nMessage } from "../../utils/handleI18n";

/* eslint-disable react/prop-types */
const DisplayOptions = ({ options, updateSpecificDisplayOptions }) => {
  const { id, name, sidebarState, preventSidebarOnHover } = options;
  const displayInfoArray = useDisplayInfoArrayStore(
    (state) => state.displayInfoArray,
  );
  if (!displayInfoArray) {
    return <></>;
  }
  const displayInfo = displayInfoArray.find((d) => id === d.id);
  if (!displayInfo?.isEnabled) {
    return <></>;
  }

  const bounds = displayInfo.bounds;
  const label1 = `selectSidebarState_${id}`;
  const label2 = `preventSidebarOnHover_${id}`;

  return (
    <li className="mb-1 marker:text-gray-700">
      <span>{name}</span>
      <p>
        (
        {`width: ${bounds.width}, height: ${bounds.height}, left: ${bounds.left}, top: ${bounds.top}`}
        )
      </p>

      <div className="ml-4">
        <ul className="list-disc ml-1">
          <li>
            <label htmlFor={label1}>{getI18nMessage("sidebarState")}</label>
            <select
              id={label1}
              name={label1}
              className="block bg-gray-50"
              value={sidebarState}
              onChange={(e) => {
                updateSpecificDisplayOptions(
                  id,
                  "sidebarState",
                  e.target.value,
                );
              }}
            >
              <option value="default">
                {getI18nMessage("sidebarState_default")}
              </option>
              <option value="open">
                {getI18nMessage("sidebarState_open")}
              </option>
              <option value="close">
                {getI18nMessage("sidebarState_close")}
              </option>
            </select>
          </li>
        </ul>
      </div>

      <div>
        <input
          type="checkbox"
          id={label2}
          name={label2}
          className="mr-1 align-middle"
          onChange={(e) => {
            updateSpecificDisplayOptions(
              id,
              "preventSidebarOnHover",
              e.target.checked,
            );
          }}
          checked={preventSidebarOnHover}
        />
        <label htmlFor={label2} className="align-middle">
          {getI18nMessage("preventSidebarOnHover")}
        </label>
      </div>
    </li>
  );
};
export default DisplayOptions;
