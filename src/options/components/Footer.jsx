import { getI18nMessage } from "../../utils/handleI18n";
import { getFromManifest } from "../../utils/handleManifest";

const Footer = () => {
  return (
    <footer className="text-center text-sm mt-5 pt-3.5 border-t border-black border-dotted">
      <span>{getI18nMessage("extensionName")}</span>
      <span> v{getFromManifest("version")}</span>
    </footer>
  );
};
export default Footer;
