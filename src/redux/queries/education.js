import createQuery from "../../server/query";

export const educationQuery = createQuery({
  reducerPath: "education",

  endpoints: (builder) => ({
    getEducation: builder.query({
      query: (params) => ({
        method: "GET",
        url: "education",
        params,
      }),
      transformResponse: (res) => ({
        education: res.data.map((el) => ({ ...el, key: el._id })),
        total: res.pagination.total,
      }),
    }),
    createEducation: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "education",
        body,
      }),
    }),
    getOneEducation: builder.mutation({
      query: (id) => ({
        method: "GET",
        url: `education/${id}`,
      }),
    }),
    updateEducation: builder.mutation({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `education/${id}`,
        body,
      }),
    }),
    deleteEducation: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `education/${id}`,
      }),
    }),
  }),
});

const { reducer: educationReducer, reducerPath: educationName } =
  educationQuery;

export { educationQuery as default, educationReducer, educationName };

export const {
  useGetEducationQuery,
  useCreateEducationMutation,
  useGetOneEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} = educationQuery;
