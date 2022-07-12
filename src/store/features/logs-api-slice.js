import { uid } from "uid";
import baseApi from "./base-api-slice";

const logsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		deleteLog: build.mutation({
			queryFn: (payload) => {
				let logs = localStorage.getItem("logs");

				if (logs === null) {
					return { error: "Log with specified ID does not exist!" };
				}

				logs = JSON.parse(logs);
				logs = logs.filter((data) => data.id !== payload);
				localStorage.setItem("logs", JSON.stringify(logs));

				return { data: "success" };
			},
			invalidatesTags: ["Log"],
		}),

		getLogs: build.query({
			queryFn: () => {
				const logs = localStorage.getItem("logs");

				if (logs !== null) {
					return { data: JSON.parse(logs) };
				}

				return { data: [] };
			},
			providesTags: ["Log"],
		}),
	}),
	overrideExisting: false,
});

export const {
	useDeleteLogMutation,

	useGetLogsQuery,
} = logsApi;

export default logsApi;
