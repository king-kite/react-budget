import { uid } from "uid";
import baseApi from "./base-api-slice";
import { generateLog } from "../firebase/utils"
import { toCapitalize } from "../../utils"

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
				generateLog({
					type: "create",
					message: `${toCapitalize(data.title)} was created`
				})
				return { data };
			},
			invalidatesTags: ["Income", "Log"],
		}),

		deleteIncome: build.mutation({
			queryFn: (payload) => {
				let income = localStorage.getItem("income");

				if (income === null) {
					return { error: "Income with specified ID does not exist!" };
				}

				income = JSON.parse(income);
				const data = income.find(data => data.id === payload)
				income = income.filter((data) => data.id !== payload);
				localStorage.setItem("income", JSON.stringify(income));
				if (data)
					generateLog({
						type: "delete",
						message: `${toCapitalize(data.title)} was deleted`
					})
				return { data: "success" };
			},
			invalidatesTags: ["Income", "Log"],
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
				generateLog({
					type: "update",
					message: `${toCapitalize(singleIncome.title)} was updated`
				})
				return { data: payload };
			},
			invalidatesTags: ["Income","Log"],
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
