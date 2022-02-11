import { Unsubscribe } from "firebase/firestore";
import MyUser, { RequestedUser } from "../classes/MyUser";
import { useEffect, useState } from "react";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import logError from "../function/logError";
import notify from "../function/notify";

type useRequestedUsersType = (user: MyUser) => { requestedUsers: RequestedUser[] };

const useRequestedUsers: useRequestedUsersType = (user) => {
	const [requestedUsers, setRequestedUsers] = useState<RequestedUser[]>([]);

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

	// TODO: move to serverside
	useEffect(() => {
		if (user.id === "") return;
		console.log("useRequestedUsers accessed");
		return getRequestedUsersListener();
	}, [user]);

	return { requestedUsers: requestedUsers };
};

export default useRequestedUsers;
