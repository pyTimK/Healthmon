import { User } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { doc, getDoc } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { ToastContainer } from "react-toastify";
import { CookiesHelper } from "../../classes/CookiesHelper";
import { FireStoreHelper } from "../../classes/FireStoreHelper";
import MyUser from "../../classes/MyUser";
import Sizedbox from "../../components/Sizedbox";
import { auth, db } from "../../firebase/initFirebase";
import styles from "./Auth.module.css";

const SignInScreen: NextPage = () => {
	const [authUser, setAuthUser] = useState<User | null>(null);
	const router = useRouter();

	const firestoreUserRecordChecker = async (authUser: User) => {
		const snapshot = await getDoc(doc(db, "users", authUser.uid));
		CookiesHelper.set("id", authUser.uid);

		if (snapshot.exists()) {
			router.replace("/");
		} else {
			//* Go to registration if first time logging in
			const myUser = MyUser.fromFirebaseUser(authUser);
			//TODO must not block for 2 seconds in auth page -> register page
			await FireStoreHelper.setUser(myUser);
			await FireStoreHelper.createUserConfig(authUser.uid);
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
			firebase.auth.FacebookAuthProvider.PROVIDER_ID,
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
		<div className={styles.container1}>
			<h1>Welcome</h1>
			<p className={styles.p1}>Please sign-in using one of the following methods</p>
			<Sizedbox height={50} />
			<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
			<ToastContainer theme='colored' autoClose={2} />
		</div>
	);
};

export default SignInScreen;
