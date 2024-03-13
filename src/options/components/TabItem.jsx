/* eslint-disable react/prop-types */
const TabItem = (props) => {
  return (
    <li
      className="text-center"
      onClick={() => {
        props.onClick(props.name);
      }}
    >
      <a
        className={
          "block mt-2 px-7 pb-3.5 pt-4 border-b-2 border-w-0 text-xs font-medium leading-tight uppercase cursor-pointer hover:bg-neutral-100 " +
          (props.name === props.activeTabName
            ? "hover:bg-neutral-100 text-primary border-sky-600 bg-gray-200"
            : "border-transparent text-neutral-500 bg-slate-200 opacity-60 hover:opacity-100")
        }
      >
        {props.name}
      </a>
    </li>
  );
};
export default TabItem;
