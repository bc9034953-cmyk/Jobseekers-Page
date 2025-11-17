import { baseApi } from '../baseApi';

const apiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['jobapplications'],
});

export const jobsApplicationsApiSlice = apiWithTag.injectEndpoints({
  endpoints: builder => ({
    getJobApplications: builder.query({
      query: params => ({
        url: '/jobapplications?sort=-id&per-page=100',
        method: 'GET',
        params,
      }),
      providesTags: ['jobapplications'],
    }),
    applyJobApplication: builder.mutation({
      query: body => ({
        url: '/jobapplications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['jobapplications'],
    }),
    updateApplicationStatus: builder.mutation({
      query: body => ({
        url: '/jobapplications/status',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['jobapplications'],
    }),

    //
  }),
});
