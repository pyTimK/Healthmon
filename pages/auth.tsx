import { NextPage } from "next";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import styles from "../styles/SignIn.module.css";
import "firebase/compat/auth";
import Sizedbox from "../comps/Sizedbox";
import { User } from "firebase/auth";
import firebase from "firebase/compat/app";
import { auth, db } from "../firebase/initFirebase";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { CookiesHelper } from "../classes/CookiesHelper";
import MyUser from "../types/myUser";

const SignInScreen: NextPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const firestoreUserRecordChecker = async (user: User) => {
    const docRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(docRef);

    // Go to registration if first time logging in
    if (snapshot.exists()) {
      CookiesHelper.set("user", snapshot.data());
      router.replace("/");
    } else {
      const myUser = MyUser.fromFirebaseUser(user);
      FireStoreHelper.setUserFirestore(myUser);
      CookiesHelper.set("user", myUser);
      router.replace("/register");
    }
  };

  useEffect(() => {
    if (user) {
      firestoreUserRecordChecker(user);
    }
  }, [user]);

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
          setUser(authResult.user as User);

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
    </div>
  );
};

export default SignInScreen;
