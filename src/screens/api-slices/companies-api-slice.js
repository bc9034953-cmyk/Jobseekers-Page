import { baseApi } from '../baseApi';

const apiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['getCompanies', 'getCompanyDetails'],
});

export const companiesApiSlice = apiWithTag.injectEndpoints({
  endpoints: builder => ({
    getCompanies: builder.query({
      query: params => ({
        url: '/jobcompanies?sort=-id&per-page=100&page=1',
        method: 'GET',
        params,
      }),
      providesTags: ['getCompanies'],
    }),
    updateCompanies: builder.mutation({
      query: ({ id, data }) => ({
        url: `/jobcompanies/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['getCompanies', 'getCompanyDetails', 'getJobs'],
    }),
    createCompanies: builder.mutation({
      query: data => ({
        url: '/jobcompanies',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['getCompanies', 'getCompanyDetails'],
    }),
    getCompanyDetails: builder.query({
      query: id => ({
        url: `/jobcompanies/${id}`,
        method: 'GET',
      }),
      providesTags: ['getCompanyDetails'],
    }),

    //
  }),
});
