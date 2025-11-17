import { baseApi } from '../baseApi';

export const bannersApiSlice = baseApi.injectEndpoints({
  endpoints: builder => ({
    getBanners: builder.query({
      query: category => ({
        url: `banners?BannersSearch[category]=${category}&sort=display_order`,
        method: 'GET',
      }),
    }),

    //
  }),
});
