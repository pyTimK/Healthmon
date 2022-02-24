import { useEffect, useState } from "react";
import MyUser, { RequestedUser } from "../classes/MyUser";
import logError from "../function/logError";
import notify from "../function/notify";
import { FirebaseData } from "../pages/_app";

type useRequestedUsersType = (user: MyUser, data?: FirebaseData) => { requestedUsers: RequestedUser[] };

const useRequestedUsers: useRequestedUsersType = (user, data) => {
	const [requestedUsers, setRequestedUsers] = useState<RequestedUser[]>([]);

	const getRequestedUsersListener = (data: FirebaseData) => {
		try {
			const unsub = data.fireStoreHelper.requestedUsersListener(user, setRequestedUsers);
			return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get records online");
		}
		return () => {};
	};

	// TODO: move to serverside
	useEffect(() => {
		if (!data || user.id === "") return;
		console.log("useRequestedUsers accessed");
		return getRequestedUsersListener(data);
	}, [user, data]);

	return { requestedUsers: requestedUsers };
};

export default useRequestedUsers;
