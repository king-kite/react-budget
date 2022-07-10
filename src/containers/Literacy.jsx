import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useLoadingContext } from "../contexts"
// import { LiteracyCard, LiteracyForm } from "../components/Literacy"
// import { toCapitalize } from "../utils"

const Literacy = () => {
	// const dispatch = useDispatch();

	const { openLoader, closeLoader } = useLoadingContext();

	useEffect(() => {
		openLoader()
		setTimeout(() => {
			// let storageLiteracy = localStorage.getItem("income")
			// if (storageLiteracy !== null) {
			// 	storageLiteracy = JSON.parse(storageLiteracy)
			// 	dispatch(setLiteracy(storageLiteracy))
			// }
			closeLoader()
		}, 2000)
	}, [])
	// }, [dispatch])

	return (
		<div>
			
				<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="my-2">
						<h3 className="top-heading">Financial Literacy</h3>
						<p className="top-description">
							Advise on spending and how to improve it.
						</p>
					</div>
				</div>
		</div>
	);
};

export default Literacy;
