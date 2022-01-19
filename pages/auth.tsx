import { NextPage } from "next";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import styles from "../styles/SignIn.module.css";
import "firebase/compat/auth";
import Sizedbox from "../comps/Sizedbox";
import { setUserCookie } from "../firebase/userCookies";
import { User } from "firebase/auth";
import firebase from "firebase/compat/app";
import { auth } from "../firebase/initFirebase";

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/",
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
        return true;
      }
      return false;
    },
    // signInFailure: (error: ErrorCallback) => {
    //   return false;
    // },
  },
};

const SignInScreen: NextPage = () => {
  // const [renderAuth, setRenderAuth] = useState(false);
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setRenderAuth(true);
  //   }
  // }, []);

  return (
    <div className={styles.container}>
      <h1>Welcome</h1>
      <p className={styles.p}>Please sign-in using one of the following methods</p>
      <Sizedbox height={50} />
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
};

export default SignInScreen;
