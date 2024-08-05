/* eslint-disable react/prop-types */
const Button = (props) => {
  return (
    <button
      className="bg-gray-100 hover:bg-gray-200 active:bg-neutral-300 text-gray-800 py-1 px-4 mx-1 border border-gray-400 rounded shadow"
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};
export default Button;
