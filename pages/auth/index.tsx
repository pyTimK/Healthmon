import clsx from "clsx";
import { User } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { doc, getDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { CircleLoader, PuffLoader, RingLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import { CookiesHelper } from "../../classes/CookiesHelper";
import MyUser from "../../classes/MyUser";
import BackgroundBlob from "../../components/backgroundBlob/BackgroundBlob";
import { DeviceType } from "../../hooks/useIsSmartphone";
import { AppContext } from "../_app";
import styles from "./Auth.module.css";

const SignInScreen: NextPage = () => {
	const { auth, db, fireStoreHelper, setId, device } = useContext(AppContext);
	const [authUser, setAuthUser] = useState<User | null>(null);
	const router = useRouter();
	const avatarSize = device === DeviceType.Smartphone ? 80 : 150;
	const [loading, setLoading] = useState(false);

	const firestoreUserRecordChecker = async (authUser: User) => {
		if (!db || !fireStoreHelper) return;

		setLoading(true);

		const snapshot = await getDoc(doc(db, "users", authUser.uid));
		CookiesHelper.set("id", authUser.uid);

		if (snapshot.exists()) {
			if (setId) setId(authUser.uid);
			router.replace("/");
		} else {
			//* Go to registration if first time logging in
			const myUser = MyUser.fromFirebaseUser(authUser);
			//TODO must not block for 2 seconds in auth page -> register page
			await fireStoreHelper.setUser(myUser);
			await fireStoreHelper.createUserConfig(authUser.uid);
			if (setId) setId(authUser.uid);
			router.replace("/register");
		}
	};

	useEffect(() => {
		if (authUser) firestoreUserRecordChecker(authUser);
	}, [authUser]);

	const uiConfig = {
		// Popup signin flow rather than redirect flow.
		signInFlow: "popup",
		// Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
		// signInSuccessUrl: "/",
		signInOptions: [
			{
				provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
				requiredDisplayName: true,
			},
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			// firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			// firebase.auth.FacebookAuthProvider.PROVIDER_ID,
		],
		callbacks: {
			signInSuccessWithAuthResult: (authResult: firebase.auth.UserCredential, redirectUrl: string) => {
				if (authResult.user) {
					setAuthUser(authResult.user as User);

					// return true;
				}
				return false;
			},
			// signInFailure: (error: ErrorCallback) => {
			//   return false;
			// },
		},
	};

	return (
		<AnimatePresence exitBeforeEnter>
			<motion.div className={styles.container} exit={{ opacity: 0 }} transition={{ duration: 3 }}>
				<div className={styles.logo}>
					<div style={{ width: avatarSize, height: avatarSize }}>
						<img src='/img/icons/apple-touch-icon.png' alt='logo' width={avatarSize} />
					</div>
					<BackgroundBlob avatarSize={avatarSize} />
				</div>
				<h1>{loading ? "Loading" : "Welcome"}</h1>
				<p className={styles.p1}>{loading ? "" : "Please sign-in using one of the following methods"}</p>
				{loading ? (
					<div className={styles.loading}>
						<RingLoader color='var(--pink)' loading={loading} size={150} />
					</div>
				) : (
					<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
				)}
				<ToastContainer theme='colored' autoClose={2} closeButton={false} />
				<img src='/img/svg/balls/pinkball.svg' alt='pink ball' className={styles.pinkball} />
				<img src='/img/svg/balls/blackball.svg' alt='black ball' className={styles.blackball} />
				<img src='/img/svg/balls/lines.svg' alt='black ball' className={clsx(styles.lines, "unselectable")} />
			</motion.div>
		</AnimatePresence>
	);
};

export default SignInScreen;
