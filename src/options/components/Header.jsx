import { getI18nMessage } from "../../utils/handleI18n";

const Header = () => {
  return (
    <header className="text-center border-b border-black border-dotted mb-5">
      <h1 className="text-4xl font-bold my-5">
        {getI18nMessage("extensionName")}
      </h1>
    </header>
  );
};
export default Header;
