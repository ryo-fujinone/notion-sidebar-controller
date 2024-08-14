import { useLayoutEffect, useState } from "react";
import Link from "../components/Link";

const CreditsLayout = () => {
  const [licenses, setLicenses] = useState({});
  useLayoutEffect(() => {
    (async () => {
      const licensesUrl = chrome.runtime.getURL("licenses.json");
      const response = await fetch(licensesUrl);
      setLicenses(await response.json());
    })();
  }, []);

  return (
    <div>
      <ul className="list-disc ml-4 text-base">
        {Object.keys(licenses).map((k) => {
          return licenses[k].map((p, i) => {
            return (
              <li key={i}>
                <p>{`${p.name}@${p.versions[0]}`}</p>
                {p.author ? <p>Author: {p.author}</p> : ""}
                {p.license ? <p>License: {p.license}</p> : ""}
                {p.homepage ? (
                  <p>
                    Home page: <Link url={p.homepage} text="link" />
                  </p>
                ) : (
                  ""
                )}
              </li>
            );
          });
        })}
        <li>
          <p>{"Extension's Icon"}</p>
          <p>
            Link:{" "}
            <Link url="https://icons8.com/icon/111038/n" text="icons8.com" />
          </p>
        </li>
      </ul>
    </div>
  );
};
export default CreditsLayout;
