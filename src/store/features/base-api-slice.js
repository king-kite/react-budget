import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
	baseQuery: fakeBaseQuery(),
	reducerPath: "baseApi",
	tagTypes: ["Budget", "Expense", "Goal", "Income"],
	endpoints: () => ({})
})

export default baseApi