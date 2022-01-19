import { NextPage } from "next";
import Sidebar from "./Sidebar";

const Layout: NextPage = ({ children }) => {
  return (
    <div>
      <Sidebar />
      <div className='content-wrapper'>
        <div className='content'>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
