import { baseApi } from '../baseApi';

const apiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['jobbookmarks', 'getJobs'],
});

export const jobsApiSlice = apiWithTag.injectEndpoints({
  tagTypes: ['jobbookmarks', 'getJobs'],
  endpoints: builder => ({
    getJobs: builder.query({
      query: params => ({
        url: '/jobs?sort=-id&per-page=100&page=1',
        method: 'GET',
        params,
      }),
      providesTags: ['getJobs'],
    }),
    getJobDetails: builder.query({
      query: id => ({
        url: `/jobs/${id}`,
        method: 'GET',
      }),
    }),
    getBookmarkedJobs: builder.query({
      query: params => ({
        url: '/jobbookmarks?sort=-id',
        method: 'GET',
        params,
      }),
      providesTags: ['jobbookmarks'],
    }),
    bookmarkJob: builder.mutation({
      query: body => ({
        url: '/jobbookmarks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['jobbookmarks'],
    }),
    removeBookmarkedJob: builder.mutation({
      query: id => ({
        url: `/jobbookmarks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['jobbookmarks'],
    }),
    getJobLocations: builder.query({
      query: params => ({
        url: '/joblocations?sort=-id&per-page=1000&page=1',
        method: 'GET',
        params,
      }),
    }),
    getJobCategories: builder.query({
      query: params => ({
        url: '/jobcategories?sort=-id&per-page=1000&page=1',
        method: 'GET',
        params,
      }),
    }),
    updateJob: builder.mutation({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['getJobs'],
    }),
    createJob: builder.mutation({
      query: data => {
        return {
          url: '/jobs',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['getJobs'],
    }),

    //
  }),
});
