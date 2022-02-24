import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { CookieKeys, CookiesHelper } from "../classes/CookiesHelper";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import MyUser, { HealthWorker, Patient, RequestedUser } from "../classes/MyUser";
import { tabOrdering } from "../components/sidebar/Sidebar";
import initFirebase, { initFirebaseAuth } from "../firebase/initFirebase";
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

const fetcher = async () => {
	const { db, fireStoreHelper } = await initFirebase();
	const { auth } = initFirebaseAuth();
	return { db, auth, fireStoreHelper };
};

export interface FirebaseData {
	db: Firestore;
	auth: Auth;
	fireStoreHelper: FireStoreHelper;
}

export const AppContext = React.createContext({
	db: undefined as Firestore | undefined,
	auth: undefined as Auth | undefined,
	fireStoreHelper: undefined as FireStoreHelper | undefined,
	pastTwoTabIndices,
	device: DeviceType.Smartphone,
	user: new MyUser(),
	userConfig: UserConfig.constructEmpty(),
	patients: [] as Patient[],
	requestedUsers: [] as RequestedUser[],
	healthWorkers: [] as HealthWorker[],
	monitorRequestNotifs: [] as MonitorRequestNotif[],
	recordCommentNotifs: [] as RecordCommentNotif[],
	setId: null as React.Dispatch<React.SetStateAction<string>> | null,
});

const updateTabIndices = (newIndex: number) => {
	if (pastTwoTabIndices[0] === newIndex) return pastTwoTabIndices;
	pastTwoTabIndices = [newIndex, pastTwoTabIndices[0]];
};

function MyApp({ Component, pageProps }: AppProps) {
	// const { data, error } = useSWR("firebase", fetcher);
	const [id, setId] = useState(CookiesHelper.get(CookieKeys.id, ""));
	const [data, setData] = useState<FirebaseData>();

	const fetcher = async () => {
		const result = await initFirebase();
		const { auth } = initFirebaseAuth();
		setData({ ...result, auth });
	};

	useEffect(() => {
		fetcher();
	}, []);

	useEffect(() => {
		console.log("ID changed", id);
		if (id === "") {
			if (router.pathname !== "/auth" && router.pathname !== "/register") router.replace("/auth");
			return;
		}
		if (!data) return;
		const { auth } = initFirebaseAuth();
		setData({ db: data.db, fireStoreHelper: data.fireStoreHelper, auth });
	}, [id]);

	const { user } = useUser(data);
	const { healthWorkers } = useHealthWorkers(user, data);
	const { patients } = usePatients(user, data);
	const { requestedUsers } = useRequestedUsers(user, data);
	const { userConfig } = useUserConfig(data);
	const { monitorRequestNotifs, recordCommentNotifs } = useNotifListeners(user, data);

	const { device } = useDevice();
	const router = useRouter();
	const pathname = router.pathname;
	updateTabIndices(tabOrdering.indexOf(pathname));

	if (!data) return <div></div>;

	return (
		<AppContext.Provider
			value={{
				db: data.db,
				auth: data.auth,
				fireStoreHelper: data.fireStoreHelper,
				pastTwoTabIndices,
				device,
				user,
				userConfig,
				patients,
				requestedUsers,
				healthWorkers,
				monitorRequestNotifs,
				recordCommentNotifs,
				setId,
			}}>
			<Component {...pageProps} />
		</AppContext.Provider>
	);
}

export default MyApp;
