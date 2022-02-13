import { Unsubscribe } from "firebase/firestore";
import MyUser, { Patient } from "../classes/MyUser";
import { useEffect, useState } from "react";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import logError from "../function/logError";
import notify from "../function/notify";
import UserComment from "../types/RecordComment";

type useUserCommentsType = (user: MyUser) => { userComments: UserComment[] };

const useUserComments: useUserCommentsType = (user) => {
	const [userComments, setUserComments] = useState<UserComment[]>([]);

	//* Does not require reload on page to get updated data
	const getUserCommentsListener = () => {
		try {
			const unsub = FireStoreHelper.userCommentsListener(user, setUserComments);
			return () => {
				console.log("successfully unsubscribed to user comments");
				unsub();
			};
		} catch (_e) {
			logError(_e);
			notify("Could not get user comments online");
		}
		return () => {};
	};

	//TODO: move to serverside
	useEffect(() => {
		if (user.id === "") return;
		return getUserCommentsListener();
	}, [user]);

	return { userComments: userComments };
};

export default useUserComments;
