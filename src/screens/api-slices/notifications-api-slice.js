import { baseApi } from '../baseApi';

const apiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['getNotifications'],
});

export const notificationsApiSlice = apiWithTag.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query({
      query: params => ({
        url: '/notifications?sort=-id&per-page=100&page=1',
        method: 'GET',
        params,
      }),
      providesTags: ['getNotifications'],
    }),

    markNotificationsViewed: builder.mutation({
      query: body => ({
        url: '/notifications/viewed',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['getNotifications'],
    }),

    //
  }),
});
