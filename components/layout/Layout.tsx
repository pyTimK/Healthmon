import { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../sidebar/Sidebar";
import styles from "./Layout.module.css";

interface LayoutProps {
	title: string;
	description: string;
	showSidebar?: boolean;
}

const Layout: NextPage<LayoutProps> = ({ title, description, showSidebar = true, children }) => {
	// const user = CookiesHelper.get("user", new MyUser());

	// if (user.id === "") return <></>;

	return (
		<div className={styles.container}>
			<Head>
				<title>{title}</title>
				<meta name='description' content={description} />
			</Head>
			{showSidebar && <Sidebar />}
			<div className={styles.contentWrapper}>
				<div className={styles.content}>
					<div>{children}</div>
				</div>
				<footer className={styles.footer}>
					<a href='https://healthmonmikee.web.app/' target='_blank' rel='noopener noreferrer'>
						© 2022 Healthmon
					</a>
				</footer>
			</div>
		</div>
	);
};

export default Layout;
