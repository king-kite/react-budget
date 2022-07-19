import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
	baseQuery: fakeBaseQuery(),
	reducerPath: "baseApi",
	tagTypes: ["Budget", "Expense", "Goal", "Income", "Log", "Receipt", "User"],
	endpoints: () => ({})
})

export default baseApi