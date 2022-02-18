import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import { tabOrdering } from "../components/sidebar/Sidebar";
import useIsSmartphone from "../hooks/useIsSmartphone";
import "../styles/globals.css";

let pastTwoTabIndices: [number, number] = [-1, -1];

export const AppContext = React.createContext({ pastTwoTabIndices, isSmartphone: true });

const updateTabIndices = (newIndex: number) => {
	if (pastTwoTabIndices[0] === newIndex) return pastTwoTabIndices;

	pastTwoTabIndices = [newIndex, pastTwoTabIndices[0]];
};

function MyApp({ Component, pageProps }: AppProps) {
	const { isSmartphone } = useIsSmartphone();
	const router = useRouter();
	const pathname = router.pathname;
	updateTabIndices(tabOrdering.indexOf(pathname));

	return (
		<AppContext.Provider value={{ pastTwoTabIndices, isSmartphone }}>
			<Component {...pageProps} />
		</AppContext.Provider>
	);
}

export default MyApp;
