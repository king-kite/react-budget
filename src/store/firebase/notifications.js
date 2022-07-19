import {
	addDoc,
	collection,
	getDocs,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import { auth, db } from "./index";
import { toCapitalize, getDate } from "../../utils";

function getMessages({ title, type, data_type }) {
	return data_type === "goal"
		? [
				{
					title: `${type} \'${title}\' ends today!`,
					message: `${type} \'${title}\' ends today. Be sure to complete the required task before the day ends`,
					type: "danger",
					date_number: 0,
				},
				{
					title: `${type} \'${title}\' ends tommorow!`,
					message: `${type} \'${title}\' will end tommorow. Be sure to complete the required task before then.`,
					type: "warning",
					date_number: 1,
				},
				{
					title: `${type} \'${title}\' will end in two days!`,
					message: `${type} \'${title}\' will end in two days. Be sure to complete the required task before then.`,
					type: "info",
					date_number: 2,
				},
				{
					title: `${type} \'${title}\' will end in three days!`,
					message: `${type} \'${title}\' will end in three days. Be sure to complete the required task before then.`,
					type: "info",
					date_number: 3,
				},
		  ]
		: [
				{
					title: `The \'${title}\' ${type} ends today!`,
					message: `The \'${title}\' ${type} ends today. Be sure to tidy up your expenses and income.`,
					type: "danger",
					date_number: 0,
				},
				{
					title: `The \'${title}\' ${type} ends tommorow!`,
					message: `The \'${title}\' ${type} will end tommorow. Be sure to tidy up your expenses and income.`,
					type: "warning",
					date_number: 1,
				},
				{
					title: `The \'${title}\' ${type} will end in two days!`,
					message: `The \'${title}\' ${type} will end in two days. Be sure to tidy up your expenses and income.`,
					type: "info",
					date_number: 2,
				},
				{
					title: `The \'${title}\' ${type} will end in three days!`,
					message: `The \'${title}\' ${type} will end in three days. Be sure to tidy up your expenses and income.`,
					type: "info",
					date_number: 3,
				},
		  ];
}

export async function addNotification({
	date,
	data,
	data_type = "budget",
	key_name = "name",
	type = "Budget",
}) {
	try {
		const user = await auth.currentUser;
		if (user) {
			const end_date = getDate(date);
			const current_date = getDate();

			if (current_date <= end_date) {
				let diff_days = (end_date - current_date) / (1000 * 60 * 60 * 24);

				diff_days = parseInt(diff_days < 0 ? diff_days * -1 : diff_days);

				if (diff_days >= 0 && diff_days <= 3) {
					const messages = getMessages({
						type,
						title: toCapitalize(data[key_name]),
						data_type,
					});

					const exists = await checkNotificationExists({
						data_id: data.id,
						date_number: diff_days,
						data_type,
					});

					if (exists === false) {
						const notification = messages[diff_days];
						return addDoc(collection(db, "notifications"), {
							...notification,
							date: Timestamp.fromDate(new Date()),
							read: false,
							user: user.uid,
							data_id: data.id,
							data_type,
						});
					}
				}
			}
		}
		return;
	} catch (error) {
		return { error };
	}
}

export async function checkNotificationExists({
	data_id,
	data_type,
	date_number,
}) {
	const user = await auth.currentUser;
	if (user) {
		const notes = await getDocs(
			query(
				collection(db, "notifications"),
				where("data_id", "==", data_id),
				where("user", "==", user.uid),
				where("data_type", "==", data_type),
				where("date_number", "==", date_number)
			)
		);
		if (notes.docs.length > 0) return true;
	}
	return false;
}
