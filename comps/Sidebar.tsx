import styles from "../styles/Sidebar.module.css";
import Link from "next/link";
import Sizedbox from "./Sizedbox";
import Divider from "./Divider";
import { NextComponentType } from "next";
import SettingsLogo from "./sidebar/SettingsLogo";
import DashboardLogo from "./sidebar/DashboardLogo";
import AccountLogo from "./sidebar/AccountLogo";
import { useRouter } from "next/router";

const logoSize = 32;
const iconSize = 24;
const padding = 40;

const Sidebar: NextComponentType = () => {
  const router = useRouter();
  const pathname = router.pathname;
  return (
    <div className={styles.content}>
      <Sizedbox height={padding} />
      <div className={styles.logoWrapper}>
        <img src='/img/icons/icon.png' alt='icon' width={logoSize} height={logoSize} />
      </div>
      <Sizedbox height={padding} />
      <Divider />
      <Sizedbox height={padding} />
      <div className={styles.tabs}>
        <Tab>
          <DashboardLogo selected={pathname === "/"} />
        </Tab>
        <Tab link='/settings'>
          <SettingsLogo selected={pathname === "/settings"} />
        </Tab>
        <Tab link='/account'>
          <AccountLogo selected={pathname === "/account"} />
        </Tab>
      </div>
    </div>
  );
};

interface TabProps {
  link?: string;
}

const Tab: React.FC<TabProps> = ({ link = "/", children }) => {
  return (
    <div className={styles.tab}>
      <Link href={link}>
        <a>{children}</a>
      </Link>
    </div>
  );
};

export default Sidebar;