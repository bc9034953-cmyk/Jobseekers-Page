import { baseApi } from '../baseApi';

const apiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['getContents'],
});

export const contentApiSlice = apiWithTag.injectEndpoints({
  endpoints: builder => ({
    getContents: builder.query({
      query: params => ({
        url: '/contents?sort=-id&per-page=100&page=1',
        method: 'GET',
        params,
      }),
      providesTags: ['getContents'],
    }),
    updateContent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/contents/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['getContents'],
    }),
    createContent: builder.mutation({
      query: data => ({
        url: '/contents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['getContents'],
    }),
    deleteContent: builder.mutation({
      query: id => ({
        url: `/contents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getContents'],
    }),

    //
  }),
});
