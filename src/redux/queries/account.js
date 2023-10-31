import createQuery from "../../server/query";

export const accountQuery = createQuery({
  reducerPath: "account",

  endpoints: (builder) => ({
    getAccount: builder.query({
      query: () => ({
        method: "GET",
        url: "/auth/me",
      }),
    }),
    uploadPhoto: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/auth/upload",
        body,
      }),
    }),
    updateAccount: builder.mutation({
      query: (body) => ({
        method: "PUT",
        url: `/auth/updatedetails`,
        body,
      }),
    }),
    updatePasswordAccount: builder.mutation({
      query: (body) => ({
        method: "PUT",
        url: `/auth/updatepassword`,
        body,
      }),
    }),
  }),
});

const { reducer: accountReducer, reducerPath: accountName } = accountQuery;

export { accountQuery as default, accountReducer, accountName };

export const {
  useGetAccountQuery,
  useUpdateAccountMutation,
  useUpdatePasswordAccountMutation,
  useUploadPhotoMutation,
} = accountQuery;
