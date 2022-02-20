import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import MyUser, { HealthWorker, Patient, RequestedUser } from "../classes/MyUser";
import { tabOrdering } from "../components/sidebar/Sidebar";
import useHealthWorkers from "../hooks/useHealthWorkers";
import useDevice, { DeviceType } from "../hooks/useIsSmartphone";
import useNotifListeners from "../hooks/useNotifListeners";
import usePatients from "../hooks/usePatients";
import useRequestedUsers from "../hooks/useRequestedUsers";
import useUser from "../hooks/useUser";
import useUserConfig from "../hooks/useUserConfig";
import "../styles/globals.css";
import { MonitorRequestNotif, RecordCommentNotif } from "../types/Notification";
import { UserConfig } from "../types/userConfig";

let pastTwoTabIndices: [number, number] = [-1, -1];

export const AppContext = React.createContext({
	pastTwoTabIndices,
	device: DeviceType.Smartphone,
	user: new MyUser(),
	userConfig: UserConfig.constructEmpty(),
	patients: [] as Patient[],
	requestedUsers: [] as RequestedUser[],
	healthWorkers: [] as HealthWorker[],
	monitorRequestNotifs: [] as MonitorRequestNotif[],
	recordCommentNotifs: [] as RecordCommentNotif[],
});

const updateTabIndices = (newIndex: number) => {
	if (pastTwoTabIndices[0] === newIndex) return pastTwoTabIndices;
	pastTwoTabIndices = [newIndex, pastTwoTabIndices[0]];
};

function MyApp({ Component, pageProps }: AppProps) {
	const { user } = useUser();
	const { healthWorkers } = useHealthWorkers(user);
	const { patients } = usePatients(user);
	const { requestedUsers } = useRequestedUsers(user);
	const { userConfig } = useUserConfig();
	const { device } = useDevice();
	const { monitorRequestNotifs, recordCommentNotifs } = useNotifListeners(user);
	const router = useRouter();
	const pathname = router.pathname;
	updateTabIndices(tabOrdering.indexOf(pathname));

	return (
		<AppContext.Provider
			value={{
				pastTwoTabIndices,
				device,
				user,
				userConfig,
				patients,
				requestedUsers,
				healthWorkers,
				monitorRequestNotifs,
				recordCommentNotifs,
			}}>
			<Component {...pageProps} />
		</AppContext.Provider>
	);
}

export default MyApp;
