import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "firebase/auth";
import { getUserFromCookie, removeUserCookie, setUserCookie } from "./userCookies";
import { auth } from "./initFirebase";
import Cookies from "js-cookie";

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const logout = async () => {
    try {
      await auth.signOut();
      removeUserCookie();
      Cookies.remove("isPatient");
      router.push("/auth");
    } catch (_e: any) {
      const e: Error = _e;
      console.log(e.message);
    }
  };

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = auth.onIdTokenChanged((user) => {
      if (user) {
        const userData = user;
        setUserCookie(userData);
        setUser(userData);
      } else {
        removeUserCookie();
        setUser(null);
      }
    });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      router.push("/auth");
      return;
    }
    setUser(userFromCookie);

    return () => {
      cancelAuthListener();
    };
  }, []);

  return { user, logout };
};

export { useUser };
