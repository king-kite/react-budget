import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { uid } from "uid";

import { storage } from "./index";

export const uploadFile = (file, callback) => {
	const storageRef = ref(storage, file.name);
	const uploadTask = uploadBytesResumable(storageRef, file);

	uploadTask.on(
		"state_changed",
		(snapshot) => {
			const progress =
				(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log(`Upload is ${progress}% done`);
			switch (snapshot.state) {
				case "paused":
					console.log("Upload is paused");
					break;
				case "running":
					console.log("Upload is running");
					break;
				default:
					break;
			}
		},
		(error) => {
			console.log("UPLOAD ERROR :>> ", error);
		},
		() => {
			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				console.log("DOWNLOAD URL :>> ", downloadURL);
				if (callback) callback(downloadURL);
			});
		}
	);
};

export const generateLog = ({ type, message, timestamp }) => {
	if (message) {
		let logs = localStorage.getItem("logs");

		const data = {
			id: uid(16),
			type: type || "default",
			message,
			timestamp: timestamp || new Date().toDateString(),
		};

		if (logs !== null) {
			logs = JSON.parse(logs);
			logs = [data, ...logs];
		} else {
			logs = [data];
		}

		localStorage.setItem("logs", JSON.stringify(logs));
		return data;
	}
	return null;
};
