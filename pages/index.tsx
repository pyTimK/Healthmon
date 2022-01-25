import { collection, doc, getDoc, getDocs, onSnapshot, query } from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Avatar from "../comps/Avatar";
import Record, { RecordData } from "../comps/Record";
import { db } from "../firebase/initFirebase";
import { useUser } from "../firebase/useUser";
import { getYYYYMMDD } from "../myfunctions/dateConversions";
import dayGreetings from "../myfunctions/dayGreetings";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const [records, setRecords] = useState<RecordData[]>([]);

  function getRecords(date: Date, uid: string) {
    const dateDoc = getYYYYMMDD(date);
    const q = query(collection(db, "records", dateDoc, uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let gotRecords: RecordData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as RecordData;
        gotRecords.push(data);
      });
      gotRecords.reverse();
      setRecords(() => gotRecords);
    });

    return unsubscribe;
  }

  // TODO: move to serverside
  useEffect(() => {
    if (!user) return;
    const unsub = getRecords(new Date(), user.uid);
    return () => unsub();
  }, [user]);

  return (
    user && (
      <div className={styles.container}>
        <Head>
          <title>HealthMon</title>
          <meta
            name='description'
            content='Healthmon is a web application that is used together with the IoT-Based Health Monitoring Device <Device Name>. It monitors the collected health data of patients and stores the result in a cloud storage for later access.'
          />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            {dayGreetings()} {user.displayName}
          </h1>
          {/* {user.photoURL && <img className='avatar' src={user.photoURL} alt='avatar' />} */}
          <div className={styles.recordHeading}>
            <Avatar />
            <div className={styles.descriptionWrapper}>
              <p className={styles.description}>Krisha is feeling good today</p>
            </div>
          </div>
          {records.map((record, i) => (
            <Record key={i} timestamp={record.timestamp} temp={record.temp} pulse={record.pulse} spo2={record.spo2} />
          ))}
        </main>

        <footer className={styles.footer}>
          <a href='https://healthmonmikee.web.app/' target='_blank' rel='noopener noreferrer'>
            © 2022 Healthmon
          </a>
        </footer>
      </div>
    )
  );
};

export default Home;
