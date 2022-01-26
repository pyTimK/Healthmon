import { NextPage } from "next";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";

const showSidebarPages = ["/", "/settings", "/account"];

const Layout: NextPage = ({ children }) => {
  const route = useRouter();
  const path = route.pathname;

  const showSidebar = showSidebarPages.includes(path);
  // const showContent = user !== null || path === "/auth";

  // if (!showContent) return <div></div>;

  if (showSidebar)
    return (
      <div>
        <Sidebar />
        <div className='content-wrapper'>
          <div className='content'>{children}</div>
        </div>
      </div>
    );

  return <>{children}</>;
};

export default Layout;
