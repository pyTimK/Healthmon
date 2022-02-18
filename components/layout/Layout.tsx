import { NextPage } from "next";
import Head from "next/head";
import { useContext } from "react";
import { AppContext } from "../../pages/_app";
import Sidebar from "../sidebar/Sidebar";
import Sizedbox from "../Sizedbox";
import styles from "./Layout.module.css";

interface LayoutProps {
	title: string;
	description: string;
	showSidebar?: boolean;
	header?: React.ReactNode;
}

const Layout: NextPage<LayoutProps> = ({ title, description, showSidebar = true, children, header }) => {
	// const user = CookiesHelper.get("user", new MyUser());
	const { isSmartphone } = useContext(AppContext);
	// if (user.id === "") return <></>;

	return (
		<div className={styles.container}>
			<Head>
				<title>{title}</title>
				<meta name='description' content={description} />
			</Head>

			{showSidebar && <Sidebar />}
			{header}
			<div className={styles.contentWrapper}>
				<div className={styles.content}>
					<div>{children}</div>
				</div>
				{isSmartphone ? <Sizedbox height={50} /> : <footer className={styles.footer}>© 2022 Healthmon</footer>}
			</div>
		</div>
	);
};

export default Layout;
