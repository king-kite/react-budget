import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config = {
	databaseURL: 'http://localhost:3001/?ns=kite-budget',
	projectId: 'kite-budget'
}

const app = initializeApp(config)

export const db = getFirestore(app);

export const storage = getStorage(app);