import { forwardRef, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { 
	FaRegCheckCircle,
	FaRegTimesCircle,
	FaTimes 
} from "react-icons/fa";
import { MdOutlineWarning, MdOutlineWarningAmber } from "react-icons/md"
import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { auth, db } from "../store/firebase";
import { open } from "../store/features/alert-slice";
import { Loader } from "../components/controls";

const Notification = ({ id, date, title, message, type }) => {

	const dispatch = useDispatch()

	const [loading, setLoading] = useState(false);
	
	const color = type === "danger" ? "text-red-600" : type === "info" ? "text-gray-600" : type === "warning" ? "text-yellow-600" : "text-green-600";

	const markRead = useCallback(async () => {
		try { 
			setLoading(true)
			await updateDoc(doc(db, "notifications", id), {
				read: true
			});
			setLoading(false)
		} catch (error) {
			dispatch(open({
				type: "danger",
				message: error.message || "Unable to delete notification."
			}))
			setLoading(false)
		}
	}, [id])

	const _date = date.toDate()
	const minutes = _date.getMinutes();
	const hours = _date.getHours();
	const _hour = hours > 12 ? hours - 12 : hours;
	const AM_PM = hours > 12 ? "PM" : "AM";

	return (
		<div className="flex relative w-full">
			<div className="border-r border-gray-300 flex items-start justify-center pt-2 px-3">
				<span className="flex items-center justify-center">
					{type === "success" ?
						<FaRegCheckCircle className={`font-semibold ${color} text-sm`} />
						:
					type === "info" ?
						<MdOutlineWarningAmber className={`font-semibold ${color} text-sm`} />
					: type === "danger" ?

						<FaRegTimesCircle className={`font-semibold ${color} text-sm`} />
					:
						<MdOutlineWarning className={`font-semibold ${color} text-sm`} />
					}
				</span>
			</div>

			<div className="px-2 py-1 w-full">
				<p className="font-semibold text-gray-700 text-sm tracking-wide md:text-base">
					{title}
				</p>
				<span className="leading-[18px] inline-block text-gray-500 text-xs md:text-sm">
					{message}
				</span>
				<span className="italic text-gray-500 text-xs">
					{_date.toDateString()}, {`${_hour}:${minutes} ${AM_PM}`}
				</span>
			</div>

			<div className="flex items-start justify-center pt-2 px-3">
				<span
					onClick={markRead}
					className="cursor-pointer duration-500 flex items-center justify-center transition transform hover:scale-110"
				>
					<FaTimes className="font-normal text-gray-500 text-sm" />
				</span>
			</div>

			{loading && (<div
				className="absolute flex items-center justify-center left-0 h-full top-0 w-full"
				style={{
					background: "rgba(0,0,0,0.6)",
				}}
			>
				<Loader color="white" size={3} type="dotted" border="border" />
			</div>)}
		</div>	
	);
};

const Notifications = forwardRef(({ setCount, visible }, ref) => {
	const [notes, setNotes] = useState([]);

	useEffect(() => {
		const user = auth.currentUser;
		const q = query(
			collection(db, "notifications"),
			where("user", "==", user.uid),
			where("read", "==", false),
			orderBy("date", "desc")
		);
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const notifications = [];
			const notes = snapshot.docs.map(note => ({
				id: note.id,
				...note.data()
			}))
			setNotes(notes);
		});

		return () => {
			unsubscribe()
		}
	}, []);

	useEffect(() => {
		setCount(notes.length);
	}, [notes]);

	return (
		<ul
			ref={ref}
			className={`${
				visible ? "block" : "hidden"
			} absolute bg-white border-t border-2 border-gray-300 divide-y divide-gray-300 divide-opacity-75 grow-down max-h-[416px] max-w-xs overflow-y-auto rounded-b-lg right-0 top-[120px] shadow-lg w-full z-[100] sm:max-w-sm sm:top-[83px] md:top-[85px] lg:top-[86px]`}
		>
			{notes.length > 0 ? (
				notes.map((note, index) => (
					<li key={index} className="even:bg-gray-200">
						<Notification {...note} />
					</li>
				))
			) : (
				<li>
					<div className="px-2 py-1 w-full">
						<p className="font-semibold text-center text-gray-700 text-sm tracking-wide md:text-base">
							No New Notification
						</p>
					</div>
				</li>
			)}
		</ul>
	);
});

export default Notifications;
