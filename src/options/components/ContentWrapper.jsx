/* eslint-disable react/prop-types */
const ContentWrapper = (props) => {
  return (
    <div className="border-b border-dotted border-black pb-3 mb-3">
      {props.children}
    </div>
  );
};
export default ContentWrapper;
