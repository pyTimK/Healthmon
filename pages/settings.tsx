import { NextPage } from "next";
import Head from "next/head";
import { useUser } from "../firebase/useUser";
import { auth, db } from "../firebase/initFirebase";
import styles from "../styles/Settings.module.css";
import { Camera, CirclePlusFill, CircleXFill, File } from "akar-icons";
import { useModal } from "react-hooks-use-modal";
import { useRef, useState } from "react";
import notify from "../functions/notify";
import { doc, setDoc } from "firebase/firestore";
import { CookiesHelper } from "../classes/CookiesHelper";
if (typeof window != "undefined") {
  var QrReader = require("react-qr-reader");
}

const Settings: NextPage = () => {
  const [healthWorkers, setHealthWorkers] = useState(["Dr. Belen"]);
  const { user, logout } = useUser();
  const [PairDeviceModal, openPairDeviceModal, closePairDeviceModal, isPairDeviceModalOpen] = useModal("__next", {
    preventScroll: true,
  });
  const [ScanQRModal, openScanQRModal, closeScanQRModal, isScanQRModalOpen] = useModal("__next", {
    preventScroll: true,
  });
  const [parsedQR, setParsedQR] = useState<string | null>(CookiesHelper.get("deviceid", ""));
  const qrRef = useRef<QrReader | null>(null);

  const successScan = (qr: string) => {
    notify("Successfully linked device", { type: "success" });
    setParsedQR(qr);
    CookiesHelper.set("deviceid", qr);
    pairDevice(qr);
  };

  const handleFileScan = (qrdata: string | null) => {
    if (!qrdata) {
      notify("Cannot read qr code");
      return;
    }
    console.log(qrdata, "qr");

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
    } catch (_e) {
      const e = _e as Error;
      console.log(e);
    }
    closePairDeviceModal();
  };

  const onUnpairDevie = () => {
    if (!parsedQR) return;

    notify("Device disconnected", { type: "warning" });
    setParsedQR("");
    CookiesHelper.set("deviceid", "");
    unPairDevice(parsedQR);
  };

  //? Firestore
  const pairDevice = async (deviceCode: string) => {
    await setDoc(doc(db, "devices", deviceCode), {
      name: user ? user.displayName : "John Doe",
      healthWorkers: healthWorkers,
    });
  };

  const unPairDevice = async (deviceCode: string) => {
    await setDoc(doc(db, "devices", deviceCode), {
      name: "",
      healthWorkers: [],
    });
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
            {parsedQR ? (
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
          <div className={styles.modalLeft} onClick={onScanFile}>
            {isScanQRModalOpen && (
              <QrReader delay={3000} onError={handleScanError} onScan={handleCamScan} style={{ width: "100%" }} />
            )}
            <p className={styles.modalTxt}>Place QR Code inside the red box</p>
          </div>
        </div>
      </ScanQRModal>

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
    </div>
  );
};

export default Settings;
