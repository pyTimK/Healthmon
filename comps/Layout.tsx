import { CookiesHelper } from "../classes/CookiesHelper";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useUser } from "../firebase/useUser";
import ChooseRole from "./ChooseRole";
import Sidebar from "./Sidebar";
import { useState } from "react";

const showPages = ["/", "/settings", "/account"];

// interface ILayoutComponentProps {
//   isPatientString?: string;

// }
//const Layout: NextPage<ILayoutComponentProps> = ({ children, isPatientString }) => {

const Layout: NextPage = ({ children }) => {
  const { user } = useUser();
  const route = useRouter();
  const path = route.pathname;

  const [isPatient, setIsPatient] = useState(() => CookiesHelper.get("isPatient", "") as boolean | "");
  console.log("isPatient ", isPatient);
  const chooseRole = isPatient === "";

  const showSidebar = showPages.includes(path) && !chooseRole;
  const showContent = user !== null || path === "/auth";

  if (!showContent) return <></>;

  if (chooseRole) return <ChooseRole setIsPatient={setIsPatient} />;

  return showSidebar ? (
    <div>
      <Sidebar />
      <div className='content-wrapper'>
        <div className='content'>{children}</div>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
};

// Layout.getInitialProps = async (context) => {
//   const cookies = CookiesHelper.parseCookies(context.req);

//   return {
//     isPatientString: cookies.isPatient,
//   };
// };

export default Layout;
