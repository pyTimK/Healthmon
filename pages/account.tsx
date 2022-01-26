import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { CookiesHelper } from "../classes/CookiesHelper";
import { auth } from "../firebase/initFirebase";

const Account: NextPage = () => {
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

  return (
    <div>
      <Head>
        <title>Account - Healthmon</title>
        <meta
          name='description'
          content='Healthmon is a web application that is used together with the IoT-Based Health Monitoring Device <Device Name>. It monitors the collected health data of patients and stores the result in a cloud storage for later access.'
        />
      </Head>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Account;
