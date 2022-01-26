import { db } from "../firebase/initFirebase";
import { Camera, CirclePlusFill, CircleXFill, File } from "akar-icons";
import { ToastContainer } from "react-toastify";
import { useModal } from "react-hooks-use-modal";
import { FormEventHandler, useRef, useState, useEffect } from "react";
import { doc, FieldValue, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { CookiesHelper } from "../classes/CookiesHelper";
import notify from "../myfunctions/notify";
import styles from "../styles/Settings.module.css";
import HealthWorker from "../types/healthWorker";
import MyUser from "../types/myUser";
import { NextPage } from "next";
console.log("Typeof window", typeof window);
import dynamic from "next/dynamic";
import Sizedbox from "./Sizedbox";
import { useRouter } from "next/router";
// import QrReader from "react-qr-reader";
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

// // @ts-ignore
// declare var window;
// if (typeof window != "undefined") {
//   var QrReader = require("react-qr-reader");
// }
const ConfigurationScreen: NextPage = () => {
  const [user, setUser] = useState(CookiesHelper.get<MyUser>("user", new MyUser()));

  useEffect(() => {
    CookiesHelper.set("user", user);
  }, [user]);

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
  const nameInputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);
  const healthWorkerInputRef = useRef<HTMLInputElement>(null);
  const healthWorkerNumberInputRef = useRef<HTMLInputElement>(null);
  console.log(parsedQR);

  //TODO REMOVE
  if (user.healthWorkers.length !== 1) {
    setUser((user) => {
      return { ...user, healthWorkers: [{ name: "", number: "" } as HealthWorker] };
    });
  }

  const addHealthWorker = () => {
    setUser((user) => {
      return { ...user, healthWorkers: [...user.healthWorkers, { name: "", number: "" } as HealthWorker] };
    });
  };

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
        new_name: user.name,
        new_id: user.id,
        new_healthWorkers: user.healthWorkers,
        confirmed: false,
        code: 0,
        request_timestamp: serverTimestamp(),
      } as Partial<DeviceData>);

      return true;
    } catch (_e) {
      console.log(_e);
      notify("Invalid qr code");
      return false;
    }
  };

  const pairDevice = async () => {
    const paired_doc: DeviceData = {
      name: user.name,
      id: user.id,
      healthWorkers: user.healthWorkers,
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

    if (user.id !== deviceData.id) return;
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

  const updateRecord = async (deviceName: string) => {
    //TODO dont update device info if not connected
    const paired_doc: DeviceData = {
      name: nameInputRef.current?.value ?? user.name,
      id: user.id,
      healthWorkers: [
        {
          name: healthWorkerInputRef.current?.value ?? "",
          number: healthWorkerNumberInputRef.current?.value ?? "",
        } as HealthWorker,
      ],
      new_name: "",
      new_id: "",
      new_healthWorkers: [],
      confirmed: false,
      request_timestamp: serverTimestamp(),
    };

    try {
      await updateDoc(doc(db, "devices", deviceName), { ...paired_doc });

      await updateDoc(doc(db, "users", user.id), {
        name: nameInputRef.current?.value ?? user.name,
        healthWorkers: [
          {
            name: healthWorkerInputRef.current?.value ?? "",
            number: healthWorkerNumberInputRef.current?.value ?? "",
          } as HealthWorker,
        ],
        id: user.id,
        isPatient: true,
        number: numberInputRef.current?.value ?? "",
      });

      return true;
    } catch (_e) {
      notify("Pair failed");

      return false;
    }
  };

  const goToDashboard = async () => {
    CookiesHelper.set("user", {
      name: nameInputRef.current?.value ?? user.name,
      healthWorkers: [
        {
          name: healthWorkerInputRef.current?.value ?? "",
          number: healthWorkerNumberInputRef.current?.value ?? "",
        } as HealthWorker,
      ],
      id: user.id,
      isPatient: true,
      number: numberInputRef.current?.value ?? "",
    } as MyUser);
    await updateRecord("healthmonmikee1");
    // const route = useRouter();
    // route.replace("/");
  };

  return (
    <div className={styles.container}>
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
      <Sizedbox height={40} />
      <div className={styles.block}>
        <h5 className={styles.hint}>Personal Details</h5>
        <div className={styles.item}>
          <h3 className={styles.itemtext}>Name</h3>
          <div className={styles.option}>
            <input ref={nameInputRef} type='text' defaultValue={user.name} />
          </div>
        </div>
        <Sizedbox height={20} />
        <div className={styles.item}>
          <h3 className={styles.itemtext}>Number</h3>
          <div className={styles.option}>
            <input ref={numberInputRef} type='text' defaultValue={user.number} />
          </div>
        </div>
      </div>
      <Sizedbox height={40} />
      <div className={styles.block}>
        <h5 className={styles.hint}>Health Worker</h5>
        {/* <CirclePlusFill size={24} color='var(--pink)' cursor='pointer' onClick={addHealthWorker} /> */}
        {user.healthWorkers.map((healthWorker) => {
          return (
            <>
              <div className={styles.item}>
                <h3 className={styles.itemtext}>Name</h3>
                <div className={styles.option}>
                  <input ref={healthWorkerInputRef} type='text' defaultValue={user.healthWorkers[0].name} />
                </div>
              </div>
              <Sizedbox height={20} />
              <div className={styles.item}>
                <h3 className={styles.itemtext}>Number</h3>
                <div className={styles.option}>
                  <input ref={healthWorkerNumberInputRef} type='text' defaultValue={user.healthWorkers[0].number} />
                </div>
              </div>
              <Sizedbox height={20} />
            </>
          );
        })}
      </div>
      <button onClick={goToDashboard}>Proceed</button>

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

      {/* <QrReader
        legacyMode
        ref={qrRef}
        showViewFinder={false}
        className={styles.qrfilereader}
        // delay={300}
        onError={handleScanError}
        onScan={handleFileScan}
        style={{ width: "100%" }}
      /> */}
      <ToastContainer theme='colored' autoClose={2} />
    </div>
  );
};

export default ConfigurationScreen;
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
