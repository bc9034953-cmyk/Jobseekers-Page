import { baseApi } from './baseApi';

const apiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: [
    'getCustomerDetails',
    'getPlanDetails',
    'getCustomerPublicDetails',
  ],
});

export const usersApiSlice = apiWithTag.injectEndpoints({
  tagTypes: ['getCustomerDetails'],
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/customers/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: data => ({
        url: '/customers',
        method: 'POST',
        body: data,
      }),
    }),
    forgotEmailPassword: builder.mutation({
      query: data => ({
        url: '/customers/forgot_email_password',
        method: 'POST',
        body: data,
      }),
    }),
    verifyForgotEmailPasswordOtp: builder.mutation({
      query: data => ({
        url: '/customers/verify_email_forgot_password_otp',
        method: 'POST',
        body: data,
      }),
    }),
    verifyForgotMobilePasswordOtp: builder.mutation({
      query: data => ({
        url: '/customers/verify_forgot_password_otp',
        method: 'POST',
        body: data,
      }),
    }),
    verifyEmailOtp: builder.mutation({
      query: data => ({
        url: '/customers/verify_email_otp',
        method: 'POST',
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: data => ({
        url: '/customers/resend_email_otp',
        method: 'POST',
        body: data,
      }),
    }),
    forgotMobilePassword: builder.mutation({
      query: data => ({
        url: '/customers/forgot_password',
        method: 'POST',
        body: data,
      }),
    }),
    verifyMobileOtp: builder.mutation({
      query: data => ({
        url: '/customers/verify_mobile_otp',
        method: 'POST',
        body: data,
      }),
    }),
    resendMobileOtp: builder.mutation({
      query: data => ({
        url: '/customers/resend_mobile_otp',
        method: 'POST',
        body: data,
      }),
    }),
    // New endpoints for changing login fields
    changeLoginField: builder.mutation({
      query: data => ({
        url: '/customers/change_login_field',
        method: 'POST',
        body: data,
      }),
    }),
    changeLoginFieldConfirmation: builder.mutation({
      query: data => ({
        url: '/customers/change_login_field_confirmation',
        method: 'POST',
        body: data,
      }),
    }),
    getCustomerDetails: builder.query({
      query: id => ({
        url: `/customers/${id}`,
        method: 'GET',
      }),
      providesTags: ['getCustomerDetails'],
    }),
    getCustomerPublicDetails: builder.query({
      query: id => ({
        url: `/customers/public_details/${id}`,
        method: 'GET',
      }),
      providesTags: ['getCustomerPublicDetails'],
    }),
    customerDetails: builder.mutation({
      query: id => ({
        url: `/customers/${id}`,
        method: 'GET',
      }),
    }),
    getPlanDetails: builder.query({
      query: () => ({
        url: '/customers/plan_details',
        method: 'GET',
      }),
      providesTags: ['getPlanDetails'],
    }),
    updateProfile: builder.mutation({
      query: data => ({
        url: '/customers/update_customer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['getCustomerDetails'],
    }),
    changePassword: builder.mutation({
      query: data => ({
        url: '/customers/change_password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['getCustomerDetails'],
    }),
    changePasswordUsingOtp: builder.mutation({
      query: data => ({
        url: '/customers/change_password_using_otp',
        method: 'POST',
        body: data,
      }),
    }),
    getCustomerFullDetails: builder.mutation({
      query: customerId => ({
        url: `/customers/full_details?id=${customerId}`,
        method: 'GET',
      }),
      invalidatesTags: ['getPlanDetails'],
    }),
    downloadDocument: builder.mutation({
      query: params => ({
        url: '/customers/download_document',
        method: 'GET',
        params,
      }),
    }),
    getCustomers: builder.query({
      query: ({ type, params }) => {
        return {
          url: `/customers?CustomersSearch[customer_type]=${type}&per-page=100&page=1`,
          method: 'GET',
          params,
        };
      },
      invalidatesTags: ['getCustomerDetails'],
    }),

    //
  }),
});
