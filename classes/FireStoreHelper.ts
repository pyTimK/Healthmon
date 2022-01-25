import firebase from "firebase/compat/app";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/initFirebase";

export abstract class FireStoreHelper {
  static setUserFirestore = async (user: firebase.User) => {
    console.log("add user", user);
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      name: user.displayName,
    });
  };
}
