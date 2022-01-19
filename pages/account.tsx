import { NextPage } from "next";
import Head from "next/head";
import { useUser } from "../firebase/useUser";

const Account: NextPage = () => {
  const { user, logout } = useUser();
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
