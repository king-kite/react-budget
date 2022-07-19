import {
	createUserWithEmailAndPassword,
	updatePassword,
	updateProfile,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";

import baseApi from "./base-api-slice";

import { auth } from "../firebase";

const authApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getProfile: build.query({
			queryFn: async () => {
				try {
					const user = await auth.currentUser;
					if (user) {
						return {
							data: {
								email: user.email,
								displayName: user.displayName,
								image: user.photoURL,
							},
						};
					}
					return {
						error: {
							detail: "Authentication credentials were not provided!",
						},
					};
				} catch (error) {
					return { error: { detail: error.code || error.message } };					
				}
			},
			providesTags: ["User"],
		}),

		login: build.mutation({
			queryFn: async ({ email, password }) => {
				try {
					const credentials = await signInWithEmailAndPassword(
						auth,
						email,
						password
					);

					if (credentials?.user) {
						return {
							data: {
								email: credentials.user.email,
								id: credentials.user.uid,
								image: credentials.user.photoURL,
								name: credentials.user.displayName,
								phone: credentials.user.phoneNumber,
							},
						};
					}

					return {
						error: {
							detail: "Unable to login with provided credentials",
						},
					};
				} catch (error) {
					return { error: { detail: error.code || error.message } };
				}
			},
			invalidatesTags: ["User"],
		}),

		logout: build.mutation({
			queryFn: async () => {
				try {
					await signOut(auth);
					return { data: { detail: "Signed out successfully!" } };
				} catch (error) {
					return { error: { detail: error.code || error.message } };
				}
			},
			invalidatesTags: ["User"],
		}),

		register: build.mutation({
			queryFn: async ({ email, password }) => {
				try {
					const credentials = await createUserWithEmailAndPassword(
						auth,
						email,
						password
					);

					if (credentials?.user) {
						return {
							data: {
								email: credentials.user.email,
								id: credentials.user.uid,
								image: credentials.user.photoURL,
								name: credentials.user.displayName,
								phone: credentials.user.phoneNumber,
							},
						};
					}

					return {
						error: {
							detail: "A server error occurred. Unable to sign up!",
						},
					};
				} catch (error) {
					return { error: { detail: error.code || error.message } };
				}
			},
			invalidatesTags: ["User"],
		}),

		updatePassword: build.mutation({
			queryFn: async (payload) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const data = await updatePassword(user, payload);
						return {
							data: {
								detail: "Password updated successfully!",
							},
						};
					} else {
						return {
							error: {
								detail: "Authentication credentials were not provided!",
							},
						};
					}
				} catch (error) {
					return { error: { detail: error.code || error.message } };
				}
			},
		}),

		updateProfile: build.mutation({
			queryFn: async (payload) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const data = await updateProfile(user, payload);
						return { data: payload };
					} else {
						return {
							error: {
								detail: "Authentication credentials were not provided!",
							},
						};
					}
				} catch (error) {
					return { error: { detail: error.code || error.message } };
				}
			},
			invalidatesTags: (result) => (result ? ["User"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetProfileQuery,
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useUpdatePasswordMutation,
	useUpdateProfileMutation,
} = authApi;

export default authApi;
