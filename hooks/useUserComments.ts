import { useContext, useEffect, useState } from "react";
import MyUser from "../classes/MyUser";
import logError from "../function/logError";
import notify from "../function/notify";
import { AppContext } from "../pages/_app";
import UserComment from "../types/RecordComment";

type useUserCommentsType = (user: MyUser) => { userComments: UserComment[] };

const useUserComments: useUserCommentsType = (user) => {
	const { fireStoreHelper } = useContext(AppContext);
	const [userComments, setUserComments] = useState<UserComment[]>([]);

	//* Does not require reload on page to get updated data
	const getUserCommentsListener = () => {
		if (!fireStoreHelper) return;
		try {
			const unsub = fireStoreHelper.userCommentsListener(user, setUserComments);
			return () => {
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
