import { useRouter } from "next/router";
import { CookiesHelper } from "../../classes/CookiesHelper";
import { auth } from "../../firebase/initFirebase";

const useAccount = () => {
	const router = useRouter();

	const logout = async () => {
		try {
			await auth.signOut();
			CookiesHelper.clear();
			router.replace("/auth");
		} catch (_e: any) {
			const e: Error = _e;
			console.log(e.message);
		}
	};

	return { logout };
};

export default useAccount;
