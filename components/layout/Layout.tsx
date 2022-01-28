import { NextPage } from "next";
import { useRouter } from "next/router";
import { CookiesHelper } from "../../classes/CookiesHelper";
import MyUser from "../../types/myUser";
import Sidebar from "../sidebar/Sidebar";
import Head from "next/head";
import styles from "./Layout.module.css";

interface LayoutProps {
	title: string;
	description: string;
	showSidebar?: boolean;
}

const Layout: NextPage<LayoutProps> = ({ title, description, showSidebar = true, children }) => {
	const route = useRouter();
	const user = CookiesHelper.get("user", new MyUser());
	const path = route.pathname;

	// const showContent = user !== null || path === "/auth";

	// if (!showContent) return <div></div>;
	if (user.id === "") return <></>;

	return (
		<div className={styles.container}>
			<Head>
				<title>{title}</title>
				<meta name='description' content={description} />
			</Head>
			{showSidebar && <Sidebar />}
			<div className={styles.contentWrapper}>
				<div className={styles.content}>
					<div className='content'>{children}</div>
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