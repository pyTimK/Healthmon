import { Unsubscribe } from "firebase/firestore";
import MyUser, { RequestedUser } from "../classes/MyUser";
import { useEffect, useState } from "react";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import logError from "../function/logError";
import notify from "../function/notify";

type useRequestedUsersType = (user?: MyUser) => { requestedUsers: RequestedUser[] };

const useRequestedUsers: useRequestedUsersType = (user) => {
	if (!user) return { requestedUsers: [] };

	const [requestedUsers, setRequestedUsers] = useState<RequestedUser[]>([]);

	//* Does not require reload on page to get updated data
	const getRequestedUsersListener = () => {
		try {
			const unsub = FireStoreHelper.requestedUsersListener(user, setRequestedUsers);
			return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get records online");
		}
		return () => {};
	};

	//* Requires reload on page to get updated data
	const getRequestedUsersData = async () => {
		try {
			const fetchedRequestedUsers = await FireStoreHelper.getRequestedUsers(user);
			setRequestedUsers(fetchedRequestedUsers);
		} catch (_e) {
			logError(_e);
			notify("Could not fetch data online");
		}
	};

	// TODO: move to serverside
	useEffect(() => {
		//getRequestedUsersData();
		return getRequestedUsersListener();
	}, []);

	return { requestedUsers: requestedUsers };
};

export default useRequestedUsers;
