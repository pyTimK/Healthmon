import { useRouter } from "next/router";
import { auth } from "../firebase/initFirebase";

const useAccount = () => {
	const router = useRouter();

	const logout = async () => {
		try {
			await auth.signOut();
			router.replace("/auth");
		} catch (_e: any) {
			const e: Error = _e;
			console.log(e.message);
		}
	};

	return { logout };
};

export default useAccount;
