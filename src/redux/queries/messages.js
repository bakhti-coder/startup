import createQuery from "../../server/query";

export const messagesQuery = createQuery({
  reducerPath: "messages",

  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (params) => ({
        method: "GET",
        url: "messages",
        params,
      }),
      transformResponse: (res) => ({
        messages: res.data.map((el) => ({ ...el, key: el._id })),
        total: res.pagination.total,
      }),
    }),
    createMessages: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "messages",
        body,
      }),
    }),
    getOneMessages: builder.mutation({
      query: (id) => ({
        method: "GET",
        url: `messages/${id}`,
      }),
    }),
    updateMessages: builder.mutation({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `messages/${id}`,
        body,
      }),
    }),
    deleteMessages: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `messages/${id}`,
      }),
    }),
    getUnansweredMessages: builder.mutation({
      query: (id) => ({
        method: "GET",
        url: `messages/${id}`,
      }),
    }),
  }),
});

const { reducer: messagesReducer, reducerPath: messagesName } = messagesQuery;

export { messagesQuery as default, messagesReducer, messagesName };

export const {
  useGetMessagesQuery,
  useCreateMessagesMutation,
  useGetOneMessagesMutation,
  useUpdateMessagesMutation,
  useDeleteMessagesMutation,
} = messagesQuery;
