import { collection, doc, getDoc, getDocs, onSnapshot, query } from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CookiesHelper } from "../classes/CookiesHelper";
import Avatar from "../comps/Avatar";
import Record, { RecordData } from "../comps/Record";
import { db } from "../firebase/initFirebase";
import { getYYYYMMDD } from "../myfunctions/dateConversions";
import dayGreetings from "../myfunctions/dayGreetings";
import styles from "../styles/Home.module.css";
import MyUser from "../types/myUser";

const Home: NextPage = () => {
  const user = CookiesHelper.get("user", new MyUser());

  const router = useRouter();

  const [records, setRecords] = useState<RecordData[]>([]);

  function getRecords(id: string) {
    // if (id.length == 0) id = "1";
    const dateDoc = getYYYYMMDD(new Date());
    const q = query(collection(db, "records", dateDoc, id));

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
    if (user.id.length == 0) router.replace("/auth");
    const unsub = getRecords(user.id);
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
            {dayGreetings()} {user.name}
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
