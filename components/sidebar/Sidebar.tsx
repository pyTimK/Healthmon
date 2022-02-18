import styles from "./Sidebar.module.css";
import Link from "next/link";
import Sizedbox from "../Sizedbox";
import Divider from "../Divider";
import { NextComponentType } from "next";
import SettingsLogo from "../icons/SettingsLogo";
import DashboardLogo from "../icons/DashboardLogo";
import AccountLogo from "../icons/AccountLogo";
import { useRouter } from "next/router";
import AboutLogo from "../icons/AboutLogo";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../pages/_app";

const logoSize = 32;
const iconSize = 24;
const padding = 40;

export const tabOrdering = ["/", "/settings", "/account", "/about"];

const Sidebar: NextComponentType = () => {
	const router = useRouter();
	const pathname = router.pathname;
	const { pastTwoTabIndices, isSmartphone } = useContext(AppContext);
	// const [tabIndex, setTabIndex] = useState(pastTwoTabIndices[0]);
	// console.log(pastTwoTabIndices);

	// useEffect(() => {
	// 	console.log("pastTwoTabIndices changed: ", pastTwoTabIndices);
	// }, [pastTwoTabIndices]);

	console.log(pastTwoTabIndices);

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
				<motion.div
					key={pastTwoTabIndices[1]}
					animate={
						isSmartphone
							? { top: 0, left: 90 * pastTwoTabIndices[0] }
							: { left: "auto", top: 60 * pastTwoTabIndices[0] }
					}
					initial={
						pastTwoTabIndices[1] === -1
							? undefined
							: isSmartphone
							? { top: 0, left: Math.max(0, 90 * pastTwoTabIndices[1]) }
							: { left: "auto", top: Math.max(0, 60 * pastTwoTabIndices[1]) }
					}
					// transition={{ delay: 1000 }}
					// transition={{ duration: 0.2, ease: [0.17, 0.67, 0.83, 0.67] }}
					className={styles.selectedBarWrapper}>
					<div className={styles.selectedBar} />
				</motion.div>
				<Tab>
					<DashboardLogo selected={pathname === "/"} />
				</Tab>
				<Tab link='/settings'>
					<SettingsLogo selected={pathname === "/settings"} />
				</Tab>
				<Tab link='/account'>
					<AccountLogo selected={pathname === "/account"} />
				</Tab>
				<Tab link='/about'>
					<AboutLogo selected={pathname === "/about"} />
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
