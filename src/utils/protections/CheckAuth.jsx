import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { login, logout } from "../../store/features/auth-slice";
import baseApi from "../../store/features/base-api-slice";
import { auth } from "../../store/firebase";
import { SplashScreen } from "../../components/common";

const CheckAuth = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function checkAuth() {
			await onAuthStateChanged(auth, (user) => {
				if (user)
					dispatch(
						login({
							email: user.email,
							id: user.uid,
							image: user.photoURL,
							name: user.displayName,
							phone: user.phoneNumber,
						})
					);
				else {
					dispatch(logout());
					dispatch(baseApi.util.resetApiState());
				}

				setLoading(false);
			});
		}
		checkAuth();
	}, []);

	return loading ? <SplashScreen /> : <Outlet />;
};

export default CheckAuth;
