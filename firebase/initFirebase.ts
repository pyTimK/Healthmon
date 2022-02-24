// import fb from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, Firestore, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { enableIndexedDbPersistence } from "firebase/firestore";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import { NextRouter } from "next/router";

let firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// if (typeof window !== "undefined" && window.location.hostname === "localhost") {
// 	firebaseConfig = {
// 		...firebaseConfig,
// 		databaseURL: "",
// 	};
// }

const initFirebase = async () => {
	console.log(Math.random());
	initializeApp(firebaseConfig);
	const db: Firestore = getFirestore();

	if (typeof window !== "undefined" && window.location.hostname === "192.168.1.11") {
		connectFirestoreEmulator(db, "192.168.1.11", 5001);
	}

	// ? OFFLINE DATA
	// TODO
	await enableIndexedDbPersistence(db).catch((error) => {
		if (error.code === "failed-precondition") {
			// multiple tabs open at once
			console.log("persistence failed");
		} else if (error.code === "unimplemented") {
			// lack of browser support
			console.log("persistence is not available");
		}
	});

	const fireStoreHelper = new FireStoreHelper(db);

	return { db, fireStoreHelper };
};

export const initFirebaseAuth = () => {
	const auth = getAuth();

	onAuthStateChanged(auth, (user) => {
		if (user) {
			// TODO
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			const uid = user.uid;
			// ...
		} else {
			// TODO
			// User is signed out
			// ...
		}
	});
	return { auth };
};

export default initFirebase;

// export default function initFirebase() {
//   if (!firebase.getApps().length) {
//     firebase.initializeApp(firebaseConfig);
//     // Check that `window` is in scope for the analytics module!
//     if (typeof window !== "undefined") {
//       // Enable analytics. https://firebase.google.com/docs/analytics/get-started
//       if ("measurementId" in firebaseConfig) {
//         firebase.analytics();
//         firebase.performance();
//       }
//     }
//     console.log("Firebase was successfully init.");
//   }
// }
