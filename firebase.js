import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBO_HCX3tMqrVCwjlLKJiJVT8lVdcKnk5U",
	authDomain: "hkugo-fd06c.firebaseapp.com",
	databaseURL:
		"https://hkugo-fd06c-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "hkugo-fd06c",
	storageBucket: "hkugo-fd06c.appspot.com",
	messagingSenderId: "435194671021",
	appId: "1:435194671021:web:4970ce614dae1133c0bb24",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// const db = firebase.firestore();
// const auth = firebase.auth();

export { app, db, auth };
