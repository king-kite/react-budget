import { uid } from "uid";
import baseApi from "./base-api-slice";

const receiptsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		addReceipt: build.mutation({
			queryFn: (payload) => {
				let receipts = localStorage.getItem("receipts");

				const data = { id: payload.id || uid(16), ...payload };

				if (receipts !== null) {
					receipts = JSON.parse(receipts);
					receipts = [data, ...receipts];
				} else {
					receipts = [data];
				}

				localStorage.setItem("receipts", JSON.stringify(receipts));
				return { data };
			},
			invalidatesTags: ["Receipt"],
		}),

		deleteReceipt: build.mutation({
			queryFn: (payload) => {
				let receipts = localStorage.getItem("receipts");

				if (receipts === null) {
					return { error: "Receipt with specified ID does not exist!" };
				}

				receipts = JSON.parse(receipts);
				receipts = receipts.filter((data) => data.id !== payload);
				localStorage.setItem("receipts", JSON.stringify(receipts));

				return { data: "success" };
			},
			invalidatesTags: ["Receipt"],
		}),

		editReceipt: build.mutation({
			queryFn: (payload) => {
				let receipts = localStorage.getItem("receipts");

				if (receipts === null) {
					return { error: "Receipt with specified ID does not exist!" };
				}

				receipts = JSON.parse(receipts);

				let singleReceipt = receipts.find((data) => data.id === payload.id);
				if (singleReceipt) {
					Object.assign(singleReceipt, payload);
				}
				localStorage.setItem("receipts", JSON.stringify(receipts));
				return { data: payload };
			},
			invalidatesTags: ["Receipt"],
		}),

		getReceipts: build.query({
			queryFn: () => {
				const receipts = localStorage.getItem("receipts");

				if (receipts !== null) {
					return { data: JSON.parse(receipts) };
				}

				return { data: [] };
			},
			providesTags: ["Receipt"],
		}),
	}),
	overrideExisting: false,
});

export const {
	useAddReceiptMutation,

	useDeleteReceiptMutation,

	useEditReceiptMutation,

	useGetReceiptsQuery,
} = receiptsApi;

export default receiptsApi;
