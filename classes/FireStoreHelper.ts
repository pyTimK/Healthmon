import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import MyUser from "../types/myUser";

export abstract class FireStoreHelper {
  static setUserFirestore = async (user: MyUser) => {
    await setDoc(doc(db, "users", user.id), { ...user });
  };
}
