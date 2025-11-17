import { baseApi } from '../baseApi';

const apiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['getNotifications', 'creditHistory'],
});

export const checkoutApiSlice = apiWithTag.injectEndpoints({
  endpoints: builder => ({
    getPaymentGateways: builder.query({
      query: body => ({
        url: '/orders/payment_gateways?sort=display_order',
        method: 'GET',
        body,
      }),
    }),
    getCreditsHistory: builder.query({
      query: type => ({
        url: `/credits?sort=display_order&per-page=15&page=1&CreditsSearch[type]=${type}`,
        method: 'GET',
      }),
      invalidatesTags: ['creditHistory'],
    }),
    purchasePlan: builder.mutation({
      query: body => ({
        url: '/orders/checkout',
        method: 'POST',
        body,
      }),
    }),
    verifyPayment: builder.mutation({
      query: body => ({
        url: '/orders/verify_payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['getPlanDetails'],
    }),
    createPaymentApi: builder.mutation({
      query: body => ({
        url: '/orders/payment',
        method: 'POST',
        body,
      }),
    }),
  }),
});
