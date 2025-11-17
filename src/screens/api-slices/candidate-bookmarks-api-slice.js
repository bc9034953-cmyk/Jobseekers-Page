import { baseApi } from '../baseApi';

const apiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['getBookmarkedCandidates'],
});

export const candidateBookmarksApiSlice = apiWithTag.injectEndpoints({
  tagTypes: ['getBookmarkedCandidates'],
  endpoints: builder => ({
    getBookmarkedCandidates: builder.query({
      query: params => ({
        url: '/candidatebookmarks?sort=-id',
        method: 'GET',
        params,
      }),
      providesTags: ['getBookmarkedCandidates'],
    }),
    bookmarkCandidate: builder.mutation({
      query: body => ({
        url: '/candidatebookmarks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['getBookmarkedCandidates'],
    }),
    removeBookmarkCandidate: builder.mutation({
      query: id => ({
        url: `/candidatebookmarks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getBookmarkedCandidates'],
    }),

    //
  }),
});
