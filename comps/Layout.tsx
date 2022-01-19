import { NextPage } from "next";
import { useRouter } from "next/router";
import { useUser } from "../firebase/useUser";
import Sidebar from "./Sidebar";

const showPages = ["/", "/settings", "/account"];

const Layout: NextPage = ({ children }) => {
  const route = useRouter();
  const { user } = useUser();
  const showContent = user !== null || route.pathname === "/auth";
  const showSidebar = showPages.includes(route.pathname);

  if (!showContent) return <></>;

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

export default Layout;
