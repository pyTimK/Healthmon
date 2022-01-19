import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/NotFound.module.css";

const NotFound: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>404 Error</title>
        <meta
          name='description'
          content='Healthmon is a web application that is used together with the IoT-Based Health Monitoring Device <Device Name>. It monitors the collected health data of patients and stores the result in a cloud storage for later access.'
        />
      </Head>
      <h1>404</h1>
      <h4>This page could not be found.</h4>
      <p>
        Go to{" "}
        <Link href='/'>
          <a>Homepage</a>
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
