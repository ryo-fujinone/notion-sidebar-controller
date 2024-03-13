/* eslint-disable react/prop-types */
const TabContent = (props) => {
  return <div className={props.show ? "" : "hidden"}>{props.children}</div>;
};
export default TabContent;
