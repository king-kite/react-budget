import { createContext, useContext, useEffect, useState } from "react";

export const LoadingContext = createContext({});

export const useLoadingContext = () => {
	return useContext(LoadingContext);
};

export const LoadingContextProvider = ({ children }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let timeout = undefined;

		if (loading === true) {
			timeout = setTimeout(() => {
				if (loading === true) setLoading(false);
			}, 60000);
		} else {
			if (timeout) {
				clearTimeout(timeout);
				timeout = undefined
			}
		}

		return () => {
			if (timeout) {
				clearTimeout(timeout);
				timeout = undefined
			}
		};
	}, [loading]);

	return (
		<LoadingContext.Provider
			value={{
				isLoading: loading,
				openLoader: () => setLoading(true),
				closeLoader: () => setLoading(false),
			}}
		>
			{children}
		</LoadingContext.Provider>
	);
};
