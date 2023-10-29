import createQuery from "../../server/query";

export const experienceQuery = createQuery({
  reducerPath: "experience",

  endpoints: (builder) => ({
    getExperiences: builder.query({
      query: (params) => ({
        method: "GET",
        url: "experiences",
        params,
      }),
      transformResponse: (res) => ({
        experience: res.data.map((el) => ({ ...el, key: el._id })),
        total: res.pagination.total,
      }),
    }),
    createExperiences: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "experiences",
        body,
      }),
    }),
    getOneExperiences: builder.mutation({
      query: (id) => ({
        method: "GET",
        url: `experiences/${id}`,
      }),
    }),
    updateExperiences: builder.mutation({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `experiences/${id}`,
        body,
      }),
    }),
    deleteExperiences: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `experiences/${id}`,
      }),
    }),
  }),
});

const { reducer: experienceReducer, reducerPath: experienceName } =
  experienceQuery;

export { experienceQuery as default, experienceReducer, experienceName };

export const {
  useGetExperiencesQuery,
  useCreateExperiencesMutation,
  useGetOneExperiencesMutation,
  useUpdateExperiencesMutation,
  useDeleteExperiencesMutation,
} = experienceQuery;
