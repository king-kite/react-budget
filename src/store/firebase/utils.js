import { addDoc, collection, Timestamp } from "firebase/firestore";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "firebase/storage";

import { auth, db, storage } from "./index";

export const deleteFile = async ({ path, onSuccess, onError }) => {
	try {
		if (!path) {
			throw new Error("Improperly Configured! Path to file is required");
			return;
		}

		const fileRef = ref(storage, path);

		const obj = await deleteObject(fileRef);

		if (onSuccess) onSuccess();
	} catch (error) {
		if (onError) onError({ detail: error?.code || error?.message });
		return { error };
	}
};

export const uploadFile = ({ file, path, metadata, onSuccess, onError }) => {
	try {
		if (!file || !path) {
			throw new Error("Improperly Configured. Provide a file and path");
			return;
		}
		const storageRef = ref(storage, path, metadata);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {},
			(error) => {
				if (onError) onError({ detail: error?.code || error?.message });
			},
			async () => {
				try {
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
					if (downloadURL && onSuccess) onSuccess(downloadURL);
				} catch (error) {
					if (onError) onError({ detail: error?.code || error?.message });
					return { error };
				}
			}
		);
	} catch (error) {
		if (onError) onError({ detail: error?.code || error?.message });
		return { error };
	}
};

export const generateLog = async ({ type, message, date }) => {
	try {
		const user = await auth.currentUser;
		if (user && message) {
			const data = {
				type: type || "default",
				message,
				date: Timestamp.fromDate(new Date()),
				user: user.uid,
			};

			await addDoc(collection(db, "logs"), data);

			return { ...data, date: new Date() };
		}
		return {
			error: {
				detail: "Unable to add log information",
			},
		};
	} catch (error) {
		return { error };
	}
};
