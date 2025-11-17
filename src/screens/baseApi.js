import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { apiHeaders } from '../utils';
import Configs from '../utils/Configs';

// https://bitcoden.com/answers/how-to-invalidate-rtk-query-cachesreset-state-globally

export const baseApi = createApi({
  reducerPath: 'base-api',
  baseQuery: fetchBaseQuery({
    baseUrl: Configs.API_URL,
    prepareHeaders: (headers, { getState }) => {
      return apiHeaders(headers, getState);
    },
  }),
  endpoints: builder => ({
    getFrontendSettings: builder.query({
      query: () => ({
        url: '/settings?SettingsSearch[module_name]=frontend&per-page=200',
        method: 'GET',
      }),
    }),
    getPageDetails: builder.query({
      query: name => ({
        url: `/pages?PageSearch[url_slug]=${name}`,
        method: 'GET',
      }),
    }),
    contactQuery: builder.mutation({
      query: body => ({
        url: '/contact_queries',
        method: 'POST',
        body,
      }),
    }),
    getPlans: builder.query({
      query: name => ({
        url: '/plans?sort=display_order',
        method: 'GET',
      }),
    }),
  }),
});
