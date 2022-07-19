import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { firebaseConfig, NODE_ENV } from "../../config";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

if (NODE_ENV === "development") {
	connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
	connectFirestoreEmulator(db, "localhost", 8080);
	connectStorageEmulator(storage, "localhost", 9199);
}
