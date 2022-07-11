import { uid } from "uid";
import baseApi from "./base-api-slice";

const incomeApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		addIncome: build.mutation({
			queryFn: (payload) => {
				let income = localStorage.getItem("income");

				const data = { id: payload.id || uid(16), ...payload };

				if (income !== null) {
					income = JSON.parse(income);
					income = [data, ...income];
				} else {
					income = [data];
				}

				localStorage.setItem("income", JSON.stringify(income));
				return { data };
			},
			invalidatesTags: ["Income"],
		}),

		deleteIncome: build.mutation({
			queryFn: (payload) => {
				let income = localStorage.getItem("income");

				if (income === null) {
					return { error: "Income with specified ID does not exist!" };
				}

				income = JSON.parse(income);
				income = income.filter((data) => data.id !== payload);
				localStorage.setItem("income", JSON.stringify(income));

				return { data: "success" };
			},
			invalidatesTags: ["Income"],
		}),

		editIncome: build.mutation({
			queryFn: (payload) => {
				let income = localStorage.getItem("income");

				if (income === null) {
					return { error: "Income with specified ID does not exist!" };
				}

				income = JSON.parse(income);

				let singleIncome = income.find((data) => data.id === payload.id);
				if (singleIncome) {
					Object.assign(singleIncome, payload);
				}
				localStorage.setItem("income", JSON.stringify(income));
				return { data: payload };
			},
			invalidatesTags: ["Income"],
		}),

		getIncome: build.query({
			queryFn: () => {
				const income = localStorage.getItem("income");

				if (income !== null) {
					return { data: JSON.parse(income) };
				}

				return { data: [] };
			},
			providesTags: ["Income"],
		}),
	}),
	overrideExisting: false,
});

export const {
	useAddIncomeMutation,

	useDeleteIncomeMutation,

	useEditIncomeMutation,

	useGetIncomeQuery,
} = incomeApi;

export default incomeApi;
