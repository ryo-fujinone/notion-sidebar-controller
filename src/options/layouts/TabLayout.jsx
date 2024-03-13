import { useState } from "react";
import TabContent from "../components/TabContent";
import TabItem from "../components/TabItem";
import AboutLayout from "./AboutLayout";
import CreditsLayout from "./CreditsLayout";
import OptionsLayout from "./OptionsLayout";

const Tab = () => {
  const [activeTabName, setActiveTabName] = useState("Options");

  const handleClick = (tabName) => {
    if (tabName === activeTabName) return;
    setActiveTabName(tabName);
  };

  return (
    <div className="flex items-start">
      <ul className="flex flex-col">
        <TabItem
          name="Options"
          activeTabName={activeTabName}
          onClick={handleClick}
        />
        <TabItem
          name="About"
          activeTabName={activeTabName}
          onClick={handleClick}
        />
        <TabItem
          name="Credits"
          activeTabName={activeTabName}
          onClick={handleClick}
        />
      </ul>

      <div className="my-2 ml-4 text-base">
        <TabContent show={activeTabName === "Options"}>
          <OptionsLayout />
        </TabContent>
        <TabContent show={activeTabName === "About"}>
          <AboutLayout />
        </TabContent>
        <TabContent show={activeTabName === "Credits"}>
          <CreditsLayout />
        </TabContent>
      </div>
    </div>
  );
};
export default Tab;
