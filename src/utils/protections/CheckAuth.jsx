import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { Outlet } from "react-router-dom";
import { login, logout } from "../../store/features/auth-slice"
import { SplashScreen } from "../../components/common";

const CheckAuth = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const user = localStorage.getItem('user')
		setTimeout(() => {
			if (user) dispatch(login(JSON.parse(user)))
			else dispatch(logout())
			setLoading(false)
		}, 2000)
	}, [dispatch])

	return loading ? <SplashScreen /> : <Outlet />
}

export default CheckAuth;

// import { useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import { login, logout } from "../../store/features/auth-slice"
// import { useUserDataQuery } from "../../store/features/auth-api-slice";
// import { useAppDispatch } from "../../hooks";
// import { SplashScreen } from "../../components/common";

// const CheckAuth = () => {
// 	const dispatch = useAppDispatch();
// 	const { data, isLoading, isError, isSuccess } = useUserDataQuery()

// 	useEffect(() => {
// 		if (isSuccess && data) dispatch(login(data))
// 		else if (isError) dispatch(logout())
// 	}, [dispatch, data, isSuccess, isError])

// 	return isLoading ? <SplashScreen /> : <Outlet />
// }

// export default CheckAuth;
