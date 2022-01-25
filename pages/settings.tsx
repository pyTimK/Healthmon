import { NextPage } from "next";
import Head from "next/head";
import { useUser } from "../firebase/useUser";
import { auth, db } from "../firebase/initFirebase";
import styles from "../styles/Settings.module.css";
import { Camera, CirclePlusFill, CircleXFill, File } from "akar-icons";
import { useModal } from "react-hooks-use-modal";
import { FormEventHandler, useRef, useState } from "react";
import { doc, FieldValue, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { CookiesHelper } from "../classes/CookiesHelper";
import notify from "../myfunctions/notify";
import { ToastContainer } from "react-toastify";
import HealthWorker from "../types/healthWorker";
if (typeof window != "undefined") {
  var QrReader = require("react-qr-reader");
}

const defaultHealthWorker: HealthWorker = {
  name: "Dr. Belen",
  number: "09683879596",
};

const Settings: NextPage = () => {
  const [healthWorkers, setHealthWorkers] = useState([defaultHealthWorker]);
  const { user, logout } = useUser();
  const [PairDeviceModal, openPairDeviceModal, closePairDeviceModal, isPairDeviceModalOpen] = useModal("__next", {
    preventScroll: true,
  });
  const [ScanQRModal, openScanQRModal, closeScanQRModal, isScanQRModalOpen] = useModal("__next", {
    preventScroll: true,
  });
  const [CodeInputModal, openCodeInputModal, closeCodeInputModal, isCodeInputModalOpen] = useModal("__next", {
    preventScroll: true,
  });
  const [parsedQR, setParsedQR] = useState<string | null>(CookiesHelper.get("deviceid", ""));
  const qrRef = useRef<QrReader | null>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  console.log(parsedQR);

  const submitCode: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!codeInputRef.current) return;

    const authenticateDoc = await getDoc(doc(db, "authenticate", parsedQR!));
    const deviceData = authenticateDoc.data() as AuthenticateData;
    if (deviceData.code.toString() !== codeInputRef.current.value) {
      notify("Code did not match");
      setParsedQR(null);
      closeCodeInputModal();
      return;
    }

    const paired = await pairDevice();
    if (!paired) return;

    CookiesHelper.set("deviceid", parsedQR!);
    notify("Successfully linked device", { type: "success" });
    closeCodeInputModal();
  };

  const successScan = async (qr: string) => {
    const res = await askPairDevice(qr);
    if (!res) return;
    setParsedQR(qr);
    openCodeInputModal();
  };

  const handleFileScan = (qrdata: string | null) => {
    // console.log("umabot here");
    if (!qrdata) {
      notify("Cannot read qr code");
      return;
    }

    successScan(qrdata);
  };

  const handleCamScan = (qrdata: string | null) => {
    if (!qrdata) return;
    successScan(qrdata);
    closeScanQRModal();
    closePairDeviceModal();
  };

  const handleScanError = (_e: any) => {
    const e = _e as Error;
    console.error(e);
  };

  const onScanFile = () => {
    try {
      qrRef.current?.openImageDialog();
      // console.log("umabot here 1");
    } catch (_e) {
      const e = _e as Error;
      console.log(e);
    }
    closePairDeviceModal();
  };

  const onUnpairDevie = () => {
    if (!parsedQR) return;

    notify("Device disconnected", { type: "warning" });
    setParsedQR(null);
    CookiesHelper.set("deviceid", "");
    unPairDevice(parsedQR);
  };

  //? Firestore
  const askPairDevice = async (deviceCode: string) => {
    try {
      await updateDoc(doc(db, "devices", deviceCode), {
        new_name: user ? user.displayName : "John Doe",
        new_id: user ? user.uid : "1",
        new_healthWorkers: healthWorkers,
        confirmed: false,
        code: 0,
        request_timestamp: serverTimestamp(),
      });
      return true;
    } catch (_e) {
      console.log(_e);
      notify("Invalid qr code");
      return false;
    }
  };

  const pairDevice = async () => {
    const paired_doc: DeviceData = {
      name: user && user.displayName ? user.displayName : "John Doe",
      id: user ? user.uid : "1",
      healthWorkers: healthWorkers,
      new_name: "",
      new_id: "",
      new_healthWorkers: [],
      confirmed: true,
      request_timestamp: serverTimestamp(),
    };
    try {
      await updateDoc(doc(db, "devices", parsedQR!), {
        ...paired_doc,
      });
      return true;
    } catch (_e) {
      notify("Pair failed");
      return false;
    }
  };

  const unPairDevice = async (deviceCode: string) => {
    const deviceDoc = await getDoc(doc(db, "devices", parsedQR!));
    const deviceData = deviceDoc.data() as DeviceData;

    if (user?.uid !== deviceData.id) return;
    const clearedDeviceData = {
      name: "",
      id: "",
      healthWorkers: [],
      new_name: "",
      new_id: "",
      new_healthWorkers: [],
      confirmed: false,
    };
    await updateDoc(doc(db, "devices", deviceCode), clearedDeviceData);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Settings - Healthmon</title>
        <meta
          name='description'
          content='Healthmon is a web application that is used together with the IoT-Based Health Monitoring Device <Device Name>. It monitors the collected health data of patients and stores the result in a cloud storage for later access.'
        />
      </Head>

      <h1>Settings</h1>
      <div className={styles.block}>
        <h5 className={styles.hint}>General</h5>
        <div className={styles.item}>
          <h3 className={styles.itemtext}>
            Pair Healthmon Device
            {parsedQR && <p> (Connected)</p>}
          </h3>
          <div className={styles.option}>
            {CookiesHelper.get("deviceid", "") !== "" ? (
              <CircleXFill size={24} color='var(--red)' cursor='pointer' onClick={onUnpairDevie} />
            ) : (
              <CirclePlusFill size={24} color='var(--pink)' cursor='pointer' onClick={openPairDeviceModal} />
            )}
          </div>
        </div>
      </div>

      {/* PAIR MODAL */}
      <PairDeviceModal>
        <div className={styles.modal}>
          <div className={styles.modalLeft} onClick={onScanFile}>
            <File className={styles.svg} size={"10vw"} strokeWidth={1} />
            <p className={styles.modalTxt}>From image file</p>
          </div>
          <div className={styles.modalRight} onClick={openScanQRModal}>
            <Camera className={styles.svg} size={"10vw"} strokeWidth={1} />
            <p className={styles.modalTxt}>Use camera</p>
          </div>
        </div>
      </PairDeviceModal>

      {/* SCAN QR MODAL */}
      <ScanQRModal>
        <div className={styles.modal}>
          <div className={styles.modalLeft}>
            {isScanQRModalOpen && (
              <QrReader delay={3000} onError={handleScanError} onScan={handleCamScan} style={{ width: "100%" }} />
            )}
            <p className={styles.modalTxt}>Place QR Code inside the red box</p>
          </div>
        </div>
      </ScanQRModal>

      {/* CODE INPUT MODAL */}
      <CodeInputModal>
        <div className={styles.modal}>
          <div className={styles.modalLeft}>
            <p className={styles.modalTxt}>Please enter the code sent to your device</p>
            <form onSubmit={submitCode}>
              <input ref={codeInputRef} required type='text' name='code' placeholder='Input code...' />
              <input type='submit' value='Submit' />
            </form>
          </div>
        </div>
      </CodeInputModal>

      {/* QR READER */}
      <QrReader
        legacyMode
        ref={qrRef}
        showViewFinder={false}
        className={styles.qrfilereader}
        // delay={300}
        onError={handleScanError}
        onScan={handleFileScan}
        style={{ width: "100%" }}
      />
      <ToastContainer theme='colored' autoClose={2} />
    </div>
  );
};

export interface DeviceData {
  name: string;
  id: string;
  healthWorkers: HealthWorker[];
  new_name: string;
  new_id: string;
  new_healthWorkers: HealthWorker[];
  confirmed: boolean;
  request_timestamp: FieldValue;
}

export interface AuthenticateData {
  code: number;
}

export default Settings;
