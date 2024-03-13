import Link from "../components/Link";

const AboutLayout = () => {
  return (
    <div>
      <ul className="list-disc ml-4 text-base">
        <li>
          <p>Made by Ryo Fujinone</p>
        </li>
        <li>
          <Link
            url="https://github.com/ryo-fujinone/notion-sidebar-controller"
            text="GitHub"
          />
        </li>
        <li>
          <Link url="https://ryo-fujinone.net/blog/" text="Blog" />
        </li>
        <li>
          <Link
            url="https://twitter.com/ryo_fujinone"
            text="X (@ryo_fujinone)"
          />
        </li>
      </ul>
    </div>
  );
};
export default AboutLayout;
