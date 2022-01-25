import { NextPage } from "next";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import styles from "../styles/SignIn.module.css";
import "firebase/compat/auth";
import Sizedbox from "../comps/Sizedbox";
import { setUserCookie } from "../firebase/userCookies";
import { User } from "firebase/auth";
import firebase from "firebase/compat/app";
import { auth } from "../firebase/initFirebase";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SignInScreen: NextPage = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
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
          setUserCookie(authResult.user as User);
          FireStoreHelper.setUserFirestore(authResult.user).then(() => {
            setUser(authResult.user);
          });
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
