import baseApi from "./base-api-slice";

const authApi = baseApi.injectEndpoints({
	endpoints: (build) => ({

		checkAuth: build.query({
			queryFn: () => {
				const isAuthenticed = localStorage.getItem("isAuthenticated")
				const user = localStorage.getItem("user")
				if (isAuthenticed === null || user === null) {
					return { error: "Authentication credentials were not found or are invalid!"}
				}
				const { auth } = JSON.parse(isAuthenticed)
				if (auth === true) {
					return { data: JSON.parse(user) }
				}
			}
		}),

		login: build.mutation({
			queryFn: ({ username, password }) => {
				let users = localStorage.getItem("users");
				if (users === null) {
					return {
						error: "Unable to login with provided credentials!",
					};
				}

				users = JSON.parse(users);
				const user = users.find((user) => user.username === username);
				if (user) {
					if (user.password === password) {
						localStorage.setItem(
							"isAuthenticated",
							JSON.stringify({ auth: true })
						);
						localStorage.setItem(
							"user",
							JSON.stringify({ username, password })
						)
						return { data: { username, password } };
					}
				}
				return { error: "Unable to login with provided credentials" };
			},
		}),

		logout: build.mutation({
			queryFn: () => {
				localStorage.setItem(
					"isAuthenticated",
					JSON.stringify({ auth: false })
				);
				localStorage.removeItem("user")
				return { data: "success" };
			},
		}),

		register: build.mutation({
			queryFn: (data) => {
				let users = localStorage.getItem("users");
				if (users === null) {
					users = [data];
				} else {
					users = [data, ...JSON.parse(users)];
				}
				localStorage.setItem("users", JSON.stringify(users));
				return { data };
			},
		}),
	}),
	overrideExisting: false,
});

export const {
	useCheckAuthQuery,
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
} = authApi;

export default authApi;
