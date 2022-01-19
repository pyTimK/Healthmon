import type { NextPage } from "next";
import Head from "next/head";
import Avatar from "../comps/Avatar";
import Record from "../comps/Record";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>HealthMon</title>
        <meta
          name='description'
          content='Healthmon is a web application that is used together with the IoT-Based Health Monitoring Device <Device Name>. It monitors the collected health data of patients and stores the result in a cloud storage for later access.'
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Good morning, Dr. Belen</h1>
        <div className={styles.recordHeading}>
          <Avatar />
          <div className={styles.descriptionWrapper}>
            <p className={styles.description}>Krisha is feeling good today</p>
          </div>
        </div>
        <Record />
        <Record />
        <Record />
        <Record />

        {/* <div className={styles.grid}>
          <a href='https://nextjs.org/docs' className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href='https://nextjs.org/learn' className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a href='https://github.com/vercel/next.js/tree/canary/examples' className={styles.card}>
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href='https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
            className={styles.card}>
            <h2>Deploy &rarr;</h2>
            <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
          </a>
        </div> */}
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'>
          © 2022 Healthmon
        </a>
      </footer>
    </div>
  );
};

export default Home;
