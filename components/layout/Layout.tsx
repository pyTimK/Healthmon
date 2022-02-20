import clsx from "clsx";
import { NextPage } from "next";
import Head from "next/head";
import { useContext } from "react";
import { DeviceType } from "../../hooks/useIsSmartphone";
import { AppContext } from "../../pages/_app";
import Sidebar from "../sidebar/Sidebar";
import Sizedbox from "../Sizedbox";
import styles from "./Layout.module.css";

interface LayoutProps {
	title: string;
	description: string;
	showSidebar?: boolean;
	hideSideBar?: boolean;
	header?: React.ReactNode;
}

const Layout: NextPage<LayoutProps> = ({
	title,
	description,
	showSidebar = true,
	hideSideBar = false,
	children,
	header,
}) => {
	// const user = CookiesHelper.get("user", new MyUser());

	const { device } = useContext(AppContext);
	// if (user.id === "") return <></>;

	return (
		<div className={styles.container}>
			<Head>
				<title>{title}</title>
				<meta name='description' content={description} />
			</Head>

			{showSidebar && (
				<div className={clsx(hideSideBar && "hidden")}>
					<Sidebar />
				</div>
			)}
			{header}
			<div className={styles.contentWrapper}>
				<div className={styles.content}>
					<div>{children}</div>
				</div>
				{device === DeviceType.Smartphone ? (
					<Sizedbox height={50} />
				) : (
					<footer className={styles.footer}>© 2022 Healthmon</footer>
				)}
			</div>
		</div>
	);
};

export default Layout;
