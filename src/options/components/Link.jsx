/* eslint-disable react/prop-types */
const Link = (props) => {
  const { url, text } = props;
  return (
    <a href={url} className=" text-sky-600 hover:text-sky-500">
      {text ? text : url}
    </a>
  );
};
export default Link;
